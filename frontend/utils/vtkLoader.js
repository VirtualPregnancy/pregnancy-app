/**
 * VTK File Loader Utility
 */

// Configuration Constants
const COLOR_CONSTANTS = {
  DEFAULT_COLOR: 0xff2222,
  DEFAULT_OPACITY: 0.9,
  DEFAULT_RADIUS_FALLBACK: 0.1,
  ARTERIAL_COLOR: 0xff2222,
  VENOUS_COLOR: 0x2222ff,
  // 5-segment pressure color mapping based on PanelControls.vue
  PRESSURE_COLORS: {
    LOW: { r: 173/255, g: 204/255, b: 83/255 },      // Light Green
    MID: { r: 250/255, g: 236/255, b: 79/255 },      // Yellow
    HIGH: { r: 242/255, g: 183/255, b: 68/255 },     // Orange
    MAX: { r: 170/255, g: 68/255, b: 47/255 },       // Red-Orange
    ULTRA: { r: 140/255, g: 41/255, b: 38/255 }      // Dark Red
  },
  // Flux color mapping - linear scale 0-10, >10 as high flow
  FLUX_COLORS: {
    ZERO: { r: 0.0, g: 0.2, b: 0.8 },        // Blue (0)
    LOW: { r: 0.2, g: 0.6, b: 1.0 },         // Light Blue (0-2.5)
    BLUE_LOW: { r: 0.0, g: 1.0, b: 0.5 },  // Green (2.5-5)
    MEDIUM_HIGH: { r: 1.0, g: 1.0, b: 0.0 }, // Yellow (5-7.5)
    HIGH: { r: 1.0, g: 0.5, b: 0.0 },        // Orange (7.5-10)
    RED_HIGH: { r: 1.0, g: 0.0, b: 0.0 }    // Red (>10)
  },
  FLUX_THRESHOLDS: {
    HIGH_FLOW: 10.0,
    MEDIUM_HIGH: 7.5,
    MEDIUM: 5.0,
    BLUE_LOW: 2.5
  }
};

export default class VTKLoader {
  constructor(threeOrRenderer, sceneOrName) {
    // Support both old and new constructor signatures
    if (threeOrRenderer && threeOrRenderer.createScene) {
      // New signature: VTKLoader(copperRenderer, sceneName)
      this.copperRenderer = threeOrRenderer;
      this.sceneName = sceneOrName || 'placental-scene';
      this.scene = this.getOrCreateScene(this.sceneName);
      this.THREE = window.THREE || threeOrRenderer.THREE;
    } else {
      // Old signature: VTKLoader(THREE, scene)
      this.THREE = threeOrRenderer;
      this.scene = sceneOrName;
      this.copperRenderer = null;
      this.sceneName = 'placental-scene';
    }
    
    this.currentVTKMesh = null;
    this.allVTKMeshes = [];
    this.geometryCache = new Map();  // Cache for processed geometries
    this.materialCache = new Map();  // Cache for materials
  }

  /**
   * Get or create Copper3D scene
   */
  getOrCreateScene(name) {
    if (!this.copperRenderer) {
      return this.scene; // Return existing scene for old signature
    }
    
    let scene = this.copperRenderer.getSceneByName?.(name);
    if (!scene) {
      scene = this.copperRenderer.createScene?.(name) || this.copperRenderer.scene;
      
      // Use Copper3D's built-in environment and lighting
      if (scene.updateBackground) {
        scene.updateBackground("#313657", "#1F6683");
      }
      
      // Let Copper3D handle lighting automatically
      if (this.copperRenderer.updateEnvironment) {
        this.copperRenderer.updateEnvironment();
      }
    }
    return scene;
  }

  // Main VTK file loader with options for color mapping, geometry type, etc.
  async loadVTKFile(vtkFilePath, options = {}) {
    const modelSize = options.modelSize || 420;
    const config = {
      displayName: 'placental model',
      color: COLOR_CONSTANTS.DEFAULT_COLOR,
      opacity: COLOR_CONSTANTS.DEFAULT_OPACITY,
      modelSize: modelSize,
      useCylinderGeometry: true,
      cylinderSegments: Math.max(6, Math.min(8, Math.round(modelSize / 60))),
      colorMappingType: 'pressure',
      defaultRotationY: 0, // Default horizontal rotation angle in radians
      clearScene: true,
      onProgress: null,
      onComplete: null,
      // Performance options
      performanceMode: options.performanceMode || 'balanced', // 'fast', 'balanced', 'quality'
      ...options 
    };

    if (config.onProgress) config.onProgress(`Initializing ${config.displayName}`, 0);

    try {
      return await this.loadStandard(vtkFilePath, config);
    } catch (error) {
      console.error(`[VTKLoader] Failed to load VTK file ${vtkFilePath}:`, error);
      return { success: false, error };
    }
  }

