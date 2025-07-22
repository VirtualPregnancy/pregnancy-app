/**
 * VTK File Loader Utility
 * Provides reusable functions for loading and processing VTK files in Three.js
 * 
 * Usage:
 * import VTKLoader from '@/utils/vtkLoader'
 * const loader = new VTKLoader(THREE, scene)
 * await loader.loadVTKFile('/path/to/file.vtk', options)
 */

export default class VTKLoader {
  /**
   * Initialize VTK Loader
   * @param {Object} THREE - Three.js library instance
   * @param {Object} scene - Three.js scene object
   */
  constructor(THREE, scene) {
    this.THREE = THREE;
    this.scene = scene;
    this.currentVTKMesh = null;
    this.wireframeMesh = null;
    this.lightingInitialized = false;
    
    // Performance optimization properties
    this.performanceMode = 'auto'; // 'high', 'medium', 'low', 'auto'
    this.lodLevels = [
      { distance: 50, segments: 8, radiusScale: 1.0 },   // Close: high detail
      { distance: 150, segments: 6, radiusScale: 0.8 },  // Medium: medium detail  
      { distance: 400, segments: 4, radiusScale: 0.6 },  // Far: low detail
      { distance: Infinity, segments: 3, radiusScale: 0.4 } // Very far: minimal detail
    ];
    this.frameCounter = 0;
    this.performanceMonitor = {
      lastFrameTime: Date.now(),
      frameRate: 60,
      lowFrameCount: 0
    };
    this.maxSegmentsPerBatch = 1000; // Process tubes in batches
    this.mergeThreshold = 0.5; // Minimum tube length to keep separate
    this.debugSegmentCount = 0; // Debug counter for variable radius tubes
  }

  /**
   * Generic VTK file loader - can load any VTK file with custom settings
   * @param {string} vtkFilePath - Path to VTK file
   * @param {Object} options - Configuration options
   * @param {string} options.displayName - Display name for user (default: 'VTK Model')
   * @param {number} options.color - Hex color for the model (default: 0xff2222)
   * @param {number} options.opacity - Opacity value 0-1 (default: 0.9)
   * @param {number} options.lineWidth - Line width for line segments (auto-calculated if not provided)
   * @param {number} options.pointSize - Point size for point cloud (auto-calculated if not provided)
   * @param {number} options.modelSize - Target model size in units (default: 420)
   * @param {boolean} options.enableWireframe - Enable wireframe overlay (default: true)
   * @param {boolean} options.enableTubeMesh - Enable tube/cylinder rendering instead of lines
   * @param {number} options.tubeRadiusScale - Scale factor for tube radius
   * @param {number} options.tubeSegments - Number of radial segments for tubes
   * @param {Function} options.onProgress - Progress callback function
   * @param {Function} options.onComplete - Completion callback function
   * @returns {Promise<Object>} - {success: boolean, mesh: THREE.Object3D, error?: Error}
   */
  async loadVTKFile(vtkFilePath, options = {}) {
    // Set default options with auto-scaling based on model size
    const modelSize = options.modelSize || 420; // Default target size
    const config = {
      displayName: 'VTK Model',
      color: 0xff2222,
      opacity: 0.9,
      modelSize: modelSize,
      // Auto-calculate line width and point size based on model size if not provided
      lineWidth: options.lineWidth || Math.max(2, Math.round(modelSize / 70)), // Scale: 420→6, 280→4, 140→2
      pointSize: options.pointSize || Math.max(8, Math.round(modelSize / 17)), // Scale: 420→25, 280→16, 140→8
      enableWireframe: true,
      enableTubeMesh: false, // Enable tube/cylinder rendering instead of lines
      tubeRadiusScale: 1.0,  // Scale factor for tube radius
      tubeSegments: 8,       // Number of radial segments for tubes
      onProgress: null,
      onComplete: null,
      ...options
    };

    //console.log(`[VTKLoader] Loading VTK file: ${vtkFilePath}`, config);
    
    // Call progress callback
    if (config.onProgress) {
      config.onProgress(`Loading ${config.displayName}...`, 0);
    }

    try {
      // Fetch and parse VTK file
      const vtkData = await this.fetchVTKFile(vtkFilePath, config.onProgress);
      const parseResult = this.parseVTKData(vtkData, config.onProgress, config.modelSize, config.enableTubeMesh);
      const { geometry, isPointCloud, segments, radii } = parseResult;
      
      // Create appropriate mesh with custom settings
      let mesh;
      if (config.enableTubeMesh && segments && radii) {
        mesh = await this.createOptimizedTubeMesh(segments, radii, config);
      } else {
        mesh = this.createVTKMesh(geometry, isPointCloud, config);
      }
      
      // Add to scene with enhanced lighting
      this.addToScene(mesh, config);
      
      // Call completion callback
      if (config.onComplete) {
        config.onComplete(mesh, isPointCloud);
      }
      
      //console.log(`[VTKLoader] Successfully loaded: ${config.displayName}`);
      return { success: true, mesh, isPointCloud };
      
    } catch (error) {
      console.error(`[VTKLoader] Failed to load VTK file ${vtkFilePath}:`, error);
      return { success: false, error };
    }
  }

