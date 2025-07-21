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
      onProgress: null,
      onComplete: null,
      ...options
    };

    console.log(`[VTKLoader] Loading VTK file: ${vtkFilePath}`, config);
    
    // Call progress callback
    if (config.onProgress) {
      config.onProgress(`Loading ${config.displayName}...`, 0);
    }

    try {
      // Fetch and parse VTK file
      const vtkData = await this.fetchVTKFile(vtkFilePath, config.onProgress);
      const parseResult = this.parseVTKData(vtkData, config.onProgress, config.modelSize);
      const { geometry, isPointCloud } = parseResult;
      
      // Create appropriate mesh with custom settings
      const mesh = this.createVTKMesh(geometry, isPointCloud, config);
      
      // Add to scene with enhanced lighting
      this.addToScene(mesh, config);
      
      // Call completion callback
      if (config.onComplete) {
        config.onComplete(mesh, isPointCloud);
      }
      
      console.log(`[VTKLoader] Successfully loaded: ${config.displayName}`);
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
    console.log("[VTKLoader] Fetching VTK file...");
    
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
    console.log("[VTKLoader] VTK file loaded, size:", vtkData.length, "characters");
    
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
   * @returns {Object} - {geometry: THREE.BufferGeometry, isPointCloud: boolean}
   */
  parseVTKData(vtkData, onProgress = null,modelSize) {
    console.log("[VTKLoader] Starting VTK data parsing...");
    
    if (onProgress) {
      onProgress("Parsing VTK data structure...", 40);
    }
    
    // Split file content into lines for processing
    const lines = vtkData.split('\n');
    const vertices = [];        // Final array of vertex coordinates for Three.js
    let isReadingPoints = false; // Flag: currently reading point coordinates
    let isReadingCells = false;  // Flag: currently reading cell connectivity
    let points = [];            // Temporary storage for all point coordinates
    let pointCount = 0;         // Total number of points in file
    let cellCount = 0;          // Total number of cells (connections) in file

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
        console.log("[VTKLoader] Found", pointCount, "3D points in VTK file");
        isReadingPoints = true;
        isReadingCells = false;
        continue;
      }
      
      // Detect CELLS/POLYGONS/LINES section - contains connectivity information
      if (line.startsWith('CELLS') || line.startsWith('POLYGONS') || line.startsWith('LINES')) {
        const parts = line.split(' ');
        if (parts.length > 1) {
          cellCount = parseInt(parts[1]); // Extract number of cells
          console.log("[VTKLoader] Found", cellCount, "cells/connections in VTK file");
        }
        isReadingPoints = false;
        isReadingCells = true;
        continue;
      }
      
      // Read point coordinates (x, y, z values)
      if (isReadingPoints && points.length < pointCount * 3) {
        // Split line into numbers, filter empty strings, convert to float
        const coords = line.split(' ').filter(x => x !== '').map(parseFloat);
        points.push(...coords); // Add all coordinates to points array
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
          if (vertices.length === 0 && indices.length === cellSize + 1) {
            console.log("[VTKLoader] First valid cell example:", indices);
            console.log("[VTKLoader] Cell size:", cellSize, "Total indices:", indices.length);
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
                  // Add line segment: 6 coordinates (x1,y1,z1,x2,y2,z2)
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
      
      // Stop reading cells if we encounter other sections
      if (line.startsWith('CELL_TYPES') || line.startsWith('POINT_DATA')) {
        isReadingCells = false;
      }
    }

    console.log("[VTKLoader] Parsing complete:", points.length / 3, "points processed");
    console.log("[VTKLoader] Created", vertices.length / 6, "line segments for rendering");
    
    if (onProgress) {
      onProgress("Creating 3D geometry...", 70);
    }
    
    // Debug: if no vertices created, there might be an issue with cell parsing
    if (vertices.length === 0) {
      console.warn("[VTKLoader] No line segments created! Using point cloud fallback.");
      console.log("[VTKLoader] Points array length:", points.length);
      console.log("[VTKLoader] Expected points:", pointCount * 3);
    }

    // Create Three.js BufferGeometry from parsed data
    const geometry = new this.THREE.BufferGeometry();
    
    // If no line segments were created, create a point cloud as fallback
    if (vertices.length === 0 && points.length > 0) {
      console.log("[VTKLoader] Creating point cloud fallback visualization...");
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
    
    console.log("[VTKLoader] Model bounding box size:", size);
    console.log("[VTKLoader] Largest dimension:", maxDim);
    console.log("[VTKLoader] Target model size:", modelSize, "units");
    console.log("[VTKLoader] Applied scale factor:", scale);
    
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
      console.log("[VTKLoader] Creating point cloud visualization");
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
      console.log("[VTKLoader] Creating line segment visualization");
      
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
      console.log("[VTKLoader] Added wireframe overlay for enhanced detail");
    }
    
    // Log success information
    console.log("[VTKLoader] VTK model successfully added to scene:", mesh);
    if (mesh.geometry && mesh.geometry.attributes && mesh.geometry.attributes.position) {
      console.log("[VTKLoader] Total vertices in geometry:", mesh.geometry.attributes.position.count);
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
    console.log("[VTKLoader] Enhanced lighting system initialized");
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

    console.log("[VTKLoader] Setting camera position:", config);
    
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
        
        console.log("[VTKLoader] Camera position updated successfully");
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
      console.log(`[VTKLoader] Set camera to ${viewName} view`);
    } else {
      console.warn(`[VTKLoader] Unknown view: ${viewName}`);
      console.log("[VTKLoader] Available views:", Object.keys(views));
    }
  }

  /**
   * Set reference to copper scene for camera control
   * @param {Object} copperScene - Copper3d scene object
   */
  setCopperScene(copperScene) {
    this.copperScene = copperScene;
    console.log("[VTKLoader] Copper scene reference set for camera control");
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
    
    console.log("[VTKLoader] Resources cleaned up");
  }
} 