  async fetchVTKFile(vtkFilePath, onProgress = null) {
    if (onProgress) onProgress("Downloading model data...", 20);

    const response = await fetch(vtkFilePath);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    
    const vtkData = await response.text();
    if (onProgress) onProgress("Processing model data", 40);
    
    return vtkData;
  }

  /**
   * Parse VTK file format and convert to Three.js geometry
   */
  parseVTKData(vtkData, onProgress = null, modelSize, useCylinderGeometry = true, config = {}) {
    if (onProgress) {
      onProgress("Building model geometry", 60);
    }
    
    // Split file content into lines for processing
    const lines = vtkData.split('\n');
    const vertices = [];
    let isReadingPoints = false;
    let isReadingCells = false;
    let isReadingRadius = false;
    let isReadingPressure = false;
    let isReadingFlux = false;
    let points = [];
    let radiusData = [];
    let pressureData = [];
    let fluxData = [];
    let pointCount = 0;
    let cellConnections = [];

    // Process each line of the VTK file
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Update progress less frequently for better performance
      if (onProgress && i % 2000 === 0) {
        const progress = 60 + (i / lines.length) * 20;
        onProgress("Building model geometry", progress);
      }
      
      // Detect POINTS section
      if (line.startsWith('POINTS')) {
        const parts = line.split(' ');
        pointCount = parseInt(parts[1]);
        isReadingPoints = true;
        isReadingCells = false;
        isReadingRadius = false;
        isReadingPressure = false;
        continue;
      }
      
      // Detect CELLS/POLYGONS/LINES section
      if (line.startsWith('CELLS') || line.startsWith('POLYGONS') || line.startsWith('LINES')) {
        isReadingPoints = false;
        isReadingCells = true;
        isReadingRadius = false;
        isReadingPressure = false;
        isReadingFlux = false;
        continue;
      }
      
      // Detect POINT_DATA section
      if (line.startsWith('POINT_DATA')) {
        isReadingPoints = false;
        isReadingCells = false;
        isReadingRadius = false;
        isReadingPressure = false;
        isReadingFlux = false;
        continue;
      }
      
      // Detect SCALARS section
      if (line.startsWith('SCALARS')) {
        const parts = line.split(' ');
        if (parts.length > 1) {
          const scalarName = parts[1].toLowerCase();
          if (scalarName === 'radius') {
            isReadingRadius = true;
            isReadingPressure = false;
            isReadingFlux = false;
          } else if (scalarName === 'pressure') {
            isReadingRadius = false;
            isReadingPressure = true;
            isReadingFlux = false;
          } else if (scalarName === 'flux' || scalarName === 'flow') {
            isReadingRadius = false;
            isReadingPressure = false;
            isReadingFlux = true;
          } else {
            isReadingRadius = false;
            isReadingPressure = false;
            isReadingFlux = false;
          }
        }
        isReadingPoints = false;
        isReadingCells = false;
        continue;
      }
      
      // Skip LOOKUP_TABLE line
      if (line.startsWith('LOOKUP_TABLE')) {
        continue;
      }
      
      // Read point coordinates
      if (isReadingPoints && points.length < pointCount * 3) {
        const coords = line.split(' ').filter(x => x !== '').map(parseFloat);
        points.push(...coords);
      }
      
      // Read radius scalar data
      if (isReadingRadius && radiusData.length < pointCount) {
        const radii = line.split(' ').filter(x => x !== '').map(parseFloat);
        radiusData.push(...radii);
      }
      
      // Read pressure scalar data
      if (isReadingPressure && pressureData.length < pointCount) {
        const pressures = line.split(' ').filter(x => x !== '').map(parseFloat);
        pressureData.push(...pressures);
      }
      
      // Read flux scalar data
      if (isReadingFlux && fluxData.length < pointCount) {
        const fluxes = line.split(' ').filter(x => x !== '').map(parseFloat);
        fluxData.push(...fluxes);
      }
      
      // Read cell connectivity data
      if (isReadingCells && line.trim() !== '' && 
          !line.startsWith('CELL_TYPES') && 
          !line.startsWith('POINT_DATA') && 
          !line.startsWith('SCALARS') &&
          !line.startsWith('LOOKUP_TABLE')) {
        
        const parts = line.split(' ').filter(x => x !== '');
        const indices = parts.map(x => parseInt(x)).filter(x => !isNaN(x));
        
        if (indices.length > 1) {
          const cellSize = indices[0];
          
          if (indices.length === cellSize + 1) {
            cellConnections.push(indices);
          }
        }
      }
      
      // Stop reading cells if we encounter other sections
      if (line.startsWith('CELL_TYPES') || line.startsWith('POINT_DATA')) {
        isReadingCells = false;
      }
    }