  /**
   * Fetch VTK file from server
   * @param {string} vtkFilePath - Path to VTK file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<string>} - VTK file content as text
   */
  async fetchVTKFile(vtkFilePath, onProgress = null) {
    //console.log("[VTKLoader] Fetching VTK file...");
    
    if (onProgress) {
      onProgress("Downloading file...", 10);
    }

    const response = await fetch(vtkFilePath);
    
    // Check if file was found
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Read VTK file content as text
    const vtkData = await response.text();
    //console.log("[VTKLoader] VTK file loaded, size:", vtkData.length, "characters");
    
    if (onProgress) {
      onProgress("File downloaded, parsing data...", 30);
    }
    
    return vtkData;
  }

  /**
   * Parse VTK file format and convert to Three.js geometry
   * @param {string} vtkData - VTK file content
   * @param {Function} onProgress - Progress callback
   * @param {number} modelSize - Target model size in units (default: 420)
   * @param {boolean} enableTubeMesh - Whether to enable tube/cylinder rendering
   * @returns {Object} - {geometry: THREE.BufferGeometry, isPointCloud: boolean, segments?: number[], radii?: number[]}
   */
  parseVTKData(vtkData, onProgress = null,modelSize, enableTubeMesh) {
    //console.log("[VTKLoader] Starting VTK data parsing...");
    
    if (onProgress) {
      onProgress("Parsing VTK data structure...", 40);
    }
    
    // Split file content into lines for processing
    const lines = vtkData.split('\n');
    const vertices = [];        // Final array of vertex coordinates for Three.js
    let isReadingPoints = false; // Flag: currently reading point coordinates
    let isReadingCells = false;  // Flag: currently reading cell connectivity
    let isReadingScalars = false; // Flag: currently reading scalar data (like radius)
    let points = [];            // Temporary storage for all point coordinates
    let pointCount = 0;         // Total number of points in file
    let cellCount = 0;
    let radii = [];             // Array to store radius data for each point
    let segments = [];          // Array to store line segments with indices
    let scalarName = '';        // Name of the scalar field being read          // Total number of cells (connections) in file

    // Process each line of the VTK file
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Update progress periodically
      if (onProgress && i % 1000 === 0) {
        const progress = 40 + (i / lines.length) * 30; // 40-70% progress
        onProgress("Parsing VTK data...", progress);
      }
      
      // Detect POINTS section - contains 3D coordinates
      if (line.startsWith('POINTS')) {
        const parts = line.split(' ');
        pointCount = parseInt(parts[1]); // Extract number of points
        //console.log("[VTKLoader] Found", pointCount, "3D points in VTK file");
        isReadingPoints = true;
        isReadingCells = false;
        continue;
      }
      
      // Detect CELLS/POLYGONS/LINES section - contains connectivity information
      if (line.startsWith('CELLS') || line.startsWith('POLYGONS') || line.startsWith('LINES')) {
        const parts = line.split(' ');
        if (parts.length > 1) {
          cellCount = parseInt(parts[1]); // Extract number of cells
          //console.log("[VTKLoader] Found", cellCount, "cells/connections in VTK file");
        }
        isReadingPoints = false;
        isReadingCells = true;
        isReadingScalars = false;
        continue;
      }
      
      // Detect POINT_DATA section - contains data associated with points
      if (line.startsWith('POINT_DATA')) {
        const parts = line.split(' ');
        if (parts.length > 1) {
          //console.log("[VTKLoader] Found POINT_DATA section with", parts[1], "entries");
        }
        isReadingPoints = false;
        isReadingCells = false;
        isReadingScalars = false;
        continue;
      }
      
      // Detect SCALARS section - contains scalar values like radius
      if (line.startsWith('SCALARS')) {
        const parts = line.split(' ');
        if (parts.length > 1) {
          scalarName = parts[1];
          //console.log("[VTKLoader] Found SCALARS section:", scalarName);
          if (scalarName.toLowerCase().includes('radius') || scalarName.toLowerCase().includes('diameter')) {
            //console.log("[VTKLoader] Detected radius/diameter data");
          }
        }
        isReadingPoints = false;
        isReadingCells = false;
        isReadingScalars = false; // Will be set to true after LOOKUP_TABLE line
        continue;
      }
      
      // LOOKUP_TABLE line follows SCALARS - after this we start reading scalar values
      if (line.startsWith('LOOKUP_TABLE')) {
        if (scalarName) {
          //console.log("[VTKLoader] Starting to read scalar values for:", scalarName);
          isReadingScalars = true;
        }
        isReadingPoints = false;
        isReadingCells = false;
        continue;
      }
      
      // Read point coordinates (x, y, z values)
      if (isReadingPoints && points.length < pointCount * 3) {
        // Split line into numbers, filter empty strings, convert to float
        const coords = line.split(' ').filter(x => x !== '').map(parseFloat);
        points.push(...coords); // Add all coordinates to points array
      }
      
      // Read scalar values (like radius data)
      if (isReadingScalars && radii.length < pointCount && line.trim() !== '') {
        const values = line.split(' ').filter(x => x !== '').map(parseFloat);
        radii.push(...values);
        
        // Log progress for radius reading
        if (radii.length % 1000 === 0 || radii.length === pointCount) {
          //console.log(`[VTKLoader] Read ${radii.length}/${pointCount} scalar values (${scalarName})`);
        }
      }
      
      // Skip non-numeric lines in cells section (like CELL_TYPES, POINT_DATA, etc.)
      if (isReadingCells && line.trim() !== '' && 
          !line.startsWith('CELL_TYPES') && 
          !line.startsWith('POINT_DATA') && 
          !line.startsWith('SCALARS') &&
          !line.startsWith('LOOKUP_TABLE')) {
        
        // Parse indices that define how points connect to form lines/polygons
        const parts = line.split(' ').filter(x => x !== '');
        const indices = parts.map(x => parseInt(x)).filter(x => !isNaN(x)); // Filter out NaN values
        
        if (indices.length > 1) {
          const cellSize = indices[0]; // First number = how many points in this cell
          
          // Debug: log first few valid cells to understand structure
          if (segments.length === 0 && indices.length === cellSize + 1) {
            //console.log("[VTKLoader] First valid cell example:", indices);
            //console.log("[VTKLoader] Cell size:", cellSize, "Total indices:", indices.length);
          }
          
          // Only process if we have the expected number of indices
          if (indices.length === cellSize + 1) {
            // For VTK lines/polylines, connect consecutive points in sequence
            for (let j = 1; j < cellSize; j++) {
              const idx1 = indices[j];     // Current point index
              const idx2 = indices[j + 1]; // Next point index
              
              // Check if we have a valid next point (not the last point in cell)
              if (idx2 !== undefined && !isNaN(idx1) && !isNaN(idx2)) {
                // Ensure indices are valid (within bounds of points array)
                if (idx1 * 3 + 2 < points.length && idx2 * 3 + 2 < points.length) {
                  if (enableTubeMesh) {
                    // Store segment information for tube creation
                    segments.push({
                      start: [points[idx1 * 3], points[idx1 * 3 + 1], points[idx1 * 3 + 2]],
                      end: [points[idx2 * 3], points[idx2 * 3 + 1], points[idx2 * 3 + 2]],
                      startRadius: radii[idx1] || 0.1, // Default radius if not available
                      endRadius: radii[idx2] || 0.1
                    });
                  } else {
                    // Create line segments as before
                    vertices.push(
                      points[idx1 * 3], points[idx1 * 3 + 1], points[idx1 * 3 + 2], // First point
                      points[idx2 * 3], points[idx2 * 3 + 1], points[idx2 * 3 + 2]  // Second point
                    );
                  }
                }
              }
            }
          }
        }
      }
      
      // Stop reading cells if we encounter other sections
      if (line.startsWith('CELL_TYPES') || line.startsWith('POINT_DATA')) {
        isReadingCells = false;
      }
    }

