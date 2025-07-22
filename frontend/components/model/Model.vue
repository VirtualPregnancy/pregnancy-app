<template>
  <div class="model">
    <!-- Display current model loading status -->
    {{ modelName }}
    <!-- 3D model container div, responsive sizing based on screen size -->
    <div
        ref="baseDomObject"
        :class="mdAndUp ? 'baseDom-md' : 'baseDom-sm'"
        style="width: 100%; height: 100%;"
      />
    <!-- Control panel with multiple VTK model options -->
    <div class="model-controls">
      <v-btn @click="reloadVTKModel" color="primary" small class="ma-1">
        Load Arterial
      </v-btn>
      <v-btn @click="loadVenousTree" color="blue" small class="ma-1">
        Load Venous
      </v-btn>
    </div>
  </div>
</template>

<script>
import VTKLoader from '@/utils/vtkLoader'

export default {
  // Component data - stores all reactive properties
  data() {
    return {
      Copper: null,        // Copper3D library instance for 3D rendering
      THREE: null,         // Three.js library instance for 3D geometry
      baseRenderer: null,  // Main renderer for managing 3D scenes
      container: null,     // DOM container for 3D canvas
      modelName: "Placental Vessel Network",  // Status text shown to user
      helloworld:"",       // Placeholder for API response
      model:null,          // Stores loaded model data
      vtkLoader: null,     // VTK loader utility instance
      _resizeHandler: null // Store resize handler for cleanup
    };
  },

  computed: {
    mdAndUp() {
      // Add null check for $vuetify
      return this.$vuetify && this.$vuetify.breakpoint ? this.$vuetify.breakpoint.mdAndUp : false;
    },
  },

  // Component mounted lifecycle - initializes 3D environment
  mounted() {
    // Wait for plugins to be ready before initializing
    this.waitForPluginsAndInitialize();
  },

  methods: {
    // Wait for plugins to be available and then initialize
    async waitForPluginsAndInitialize(retryCount = 0) {
      const maxRetries = 10;
      const delay = 200; // 200ms delay between retries
      
      // Check if required plugins are available
      if (this.checkPluginsAvailability()) {
        console.log("[Model] Plugins ready, initializing 3D engine...");
        this.initializeCopper3D();
      } else if (retryCount < maxRetries) {
        console.log(`[Model] Plugins not ready, retrying... (${retryCount + 1}/${maxRetries})`);
        this.modelName = `Loading 3D Engine... (${retryCount + 1}/${maxRetries})`;
        
        setTimeout(() => {
          this.waitForPluginsAndInitialize(retryCount + 1);
        }, delay);
      } else {
        console.error("[Model] Failed to initialize plugins after maximum retries");
        this.modelName = "Error: 3D engine initialization timed out";
      }
    },

    // Check if all required plugins are available
    checkPluginsAvailability() {
      try {
        return this.$Copper && 
               this.$three && 
               this.$baseRenderer && 
               this.$baseContainer &&
               typeof this.$Copper === 'function' &&
               typeof this.$three === 'function' &&
               typeof this.$baseRenderer === 'function' &&
               typeof this.$baseContainer === 'function';
      } catch (e) {
        return false;
      }
    },

    // Initialize Copper3D engine
    initializeCopper3D() {
      try {
        this.Copper = this.$Copper();           // Get Copper3D instance
        this.THREE = this.$three();             // Get Three.js instance  
        this.baseRenderer = this.$baseRenderer(); // Get main renderer
        const baseContainer = this.$baseContainer(); // Get 3D container
        
        // Add null check for DOM reference
        this.container = this.$refs.baseDomObject;
        if (!this.container) {
          console.error("[Model] DOM reference not found");
          this.modelName = "Error: DOM container not found";
          return;
        }

        // Verify all components are properly initialized
        if (!this.baseRenderer || !baseContainer) {
          console.error("[Model] 3D components not properly initialized");
          this.modelName = "Error: 3D components missing";
          return;
        }
      
        // Setup container with slight delay to ensure DOM is ready
        setTimeout(() => {
          // Set responsive height based on screen size with null checks
          if (baseContainer) {
            this.mdAndUp
              ? (baseContainer.style.height = "100vh")  // Full height on desktop
              : (baseContainer.style.height = "100vw"); // Square on mobile
            
            this.container.appendChild(baseContainer);
          }
          
          // Initialize VTK loader and start loading models
          this.initializeVTKLoader();
          this.start();
        }, 100);

        // Setup resize listener
        this.setupResizeListener(baseContainer);
        
      } catch (error) {
        console.error("[Model] Error initializing 3D components:", error);
        this.modelName = "Error: Failed to initialize 3D engine";
      }
    },

    // Setup window resize listener
    setupResizeListener(baseContainer) {
      const resizeHandler = () => {
        setTimeout(() => {
          if (baseContainer) {
            this.mdAndUp
              ? (baseContainer.style.height = "100vh")
              : (baseContainer.style.height = "100vw");
          }
          if (this.scene) {
            this.scene.onWindowResize();
          }
        }, 500);
      };

      window.addEventListener("resize", resizeHandler);
      
      // Store reference for cleanup
      this._resizeHandler = resizeHandler;
    },

    // Initialize VTK loader utility
    initializeVTKLoader() {
      try {
        if (!this.baseRenderer) {
          console.error("[Model] Base renderer not available");
          return;
        }
        
        // Initialize scene first
        this.scene = this.baseRenderer.getSceneByName('placental-scene');
        if (this.scene === undefined) {
          this.scene = this.baseRenderer.createScene('placental-scene');
          this.baseRenderer.setCurrentScene(this.scene);
        }
        
        // Create VTK loader instance
        this.vtkLoader = new VTKLoader(this.THREE, this.scene.scene);
        
        // Set copper scene reference for camera control
        this.vtkLoader.setCopperScene(this.scene);
        
        console.log("VTK Loader initialized with camera control");
      } catch (error) {
        console.error("[Model] Error initializing VTK loader:", error);
        this.modelName = "Error: VTK loader initialization failed";
      }
    },

    // Main initialization method - called after component is mounted
    async start(){
      console.log("Loading default placental model...");
      
      // Load default placental arterial tree model using utility
      const result = await this.vtkLoader.loadVTKFile('/model/healthy_gen_np3ns1_flux_250_arterial_tree.vtk', {
        displayName: 'Placental Arterial Tree',
        color: 0xff2222,
        opacity: 0.9,
        modelSize: 420, // Target model size - automatically scales lineWidth and pointSize
        onProgress: (message, progress) => {
          this.modelName = `${message} (${Math.round(progress)}%)`;
        },
        onComplete: (mesh, isPointCloud) => {
          this.modelName = isPointCloud ? 
            'Placental Vessel Network (Point Cloud)' : 
            'Placental Vessel Network (Enhanced Visualization)';
          
          // Load camera view
          this.scene.loadViewUrl('modelView/noInfarct_view.json');
          this.scene.onWindowResize();
        }
      });
      
      if (!result.success) {
        this.modelName = `Error: ${result.error.message}`;
      }
    },

    /**
     * Manual reload function - triggered by user button click
     * Uses the VTKLoader utility class
     */
    async reloadVTKModel() {
      console.log("User requested VTK model reload...");
      
      const result = await this.vtkLoader.loadVTKFile('/model/healthy_gen_np3ns1_flux_250_arterial_tree.vtk', {
        displayName: 'Placental Arterial Tree',
        color: 0xff3333,
        opacity: 0.9,
        modelSize: 420, // Target model size - automatically scales lineWidth and pointSize
        onProgress: (message, progress) => {
          this.modelName = `${message} (${Math.round(progress)}%)`;
        },
        onComplete: (mesh, isPointCloud) => {
          this.modelName = isPointCloud ? 
            'Placental Arterial Tree (Point Cloud)' : 
            'Placental Arterial Tree (Reloaded)';
          this.scene.loadViewUrl('modelView/noInfarct_view.json');
        }
      });
      
      if (!result.success) {
        this.modelName = `Error: ${result.error.message}`;
      }
    },

    /**
     * Load venous tree using VTKLoader utility
     */
    async loadVenousTree() {
      const result = await this.vtkLoader.loadVTKFile('/model/healthy_gen_np3ns1_flux_250_venous_tree.vtk', {
        displayName: 'Placental Venous Tree',
        color: 0x2222ff,
        opacity: 0.8,
        modelSize: 420, // Target model size - automatically scales lineWidth and pointSize
        onProgress: (message, progress) => {
          this.modelName = `${message} (${Math.round(progress)}%)`;
        },
        onComplete: (mesh, isPointCloud) => {
          this.modelName = isPointCloud ? 
            'Placental Venous Tree (Point Cloud)' : 
            'Placental Venous Tree (Enhanced)';
          this.scene.loadViewUrl('modelView/noInfarct_view.json');
        }
      });
      
      if (!result.success) {
        this.modelName = `Error: ${result.error.message}`;
      }
    },

    // Legacy OBJ model loader (kept for compatibility)
    loadModel(model_url, model_name) {
      const viewURL = 'modelView/noInfarct_view.json';

      this.scene = this.baseRenderer.getSceneByName(model_name);
      if (this.scene === undefined) {
        this.scene = this.baseRenderer.createScene(model_name);
        this.baseRenderer.setCurrentScene(this.scene);
        this.scene.loadOBJ(model_url, (content) => {
          console.log(content);
        });
        this.scene.loadViewUrl(viewURL);
      }
      this.scene.onWindowResize();
    }
  },

  watch: {},

  beforeDestroy() {
    // Clean up VTK loader resources
    if (this.vtkLoader) {
      this.vtkLoader.dispose();
      this.vtkLoader = null;
    }
    
    // Clean up resize listener
    if (this._resizeHandler) {
      window.removeEventListener("resize", this._resizeHandler);
      this._resizeHandler = null;
    }
  }
};
</script>

<style scoped lang="scss">
.model {
  position: relative;
  width: 100%;
  height: 100%;
}

.baseDom-md {
  width: 100%;
  height: 100vh;
}

.baseDom-sm {
  width: 100%;
  height: 100vw;
}

.model-controls {
  position: absolute;
  top: 12px;
  left: 10px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 8px;
  padding: 10px;
  
  .control-group {
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style> 