    // Create Three.js BufferGeometry from parsed data
    const geometry = new this.THREE.BufferGeometry();
    
    // If cylinder geometry is requested and we have radius data, create cylinders
    if (useCylinderGeometry && radiusData.length > 0 && cellConnections.length > 0) {
      const cylinderGeometry = this.createCylinderGeometry(points, radiusData, pressureData, fluxData, cellConnections, modelSize, config);
      return { geometry: cylinderGeometry, isPointCloud: false, radiusData, pressureData, fluxData };
    }
    
    // Fallback to point cloud if no line segments were created
    if (vertices.length === 0 && points.length > 0) {
      geometry.setAttribute('position', new this.THREE.Float32BufferAttribute(points, 3));
      
      if (radiusData.length > 0) {
        geometry.setAttribute('radius', new this.THREE.Float32BufferAttribute(radiusData, 1));
      }
      if (pressureData.length > 0) {
        geometry.setAttribute('pressure', new this.THREE.Float32BufferAttribute(pressureData, 1));
      }
      if (fluxData.length > 0) {
        geometry.setAttribute('flux', new this.THREE.Float32BufferAttribute(fluxData, 1));
      }
      
      return { geometry, isPointCloud: true, radiusData, pressureData, fluxData }; 
    } else {
      geometry.setAttribute('position', new this.THREE.Float32BufferAttribute(vertices, 3));
    }
    
    // Calculate bounding box for centering and scaling
    geometry.computeBoundingBox();
    const center = geometry.boundingBox.getCenter(new this.THREE.Vector3());
    const size = geometry.boundingBox.getSize(new this.THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = modelSize / maxDim;
    
    // Transform geometry: center at origin and scale to appropriate size
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.scale(scale, scale, scale);
    
    return { geometry, isPointCloud: false, radiusData, pressureData, fluxData };
  }