    console.log("[VTKLoader] Parsing complete:", points.length / 3, "points processed");
    if (enableTubeMesh && segments.length > 0) {
      console.log("[VTKLoader] Created", segments.length, "tube segments for rendering");
      console.log("[VTKLoader] Radius data available:", radii.length > 0 ? `${radii.length} values` : 'No');
      if (radii.length > 0) {
        const minRadius = Math.min(...radii);
        const maxRadius = Math.max(...radii);
        console.log(`[VTKLoader] Radius range: ${minRadius.toFixed(4)} - ${maxRadius.toFixed(4)}`);
        
        // Show some sample segments to verify variable radius
        const sampleSegments = segments.slice(0, Math.min(5, segments.length));
        console.log("[VTKLoader] Sample segments with variable radius:");
        sampleSegments.forEach((seg, i) => {
          console.log(`  Segment ${i}: start=${seg.startRadius.toFixed(4)}, end=${seg.endRadius.toFixed(4)}`);
        });
      }
    } else {
      console.log("[VTKLoader] Created", vertices.length / 6, "line segments for rendering");
    }
    
    if (onProgress) {
      onProgress("Creating 3D geometry...", 70);
    }
    
    // Debug: if no vertices or segments created, there might be an issue with cell parsing
    if (vertices.length === 0 && segments.length === 0) {
      console.warn("[VTKLoader] No geometry created! Using point cloud fallback.");
      //console.log("[VTKLoader] Points array length:", points.length);
      //console.log("[VTKLoader] Expected points:", pointCount * 3);
    }

    // Return tube mesh data if enabled and segments available
    if (enableTubeMesh && segments.length > 0) {
      // Scale segments for consistent model size
      const allPoints = [];
      segments.forEach(seg => {
        allPoints.push(...seg.start, ...seg.end);
      });
      
      // Calculate bounding box for scaling
      const geometry = new this.THREE.BufferGeometry();
      geometry.setAttribute('position', new this.THREE.Float32BufferAttribute(allPoints, 3));
      geometry.computeBoundingBox();
      
      const center = geometry.boundingBox.getCenter(new this.THREE.Vector3());
      const size = geometry.boundingBox.getSize(new this.THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = modelSize / maxDim;
      
      // Apply scaling to segments and radii
      const scaledSegments = segments.map(seg => ({
        start: [
          (seg.start[0] - center.x) * scale,
          (seg.start[1] - center.y) * scale,
          (seg.start[2] - center.z) * scale
        ],
        end: [
          (seg.end[0] - center.x) * scale,
          (seg.end[1] - center.y) * scale,
          (seg.end[2] - center.z) * scale
        ],
        startRadius: seg.startRadius * scale,
        endRadius: seg.endRadius * scale
      }));
      
      //console.log("[VTKLoader] Scaled", scaledSegments.length, "segments for tube rendering");
      
      if (onProgress) {
        onProgress("Tube geometry prepared...", 80);
      }
      
      return { 
        geometry: null, 
        isPointCloud: false, 
        segments: scaledSegments, 
        radii: radii.length > 0 ? radii : null 
      };
    }
    
    // Create Three.js BufferGeometry from parsed data (line mode)
    const geometry = new this.THREE.BufferGeometry();
    
    // If no line segments were created, create a point cloud as fallback
    if (vertices.length === 0 && points.length > 0) {
      //console.log("[VTKLoader] Creating point cloud fallback visualization...");
      // Use original points for point cloud
      geometry.setAttribute('position', new this.THREE.Float32BufferAttribute(points, 3));
      return { geometry, isPointCloud: true }; // Return flag to use different material
    } else {
      // Set vertex positions for line segments (each vertex has 3 coordinates: x, y, z)
      geometry.setAttribute('position', new this.THREE.Float32BufferAttribute(vertices, 3));
    }
    
    // Calculate bounding box for centering and scaling
    geometry.computeBoundingBox();
    const center = geometry.boundingBox.getCenter(new this.THREE.Vector3()); // Center point
    const size = geometry.boundingBox.getSize(new this.THREE.Vector3());     // Dimensions
    const maxDim = Math.max(size.x, size.y, size.z);                        // Largest dimension
    const scale = modelSize / maxDim; // Use configurable model size 
    
    //console.log("[VTKLoader] Model bounding box size:", size);
    //console.log("[VTKLoader] Largest dimension:", maxDim);
    //console.log("[VTKLoader] Target model size:", modelSize, "units");
    //console.log("[VTKLoader] Applied scale factor:", scale);
    
    // Transform geometry: center at origin and scale to appropriate size
    geometry.translate(-center.x, -center.y, -center.z); // Move to center
    geometry.scale(scale, scale, scale);                  // Scale uniformly
    
    if (onProgress) {
      onProgress("Geometry created, building materials...", 80);
    }
    
    return { geometry, isPointCloud: false };
  }

  /**
   * Create appropriate mesh from geometry based on type
   * @param {THREE.BufferGeometry} geometry - Parsed geometry
   * @param {boolean} isPointCloud - Whether to create point cloud or line segments
   * @param {Object} config - Configuration options
   * @returns {THREE.Object3D} - Created mesh
   */
  createVTKMesh(geometry, isPointCloud, config) {
    let vtkMesh;
    
    if (isPointCloud) {
      // Create enhanced point cloud material
      //console.log("[VTKLoader] Creating point cloud visualization");
      const material = new this.THREE.PointsMaterial({
        color: config.color,
        size: config.pointSize,
        transparent: true,
        opacity: config.opacity,
        sizeAttenuation: true // Points get smaller with distance
      });
      vtkMesh = new this.THREE.Points(geometry, material);
      
    } else {
      // Create line segment visualization
      //console.log("[VTKLoader] Creating line segment visualization");
      
      // Main vessel material
      const vesselMaterial = new this.THREE.LineBasicMaterial({
        color: config.color,
        linewidth: config.lineWidth,
        transparent: true,
        opacity: config.opacity
      });
      
      vtkMesh = new this.THREE.LineSegments(geometry, vesselMaterial);
      
      // Add wireframe overlay for enhanced detail if enabled
      if (config.enableWireframe) {
        const wireframeMaterial = new this.THREE.LineBasicMaterial({
          color: (config.color & 0xffffff) | 0x888888, // Lighter version of main color
          linewidth: Math.max(1, config.lineWidth - 2),
          transparent: true,
          opacity: config.opacity * 0.3
        });
        
        const wireframeMesh = new this.THREE.LineSegments(geometry, wireframeMaterial);
        wireframeMesh.position.copy(vtkMesh.position);
        wireframeMesh.scale.copy(vtkMesh.scale);
        wireframeMesh.scale.multiplyScalar(1.005); // Very slightly larger for wireframe effect (reduced from 1.01)
        
        this.wireframeMesh = wireframeMesh;
      }
    }
    
    return vtkMesh;
  }

  /**
   * Create tube mesh from segments with radius information
   * @param {Array} segments - Array of segment objects with start, end, and radius info
   * @param {Array} radii - Array of radius values (optional)
   * @param {Object} config - Configuration options
   * @returns {THREE.Object3D} - Created tube mesh
   */
  createTubeMesh(segments, radii, config) {
    console.log("[VTKLoader] Creating tube mesh with", segments.length, "segments");
    
    // Reset debug counter for new model
    this.debugSegmentCount = 0;
    
    const group = new this.THREE.Group();
    let tubeCount = 0;
    
    segments.forEach((segment, index) => {
      try {
        // Create vector from start to end
        const start = new this.THREE.Vector3(...segment.start);
        const end = new this.THREE.Vector3(...segment.end);
        
        // Calculate segment length
        const length = start.distanceTo(end);
        
        // Skip very short segments to avoid rendering issues
        if (length < 0.001) {
          return;
        }
        
        // Get individual radii for variable radius tube
        const startRadius = segment.startRadius * config.tubeRadiusScale;
        const endRadius = segment.endRadius * config.tubeRadiusScale;
        
        // Skip segments with very small radius to improve performance
        if (Math.max(startRadius, endRadius) < 0.001) {
          return;
        }
        
        // Create variable radius tube geometry
        const geometry = this.createVariableRadiusTube(
          start, 
          end, 
          startRadius, 
          endRadius, 
          config.tubeSegments
        );
        
        if (!geometry) {
          return; // Skip invalid geometry
        }
        
        // Create material for this tube
        const material = new this.THREE.MeshLambertMaterial({
          color: config.color,
          transparent: true,
          opacity: config.opacity,
          side: this.THREE.DoubleSide
        });
        
        // Create mesh
        const tubeMesh = new this.THREE.Mesh(geometry, material);
        
        group.add(tubeMesh);
        tubeCount++;
        
      } catch (error) {
        console.warn(`[VTKLoader] Failed to create tube for segment ${index}:`, error);
      }
    });
    
    //console.log(`[VTKLoader] Successfully created ${tubeCount}/${segments.length} tube segments`);
    
    return group;
  }