  /**
   * Create tube geometry from LINES data
   * Generates rings along each line without extra joint-connection work
   * LINES format: [numPoints, point1, point2, point3, ...] where points are connected sequentially
   */
  createCylinderGeometry(points, radiusData, pressureData, fluxData, cellConnections, modelSize, config) {
    // Create cache key based on data
    const cacheKey = `${points.length}_${radiusData.length}_${config.colorMappingType}`;
    
    // Check geometry cache first
    if (this.geometryCache.has(cacheKey)) {
      return this.geometryCache.get(cacheKey).clone();
    }

    const combinedGeometry = new this.THREE.BufferGeometry();
    const vertices = [];
    const normals = [];
    const colors = [];
    const indices = [];
    let indexOffset = 0;
    
    // Adaptive radial segments based on performance mode
    let radialSegments;
    switch (config.performanceMode) {
      case 'fast':
        radialSegments = 4;
        break;
      case 'quality':
        radialSegments = 8;
        break;
      default: // balanced
        radialSegments = Math.max(4, Math.min(6, Math.round(modelSize / 100)));
    }
    
    // Calculate data ranges for color mapping
    let minPressure = Infinity;
    let maxPressure = -Infinity;
    let minFlux = Infinity;
    let maxFlux = -Infinity;
    if (config.colorMappingType === 'pressure' && pressureData.length > 0) {
      const { min, max } = this.getOverStackMinMax(pressureData);
      minPressure = min;
      maxPressure = max;
    } else if (config.colorMappingType === 'flux' && fluxData.length > 0) {
      const { min, max } = this.getOverStackMinMax(fluxData);
      minFlux = min;
      maxFlux = max;
    }
    
    // Process each line to create smooth continuous tubes
    for (const connection of cellConnections) {
      const cellSize = connection[0];
      
      if (cellSize < 2) continue; // Skip lines with less than 2 points
      
      // Create smooth tube for this entire line
      const tubeGeometry = this.createSmoothTube(
        connection, points, radiusData, pressureData, fluxData,
        radialSegments, minPressure, maxPressure, minFlux, maxFlux, config
      );
      
      // Validate tube geometry
      if (tubeGeometry.vertices.length > 0 && tubeGeometry.indices.length > 0) {
        // Add tube geometry to combined mesh
        vertices.push(...tubeGeometry.vertices);
        normals.push(...tubeGeometry.normals);
        colors.push(...tubeGeometry.colors);
        
        // Add indices with offset
        for (const index of tubeGeometry.indices) {
          indices.push(index + indexOffset);
        }
        
        // Update index offset
        indexOffset += tubeGeometry.vertices.length / 3;
      } else {
        console.warn(`[VTKLoader] Skipping invalid tube geometry for line ${lineIndex}`);
      }
    }
    
    // Skip creating spherical junctions at branching points to improve load time
    
    // Set geometry attributes
    combinedGeometry.setAttribute('position', new this.THREE.Float32BufferAttribute(vertices, 3));
    combinedGeometry.setAttribute('normal', new this.THREE.Float32BufferAttribute(normals, 3));
    combinedGeometry.setAttribute('color', new this.THREE.Float32BufferAttribute(colors, 3));
    combinedGeometry.setIndex(indices);
    
    // Calculate bounding box and apply scaling
    combinedGeometry.computeBoundingBox();
    const center = combinedGeometry.boundingBox.getCenter(new this.THREE.Vector3());
    const size = combinedGeometry.boundingBox.getSize(new this.THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = modelSize / maxDim;
    
    // Transform geometry: center at origin, scale to appropriate size, and apply rotation
    combinedGeometry.translate(-center.x, -center.y, -center.z);
    combinedGeometry.scale(scale, scale, scale);
    
    // Apply default horizontal rotation if specified
    if (config.defaultRotationY !== 0) {
      combinedGeometry.rotateY(config.defaultRotationY);
    }
    
    // Cache the geometry for future use
    if (this.geometryCache.size < 10) {
      this.geometryCache.set(cacheKey, combinedGeometry.clone());
    }
    
    return combinedGeometry;
  }

  getOverStackMinMax(arr) {
    if (!arr || arr.length === 0) {
      return { min: undefined, max: undefined };
    }
  
    let min = Infinity;
    let max = -Infinity;
  
    for (let val of arr) {
      if (val < min) min = val;
      if (val > max) max = val;
    }
  
    return { min, max };
  }

  /**
   * Map pressure value 
   */
  pressureToColor(pressure, minPressure, maxPressure) {
    const linear = maxPressure > minPressure ? 
      (pressure - minPressure) / (maxPressure - minPressure) : 0.5;
    
    const color = new this.THREE.Color();
    
    // 5-segment color mapping using constants from file top
    if (linear < 0.2) {
      // Pressure Low: Light Green
      color.setRGB(COLOR_CONSTANTS.PRESSURE_COLORS.LOW.r, COLOR_CONSTANTS.PRESSURE_COLORS.LOW.g, COLOR_CONSTANTS.PRESSURE_COLORS.LOW.b);
    } else if (linear < 0.4) {
      // Pressure Mid: Yellow
      color.setRGB(COLOR_CONSTANTS.PRESSURE_COLORS.MID.r, COLOR_CONSTANTS.PRESSURE_COLORS.MID.g, COLOR_CONSTANTS.PRESSURE_COLORS.MID.b);
    } else if (linear < 0.6) {
      // Pressure High: Orange
      color.setRGB(COLOR_CONSTANTS.PRESSURE_COLORS.HIGH.r, COLOR_CONSTANTS.PRESSURE_COLORS.HIGH.g, COLOR_CONSTANTS.PRESSURE_COLORS.HIGH.b);
    } else if (linear < 0.8) {
      // Pressure Max: Red-Orange
      color.setRGB(COLOR_CONSTANTS.PRESSURE_COLORS.MAX.r, COLOR_CONSTANTS.PRESSURE_COLORS.MAX.g, COLOR_CONSTANTS.PRESSURE_COLORS.MAX.b);
    } else {
      // Pressure Ultra: Dark Red
      color.setRGB(COLOR_CONSTANTS.PRESSURE_COLORS.ULTRA.r, COLOR_CONSTANTS.PRESSURE_COLORS.ULTRA.g, COLOR_CONSTANTS.PRESSURE_COLORS.ULTRA.b);
    }
    
    return color;
  }

  /**
   * Map flux value to color using linear flow-based color scheme
   * >10 as high flow, 0-10 divided evenly for other colors
   */
  fluxToColor(flux, minFlux, maxFlux) {
    const color = new this.THREE.Color();
    
    // Handle edge case where all flux values are the same
    if (maxFlux === minFlux) {
      color.setRGB(0.5, 0.5, 0.5);
      return color;
    }
    
    // Use absolute value for flux mapping
    const absFlux = Math.abs(flux);
    const { FLUX_COLORS, FLUX_THRESHOLDS } = COLOR_CONSTANTS;
    
    // Determine color based on flux value ranges
    if (absFlux <= 0) {
      // Zero flow - blue
      color.setRGB(FLUX_COLORS.ZERO.r, FLUX_COLORS.ZERO.g, FLUX_COLORS.ZERO.b);
    } else if (absFlux <= FLUX_THRESHOLDS.BLUE_LOW) {
      // Low flow (0-2.5) - light blue
      const t = absFlux / FLUX_THRESHOLDS.BLUE_LOW;
      color.setRGB(
        FLUX_COLORS.ZERO.r + (FLUX_COLORS.LOW.r - FLUX_COLORS.ZERO.r) * t,
        FLUX_COLORS.ZERO.g + (FLUX_COLORS.LOW.g - FLUX_COLORS.ZERO.g) * t,
        FLUX_COLORS.ZERO.b + (FLUX_COLORS.LOW.b - FLUX_COLORS.ZERO.b) * t
      );
    } else if (absFlux <= FLUX_THRESHOLDS.MEDIUM) {
      // Medium-low flow (2.5-5) - green
      const t = (absFlux - FLUX_THRESHOLDS.BLUE_LOW) / (FLUX_THRESHOLDS.MEDIUM - FLUX_THRESHOLDS.BLUE_LOW);
      color.setRGB(
        FLUX_COLORS.LOW.r + (FLUX_COLORS.BLUE_LOW.r - FLUX_COLORS.LOW.r) * t,
        FLUX_COLORS.LOW.g + (FLUX_COLORS.BLUE_LOW.g - FLUX_COLORS.LOW.g) * t,
        FLUX_COLORS.LOW.b + (FLUX_COLORS.BLUE_LOW.b - FLUX_COLORS.LOW.b) * t
      );
    } else if (absFlux <= FLUX_THRESHOLDS.MEDIUM_HIGH) {
      // Medium-high flow (5-7.5) - yellow
      const t = (absFlux - FLUX_THRESHOLDS.MEDIUM) / (FLUX_THRESHOLDS.MEDIUM_HIGH - FLUX_THRESHOLDS.MEDIUM);
      color.setRGB(
        FLUX_COLORS.BLUE_LOW.r + (FLUX_COLORS.MEDIUM_HIGH.r - FLUX_COLORS.BLUE_LOW.r) * t,
        FLUX_COLORS.BLUE_LOW.g + (FLUX_COLORS.MEDIUM_HIGH.g - FLUX_COLORS.BLUE_LOW.g) * t,
        FLUX_COLORS.BLUE_LOW.b + (FLUX_COLORS.MEDIUM_HIGH.b - FLUX_COLORS.BLUE_LOW.b) * t
      );
    } else if (absFlux <= FLUX_THRESHOLDS.HIGH_FLOW) {
      // High flow (7.5-10) - orange
      const t = (absFlux - FLUX_THRESHOLDS.MEDIUM_HIGH) / (FLUX_THRESHOLDS.HIGH_FLOW - FLUX_THRESHOLDS.MEDIUM_HIGH);
      color.setRGB(
        FLUX_COLORS.MEDIUM_HIGH.r + (FLUX_COLORS.HIGH.r - FLUX_COLORS.MEDIUM_HIGH.r) * t,
        FLUX_COLORS.MEDIUM_HIGH.g + (FLUX_COLORS.HIGH.g - FLUX_COLORS.MEDIUM_HIGH.g) * t,
        FLUX_COLORS.MEDIUM_HIGH.b + (FLUX_COLORS.HIGH.b - FLUX_COLORS.MEDIUM_HIGH.b) * t
      );
    } else {
      // Very high flow (>10) - red
      color.setRGB(FLUX_COLORS.RED_HIGH.r, FLUX_COLORS.RED_HIGH.g, FLUX_COLORS.RED_HIGH.b);
    }
    
    return color;
  }

  /**
   * Create a smooth continuous tube along a line of points
   * This eliminates the "bamboo joint" effect by creating seamless rings
   */
  createSmoothTube(connection, points, radiusData, pressureData, fluxData, radialSegments, minPressure, maxPressure, minFlux, maxFlux, config) {
    const vertices = [];
    const normals = [];
    const colors = [];
    const indices = [];
    
    const cellSize = connection[0];
    const pointIndices = connection.slice(1, cellSize + 1);
    
    // Apply conservative point sampling only if needed for performance
    let processedIndices = pointIndices;
    
    if (config.performanceMode === 'fast' && pointIndices.length > 30) {
      // Only sample if we have too many points and are in fast mode
      const step = Math.ceil(pointIndices.length / 20); // Keep max 20 points
      processedIndices = [];
      for (let i = 0; i < pointIndices.length; i += step) {
        processedIndices.push(pointIndices[i]);
      }
      // Always include the last point
      if (processedIndices[processedIndices.length - 1] !== pointIndices[pointIndices.length - 1]) {
        processedIndices.push(pointIndices[pointIndices.length - 1]);
      }
    }
    
    // Generate rings for all processed points
    for (let i = 0; i < processedIndices.length; i++) {
      const pointIdx = processedIndices[i];
      
      // Get point data
      const point = new this.THREE.Vector3(
        points[pointIdx * 3],
        points[pointIdx * 3 + 1],
        points[pointIdx * 3 + 2]
      );
      
      // Apply smooth radius interpolation to reduce sharp transitions
      let radius = radiusData[pointIdx] || COLOR_CONSTANTS.DEFAULT_RADIUS_FALLBACK;
      
      // Smooth radius transitions between points
      if (i > 0 && i < processedIndices.length - 1) {
        const prevRadius = radiusData[processedIndices[i - 1]] || COLOR_CONSTANTS.DEFAULT_RADIUS_FALLBACK;
        const nextRadius = radiusData[processedIndices[i + 1]] || COLOR_CONSTANTS.DEFAULT_RADIUS_FALLBACK;
        
        // Weighted average for smoother transitions
        radius = radius * 0.6 + prevRadius * 0.2 + nextRadius * 0.2;
      }
      
      // Get color based on mapping type
      let color;
      if (config.colorMappingType === 'pressure' && pressureData.length > 0) {
        const pressure = pressureData[pointIdx] || 0;
        color = this.pressureToColor(pressure, minPressure, maxPressure);
      } else if (config.colorMappingType === 'flux' && fluxData.length > 0) {
        const flux = fluxData[pointIdx] || 0;
        color = this.fluxToColor(flux, minFlux, maxFlux);
      } else {
        color = new this.THREE.Color(1, 1, 1);
      }
      
      // Calculate smooth direction for this ring
      let direction;
      if (i === 0) {
        // First point: use direction to next point
        const nextPoint = new this.THREE.Vector3(
          points[processedIndices[i + 1] * 3],
          points[processedIndices[i + 1] * 3 + 1],
          points[processedIndices[i + 1] * 3 + 2]
        );
        direction = new this.THREE.Vector3().subVectors(nextPoint, point).normalize();
      } else if (i === processedIndices.length - 1) {
        // Last point: use direction from previous point
        const prevPoint = new this.THREE.Vector3(
          points[processedIndices[i - 1] * 3],
          points[processedIndices[i - 1] * 3 + 1],
          points[processedIndices[i - 1] * 3 + 2]
        );
        direction = new this.THREE.Vector3().subVectors(point, prevPoint).normalize();
      } else {
        // Middle point: use smooth average direction with weighted interpolation
        const prevPoint = new this.THREE.Vector3(
          points[processedIndices[i - 1] * 3],
          points[processedIndices[i - 1] * 3 + 1],
          points[processedIndices[i - 1] * 3 + 2]
        );
        const nextPoint = new this.THREE.Vector3(
          points[processedIndices[i + 1] * 3],
          points[processedIndices[i + 1] * 3 + 1],
          points[processedIndices[i + 1] * 3 + 2]
        );
        const dir1 = new this.THREE.Vector3().subVectors(point, prevPoint).normalize();
        const dir2 = new this.THREE.Vector3().subVectors(nextPoint, point).normalize();
        
        // Smooth interpolation between directions
        direction = new this.THREE.Vector3().addVectors(dir1, dir2).normalize();
        
        // Apply smoothing to reduce sharp turns
        const smoothingFactor = 0.3;
        direction.lerp(new this.THREE.Vector3().addVectors(dir1, dir2).normalize(), smoothingFactor);
      }
      
      // Create perpendicular vectors for ring orientation
      const up = new this.THREE.Vector3(0, 1, 0);
      const right = new this.THREE.Vector3().crossVectors(direction, up).normalize();
      if (right.lengthSq() < 0.1) {
        right.crossVectors(direction, new this.THREE.Vector3(1, 0, 0)).normalize();
      }
      const forward = new this.THREE.Vector3().crossVectors(right, direction).normalize();
      
      // Generate ring vertices
      for (let segment = 0; segment < radialSegments; segment++) {
        const angle = (segment / radialSegments) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        // Calculate vertex position
        const vertexPos = new this.THREE.Vector3()
          .copy(point)
          .add(right.clone().multiplyScalar(x))
          .add(forward.clone().multiplyScalar(y));
        
        vertices.push(vertexPos.x, vertexPos.y, vertexPos.z);
        
        // Calculate normal (pointing outward from center)
        const normal = new this.THREE.Vector3()
          .copy(right.clone().multiplyScalar(x))
          .add(forward.clone().multiplyScalar(y))
          .normalize();
        
        normals.push(normal.x, normal.y, normal.z);
        colors.push(color.r, color.g, color.b);
      }
    }
    
    // Generate indices for tube walls (connect rings)
    for (let ring = 0; ring < processedIndices.length - 1; ring++) {
      for (let segment = 0; segment < radialSegments; segment++) {
        const current = ring * radialSegments + segment;
        const next = ring * radialSegments + ((segment + 1) % radialSegments);
        const currentNext = (ring + 1) * radialSegments + segment;
        const nextNext = (ring + 1) * radialSegments + ((segment + 1) % radialSegments);
        
        // Two triangles per quad
        indices.push(current, next, currentNext);
        indices.push(currentNext, next, nextNext);
      }
    }
    
    return { vertices, normals, colors, indices };
  }

  /**
   * Previously contained legacy junction helpers; removed for performance.
   */

  /**
   * Create appropriate mesh from geometry
   */
  createVTKMesh(geometry, isPointCloud, config, radiusData = null, pressureData = null, fluxData = null) {
    let vtkMesh;
    
    if (isPointCloud) {
      const material = new this.THREE.PointsMaterial({
        color: config.color,
        size: config.pointSize || 8,
        transparent: true,
        opacity: config.opacity,
        sizeAttenuation: true
      });
      vtkMesh = new this.THREE.Points(geometry, material);
      
    } else if (config.useCylinderGeometry && radiusData && radiusData.length > 0) {
      // Determine if we should use vertex colors
      const useVertexColors = (config.colorMappingType === 'pressure' && pressureData && pressureData.length > 0) ||
                              (config.colorMappingType === 'flux' && fluxData && fluxData.length > 0);
      
      // Set base color
      let baseColor = config.color;
      if (config.colorMappingType === 'default') {
        baseColor = config.color;
      } else if (useVertexColors) {
        baseColor = 0xffffff;
      }
      
      // Check material cache
      const materialKey = `${baseColor}_${config.opacity}_${useVertexColors}`;
      let material = this.materialCache.get(materialKey);
      
      if (!material) {
        material = new this.THREE.MeshMatcapMaterial({
          color: baseColor,
          transparent: config.opacity < 1.0,
          opacity: config.opacity,
          vertexColors: useVertexColors,
          side: this.THREE.FrontSide,
          depthWrite: config.opacity >= 1.0,
          alphaTest: config.opacity < 1.0 ? 0.01 : 0
        });
        
        // Cache material for reuse
        if (this.materialCache.size < 20) {
          this.materialCache.set(materialKey, material);
        }
      }
      
      vtkMesh = new this.THREE.Mesh(geometry, material);
      
    } else {
      // Create line segment visualization
      const vesselMaterial = new this.THREE.LineBasicMaterial({
        color: config.color,
        linewidth: config.lineWidth || 2,
        transparent: true,
        opacity: config.opacity
      });
      
      vtkMesh = new this.THREE.LineSegments(geometry, vesselMaterial);
    }
    
    return vtkMesh;
  }

  /**
   * Add mesh to scene
   */
  addToScene(mesh, config = {}) {
    // Clear existing meshes
    if (config.clearPrevious !== false) {
      if (this.currentVTKMesh) {
        const targetScene = this.scene?.scene || this.scene;
        if (targetScene && targetScene.remove) {
          targetScene.remove(this.currentVTKMesh);
        }
      }
    }
    
    // Get the actual Three.js scene object
    const targetScene = this.scene?.scene || this.scene;
    
    if (targetScene && targetScene.add) {
      targetScene.add(mesh);
    } else {
      console.warn('[VTKLoader] Unable to add mesh to scene - scene not available');
      return;
    }
    
    this.allVTKMeshes.push(mesh);
    this.currentVTKMesh = mesh;
    
    // Let Copper3D handle rendering
    if (this.copperRenderer && this.copperRenderer.render) {
      this.copperRenderer.render();
    }
  }

  /**
   * Scale all loaded models without re-rendering
   */
  scaleModel(newSize) {
    if (!this.allVTKMeshes || this.allVTKMeshes.length === 0) {
      console.warn('[VTKLoader] No meshes to scale');
      return;
    }

    // Calculate scale factor based on new size
    // Original size from modelData is 200
    const originalSize = 200;
    const scaleFactor = newSize / originalSize;

    // Apply scaling to all meshes
    this.allVTKMeshes.forEach(mesh => {
      if (mesh && mesh.scale) {
        mesh.scale.setScalar(scaleFactor);
      }
    });

    // Update current mesh if it exists
    if (this.currentVTKMesh && this.currentVTKMesh.scale) {
      this.currentVTKMesh.scale.setScalar(scaleFactor);
    }

    // Trigger re-render
    if (this.copperRenderer && this.copperRenderer.render) {
      this.copperRenderer.render();
    }

    console.log(`[VTKLoader] Scaled model to size: ${newSize} (scale factor: ${scaleFactor.toFixed(3)})`);
  }

  // Joint-connection helpers (branch detection, spherical junctions) removed to improve load time

  /**
   * Set reference to copper scene for camera control
   */
  setCopperScene(copperScene) {
    this.copperScene = copperScene;
  }

  /**
   * Clear temporary data
   */
  clearTemporaryData() {
    // Placeholder for future functionality
  }

  /**
   * Standard loading without LoD optimization
   */
  async loadStandard(vtkFilePath, config) {
    // Fetch and parse VTK file
    const vtkData = await this.fetchVTKFile(vtkFilePath, config.onProgress);
    const parseResult = this.parseVTKData(vtkData, config.onProgress, config.modelSize, config.useCylinderGeometry, config);
    const { geometry, isPointCloud, radiusData, pressureData, fluxData } = parseResult;
    
    // Create appropriate mesh
    const mesh = this.createVTKMesh(geometry, isPointCloud, config, radiusData, pressureData, fluxData);
    
    // Add to scene
    this.addToScene(mesh, config);
    
    // Call completion callback
    if (config.onComplete) {
      config.onComplete(mesh, isPointCloud, radiusData, pressureData, fluxData);
    }
    
    return { success: true, mesh, isPointCloud, radiusData, pressureData, fluxData };
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.geometryCache.clear();
    this.materialCache.clear();
  }

  /**
   * Clean up resources
   */
  dispose() {
    // Remove all tracked VTK meshes
    this.allVTKMeshes.forEach(mesh => {
      this.scene.remove(mesh);
    });
    this.allVTKMeshes = [];
    
    if (this.currentVTKMesh) {
      this.scene.remove(this.currentVTKMesh);
      this.currentVTKMesh = null;
    }
    
    // Clear cache
    this.geometryCache.clear();
    this.materialCache.clear();
    
    this.copperScene = null;
  }
} 