  /**
   * Optimized tube mesh creation with LOD and batching
   * @param {Array} segments - Array of segment objects with start, end, and radius info
   * @param {Array} radii - Array of radius values (optional) 
   * @param {Object} config - Configuration options
   * @returns {Promise<THREE.Object3D>} - Created tube mesh with LOD optimization
   */
  async createOptimizedTubeMesh(segments, radii, config) {
    console.log("[VTKLoader] Creating optimized tube mesh with", segments.length, "segments");
    
    // Reset debug counter for new model
    this.debugSegmentCount = 0;
    
    // Monitor performance and adjust quality
    this.updatePerformanceMonitor();
    this.adjustPerformanceMode();
    
    const mainGroup = new this.THREE.Group();
    const batches = this.createSegmentBatches(segments);
    
    // Process batches with frame-friendly delays
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const lodGroup = this.createLODGroup(batch, config);
      mainGroup.add(lodGroup);
      
      // Yield control to browser every few batches to maintain responsiveness
      if (i > 0 && i % 3 === 0) {
        await this.waitFrame();
      }
    }
    
    //console.log(`[VTKLoader] Created optimized mesh with ${batches.length} LOD groups`);
    return mainGroup;
  }

  /**
   * Create LOD group for a batch of segments
   * @param {Array} segments - Batch of segments
   * @param {Object} config - Configuration options
   * @returns {THREE.LOD} - LOD group with different detail levels
   */
  createLODGroup(segments, config) {
    const lod = new this.THREE.LOD();
    
    // Create different detail levels
    this.lodLevels.forEach((level, index) => {
      const geometry = this.createMergedTubeGeometry(segments, {
        ...config,
        tubeSegments: level.segments,
        tubeRadiusScale: config.tubeRadiusScale * level.radiusScale
      });
      
      const material = new this.THREE.MeshLambertMaterial({
        color: config.color,
        transparent: true,
        opacity: config.opacity,
        side: this.THREE.DoubleSide
      });
      
      const mesh = new this.THREE.Mesh(geometry, material);
      lod.addLevel(mesh, level.distance);
    });
    
    return lod;
  }

  /**
   * Create merged tube geometry for better performance with variable radius support
   * @param {Array} segments - Array of segments 
   * @param {Object} config - Configuration options
   * @returns {THREE.BufferGeometry} - Merged geometry
   */
  createMergedTubeGeometry(segments, config) {
    const geometries = [];
    let validSegments = 0;
    
    segments.forEach(segment => {
      const start = new this.THREE.Vector3(...segment.start);
      const end = new this.THREE.Vector3(...segment.end);
      const length = start.distanceTo(end);
      
      // Skip very short segments for performance
      if (length < 0.001) return;
      
      const startRadius = segment.startRadius * config.tubeRadiusScale;
      const endRadius = segment.endRadius * config.tubeRadiusScale;
      
      // Skip segments with very small radius
      if (Math.max(startRadius, endRadius) < 0.001) return;
      
      // Create variable radius tube geometry
      const geometry = this.createVariableRadiusTube(
        start, 
        end, 
        startRadius, 
        endRadius, 
        Math.max(3, config.tubeSegments)
      );
      
      if (geometry) {
        geometries.push(geometry);
        validSegments++;
      }
    });
    
    // Merge all geometries into one for better performance
    if (geometries.length === 0) {
      return new this.THREE.BufferGeometry(); // Empty geometry
    }
    
    const mergedGeometry = this.mergeGeometries(geometries);
    
    // Clean up individual geometries
    geometries.forEach(geo => geo.dispose());
    
    //console.log(`[VTKLoader] Merged ${validSegments} segments with variable radius`);
    return mergedGeometry;
  }

  /**
   * Create variable radius tube geometry between two points
   * @param {THREE.Vector3} start - Start point
   * @param {THREE.Vector3} end - End point  
   * @param {number} startRadius - Radius at start point
   * @param {number} endRadius - Radius at end point
   * @param {number} radialSegments - Number of radial segments
   * @returns {THREE.BufferGeometry} - Variable radius tube geometry
   */
  createVariableRadiusTube(start, end, startRadius, endRadius, radialSegments) {
    const length = start.distanceTo(end);
    
    // Skip degenerate segments
    if (length < 0.001 || (startRadius < 0.001 && endRadius < 0.001)) {
      return null;
    }
    
    // Log variable radius information for debugging (only for first few segments)
    if (this.debugSegmentCount < 3) {
      const radiusDiff = Math.abs(startRadius - endRadius);
      if (radiusDiff > 0.001) { // Only log if there's significant radius change
        console.log(`[VTKLoader] Creating variable radius tube: start=${startRadius.toFixed(4)}, end=${endRadius.toFixed(4)}, length=${length.toFixed(4)}`);
        this.debugSegmentCount = (this.debugSegmentCount || 0) + 1;
      }
    }
    
    // Create cone/cylinder geometry with different top and bottom radius
    // Note: CylinderGeometry parameters are (radiusTop, radiusBottom, height, radialSegments)
    const geometry = new this.THREE.CylinderGeometry(
      endRadius,     // Top radius (at end point)
      startRadius,   // Bottom radius (at start point)  
      length,        // Height (length of segment)
      radialSegments, // Radial segments
      1,             // Height segments
      false          // Not open ended
    );
    
    // Position and orient the geometry
    const midpoint = new this.THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const direction = new this.THREE.Vector3().subVectors(end, start).normalize();
    
    // Create transformation matrix to orient the cylinder along the segment
    const matrix = new this.THREE.Matrix4();
    const up = new this.THREE.Vector3(0, 1, 0); // CylinderGeometry default orientation
    
    // Handle edge case where direction is parallel to up vector
    if (Math.abs(direction.dot(up)) > 0.99) {
      up.set(1, 0, 0); // Use X axis instead
    }
    
    // Create rotation quaternion to align cylinder with segment direction
    const quaternion = new this.THREE.Quaternion().setFromUnitVectors(up, direction);
    matrix.makeRotationFromQuaternion(quaternion);
    matrix.setPosition(midpoint);
    
    // Apply transformation to geometry
    geometry.applyMatrix4(matrix);
    
    return geometry;
  }

  /**
   * Merge multiple geometries into one
   * @param {Array} geometries - Array of geometries to merge
   * @returns {THREE.BufferGeometry} - Merged geometry
   */
  mergeGeometries(geometries) {
    if (geometries.length === 1) {
      return geometries[0];
    }
    
    // Use Three.js BufferGeometryUtils if available, otherwise fallback
    if (this.THREE.BufferGeometryUtils && this.THREE.BufferGeometryUtils.mergeGeometries) {
      return this.THREE.BufferGeometryUtils.mergeGeometries(geometries);
    } else {
      // Fallback: manual merging for older Three.js versions
      return this.manualMergeGeometries(geometries);
    }
  }

  /**
   * Manual geometry merging fallback
   * @param {Array} geometries - Array of geometries to merge
   * @returns {THREE.BufferGeometry} - Merged geometry
   */
  manualMergeGeometries(geometries) {
    let totalVertices = 0;
    let totalIndices = 0;
    
    geometries.forEach(geo => {
      if (geo.attributes.position) {
        totalVertices += geo.attributes.position.count;
      }
      if (geo.index) {
        totalIndices += geo.index.count;
      }
    });
    
    const positions = new Float32Array(totalVertices * 3);
    const normals = new Float32Array(totalVertices * 3);
    const indices = new Uint16Array(totalIndices);
    
    let positionOffset = 0;
    let normalOffset = 0;
    let indexOffset = 0;
    let vertexOffset = 0;
    
    geometries.forEach(geo => {
      if (geo.attributes.position) {
        const pos = geo.attributes.position.array;
        positions.set(pos, positionOffset);
        positionOffset += pos.length;
        
        if (geo.attributes.normal) {
          const norm = geo.attributes.normal.array;
          normals.set(norm, normalOffset);
          normalOffset += norm.length;
        }
        
        if (geo.index) {
          const idx = geo.index.array;
          for (let i = 0; i < idx.length; i++) {
            indices[indexOffset + i] = idx[i] + vertexOffset;
          }
          indexOffset += idx.length;
        }
        
        vertexOffset += geo.attributes.position.count;
      }
    });
    
    const merged = new this.THREE.BufferGeometry();
    merged.setAttribute('position', new this.THREE.BufferAttribute(positions, 3));
    merged.setAttribute('normal', new this.THREE.BufferAttribute(normals, 3));
    merged.setIndex(new this.THREE.BufferAttribute(indices, 1));
    
    return merged;
  }

  /**
   * Create segment batches for processing
   * @param {Array} segments - All segments
   * @returns {Array} - Array of segment batches
   */
  createSegmentBatches(segments) {
    const batches = [];
    
    for (let i = 0; i < segments.length; i += this.maxSegmentsPerBatch) {
      batches.push(segments.slice(i, i + this.maxSegmentsPerBatch));
    }
    
    //console.log(`[VTKLoader] Created ${batches.length} batches from ${segments.length} segments`);
    return batches;
  }

  /**
   * Wait for next animation frame to maintain responsiveness
   * @returns {Promise} - Promise that resolves on next frame
   */
  waitFrame() {
    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    });
  }

  /**
   * Update performance monitoring
   */
  updatePerformanceMonitor() {
    const now = Date.now();
    const deltaTime = now - this.performanceMonitor.lastFrameTime;
    
    if (deltaTime > 0) {
      const currentFPS = 1000 / deltaTime;
      
      // Smooth FPS calculation
      this.performanceMonitor.frameRate = 
        this.performanceMonitor.frameRate * 0.9 + currentFPS * 0.1;
      
      // Count low frame rate instances
      if (currentFPS < 30) {
        this.performanceMonitor.lowFrameCount++;
      } else if (this.performanceMonitor.lowFrameCount > 0) {
        this.performanceMonitor.lowFrameCount--;
      }
    }
    
    this.performanceMonitor.lastFrameTime = now;
    this.frameCounter++;
  }

  /**
   * Automatically adjust performance mode based on frame rate
   */
  adjustPerformanceMode() {
    if (this.performanceMode !== 'auto') return;
    
    const fps = this.performanceMonitor.frameRate;
    const lowFrameCount = this.performanceMonitor.lowFrameCount;
    
    if (fps < 20 || lowFrameCount > 10) {
      // Switch to low quality
      this.lodLevels.forEach(level => {
        level.segments = Math.max(3, Math.floor(level.segments * 0.7));
        level.radiusScale *= 0.8;
      });
      this.maxSegmentsPerBatch = Math.max(500, Math.floor(this.maxSegmentsPerBatch * 0.8));
    } else if (fps > 45 && lowFrameCount === 0) {
      // Can increase quality slightly
      this.lodLevels.forEach(level => {
        level.segments = Math.min(8, Math.floor(level.segments * 1.1));
        level.radiusScale = Math.min(1.0, level.radiusScale * 1.05);
      });
      this.maxSegmentsPerBatch = Math.min(2000, Math.floor(this.maxSegmentsPerBatch * 1.1));
    }
  }

  /**
   * Set performance mode manually
   * @param {string} mode - 'high', 'medium', 'low', 'auto'
   */
  setPerformanceMode(mode) {
    this.performanceMode = mode;
    
    const settings = {
      'high': {
        lodLevels: [
          { distance: 50, segments: 8, radiusScale: 1.0 },
          { distance: 150, segments: 6, radiusScale: 0.9 },
          { distance: 400, segments: 4, radiusScale: 0.7 },
          { distance: Infinity, segments: 3, radiusScale: 0.5 }
        ],
        maxSegmentsPerBatch: 1500
      },
      'medium': {
        lodLevels: [
          { distance: 50, segments: 6, radiusScale: 0.9 },
          { distance: 150, segments: 4, radiusScale: 0.7 },
          { distance: 400, segments: 3, radiusScale: 0.5 },
          { distance: Infinity, segments: 3, radiusScale: 0.3 }
        ],
        maxSegmentsPerBatch: 1000
      },
      'low': {
        lodLevels: [
          { distance: 50, segments: 4, radiusScale: 0.7 },
          { distance: 150, segments: 3, radiusScale: 0.5 },
          { distance: 400, segments: 3, radiusScale: 0.3 },
          { distance: Infinity, segments: 3, radiusScale: 0.2 }
        ],
        maxSegmentsPerBatch: 500
      }
    };
    
    if (settings[mode]) {
      this.lodLevels = settings[mode].lodLevels;
      this.maxSegmentsPerBatch = settings[mode].maxSegmentsPerBatch;
      //console.log(`[VTKLoader] Performance mode set to: ${mode}`);
    }
  }

  /**
   * Add mesh to scene with enhanced lighting
   * @param {THREE.Object3D} mesh - Mesh to add
   * @param {Object} config - Configuration options
   */
  addToScene(mesh, config) {
    // Clear existing meshes
    if (this.currentVTKMesh) {
      this.scene.remove(this.currentVTKMesh);
    }
    if (this.wireframeMesh && this.wireframeMesh !== mesh) {
      this.scene.remove(this.wireframeMesh);
    }
    
    // Setup enhanced lighting (only once)
    this.setupSceneLighting();
    
    // Store reference and add to scene
    this.currentVTKMesh = mesh;
    this.scene.add(mesh);
    
    // Add wireframe overlay if it exists
    if (this.wireframeMesh) {
      this.scene.add(this.wireframeMesh);
      //console.log("[VTKLoader] Added wireframe overlay for enhanced detail");
    }
    
    // Log success information
    //console.log("[VTKLoader] VTK model successfully added to scene:", mesh);
    if (mesh.geometry && mesh.geometry.attributes && mesh.geometry.attributes.position) {
      //console.log("[VTKLoader] Total vertices in geometry:", mesh.geometry.attributes.position.count);
    }
  }

  /**
   * Setup enhanced lighting for biological visualization
   */
  setupSceneLighting() {
    // Only add lights if they haven't been initialized yet
    if (this.lightingInitialized) {
      return;
    }
    
    // Warm ambient light to simulate biological environment
    const ambientLight = new this.THREE.AmbientLight(0x664444, 0.6);
    this.scene.add(ambientLight);
    
    // Main directional light (simulating medical examination light)
    const mainLight = new this.THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 10, 5);
    mainLight.castShadow = true;
    this.scene.add(mainLight);
    
    // Secondary light from different angle for better depth perception
    const fillLight = new this.THREE.DirectionalLight(0xffeedd, 0.4);
    fillLight.position.set(-5, 3, -1);
    this.scene.add(fillLight);
    
    // Rim light for edge definition
    const rimLight = new this.THREE.DirectionalLight(0xaaffff, 0.3);
    rimLight.position.set(0, -5, 10);
    this.scene.add(rimLight);
    
    // Add subtle point lights for internal illumination effect
    const internalLight1 = new this.THREE.PointLight(0xff6666, 0.5, 100);
    internalLight1.position.set(0, 0, 0);
    this.scene.add(internalLight1);
    
    const internalLight2 = new this.THREE.PointLight(0x6666ff, 0.3, 80);
    internalLight2.position.set(20, -10, 15);
    this.scene.add(internalLight2);
    
    this.lightingInitialized = true;
    //console.log("[VTKLoader] Enhanced lighting system initialized");
  }

  /**
   * Set camera position and target
   * @param {Object} cameraConfig - Camera configuration
   * @param {Array} cameraConfig.position - Camera position [x, y, z]
   * @param {Array} cameraConfig.target - Camera target [x, y, z]
   * @param {Array} cameraConfig.up - Camera up vector [x, y, z]
   */
  setCameraPosition(cameraConfig) {
    const config = {
      position: [115, 80, 115], // Adjusted for 420-unit model
      target: [0, 0, 0],
      up: [0, 1, 0],
      ...cameraConfig
    };

    //console.log("[VTKLoader] Setting camera position:", config);
    
    // Validate camera position to prevent errors
    const position = new this.THREE.Vector3(...config.position);
    const target = new this.THREE.Vector3(...config.target);
    const up = new this.THREE.Vector3(...config.up);
    
    // Check if position and target are too close (would cause division by zero)
    const distance = position.distanceTo(target);
    if (distance < 0.1) {
      console.warn("[VTKLoader] Camera position too close to target, adjusting...");
      config.position = [60, 40, 60]; // Reset to safe default
    }
    
    // Since we're using copper3d, we need to work with their camera system
    if (this.copperScene && this.copperScene.camera) {
      const camera = this.copperScene.camera;
      
      try {
        // Set camera position
        camera.position.set(...config.position);
        
        // Set camera target (what it's looking at)
        camera.lookAt(new this.THREE.Vector3(...config.target));
        
        // Set up vector
        camera.up.copy(up);
        
        // Update camera matrices
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        
        //console.log("[VTKLoader] Camera position updated successfully");
      } catch (error) {
        console.error("[VTKLoader] Error setting camera position:", error);
        // Fallback to safe position
        camera.position.set(60, 40, 60);
        camera.lookAt(new this.THREE.Vector3(0, 0, 0));
        camera.up.set(0, 1, 0);
      }
    } else {
      console.warn("[VTKLoader] Camera not accessible through current scene setup");
    }
  }

  /**
   * Set predefined camera views optimized for placental models
   * @param {string} viewName - Name of predefined view
   */
  setPredefinedView(viewName) {
    const views = {
      // Front view - good for overall structure (optimized for larger model)
      front: {
        position: [0, 0, 180],
        target: [0, 0, 0],
        up: [0, 1, 0]
      },
      
      // Top view - good for branching patterns (optimized for larger model)
      top: {
        position: [0, 180, 0],
        target: [0, 0, 0],
        up: [0, 0, -1]
      },
      
      // Side view - good for depth perception (optimized for larger model)
      side: {
        position: [180, 0, 0],
        target: [0, 0, 0],
        up: [0, 1, 0]
      },
      
      // Isometric view - good for 3D understanding (optimized for 420-unit model)
      isometric: {
        position: [140, 105, 140],
        target: [0, 0, 0],
        up: [0, 1, 0]
      },
      
      // Close-up view - good for detail inspection (closer for larger model)
      closeup: {
        position: [80, 60, 80],
        target: [0, 0, 0],
        up: [0, 1, 0]
      },
      
      // Wide view - full overview of larger model
      wide: {
        position: [250, 180, 250],
        target: [0, 0, 0],
        up: [0, 1, 0]
      }
    };

    if (views[viewName]) {
      this.setCameraPosition(views[viewName]);
      //console.log(`[VTKLoader] Set camera to ${viewName} view`);
    } else {
      console.warn(`[VTKLoader] Unknown view: ${viewName}`);
      //console.log("[VTKLoader] Available views:", Object.keys(views));
    }
  }

  /**
   * Set reference to copper scene for camera control
   * @param {Object} copperScene - Copper3d scene object
   */
  setCopperScene(copperScene) {
    this.copperScene = copperScene;
    //console.log("[VTKLoader] Copper scene reference set for camera control");
  }

  /**
   * Get optimal camera position based on model bounds
   * @returns {Object} - Optimal camera configuration
   */
  getOptimalCameraPosition() {
    if (!this.currentVTKMesh || !this.currentVTKMesh.geometry) {
      return { position: [140, 105, 140], target: [0, 0, 0], up: [0, 1, 0] }; // Adjusted for 420-unit model
    }

    // Calculate bounding box
    this.currentVTKMesh.geometry.computeBoundingBox();
    const box = this.currentVTKMesh.geometry.boundingBox;
    const size = box.getSize(new this.THREE.Vector3());
    const center = box.getCenter(new this.THREE.Vector3());
    
    // Calculate optimal distance based on model size (balanced for 420-unit model)
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 0.9; // 0.9x the largest dimension (adjusted for 420-unit scaling)
    
    return {
      position: [
        center.x + distance * 0.7,
        center.y + distance * 0.5, 
        center.z + distance * 0.7
      ],
      target: [center.x, center.y, center.z],
      up: [0, 1, 0]
    };
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.currentVTKMesh) {
      this.scene.remove(this.currentVTKMesh);
      this.currentVTKMesh = null;
    }
    
    if (this.wireframeMesh) {
      this.scene.remove(this.wireframeMesh);
      this.wireframeMesh = null;
    }
    
    this.copperScene = null;
    
    //console.log("[VTKLoader] Resources cleaned up");
  }
} 