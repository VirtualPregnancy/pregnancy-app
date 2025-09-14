<template>
  <div class="model-container">
    <!-- Model Info Header -->
    <header class="model-info">{{modelName}}</header>
    
    <client-only>
      <!-- 3D model container -->
      <div class="model-viewport">
        <div
          ref="baseDomObject"
          :class="mdAndUp ? 'baseDom-md' : 'baseDom-sm'"
        />
      </div>

      <!-- Controls - positioned at bottom -->
      <div
        ref="threeDControls"
        class="baseModelControl"
        :class="mdAndUp ? 'baseModelControl-md' : 'baseModelControl-sm'"
      >
        <div class="baseModelCB" :class="mdAndUp ? 'baseModelCB-md' : ''">
          <img
            src="~/assets/images/gestures-icons.png"
            class="h-full w-full md:object-contain"
            @click="handleGestureIconClick"
            style="background-color: var(--v-info-base); border-radius: 10px; padding: 10px;"
          />
        </div>
      </div>
      
      <!-- Fallback template for SSR -->
      <template #fallback>
        <div class="loading-placeholder">
          <div class="loading-text">Loading 3D Engine...</div>
        </div>
      </template>
    </client-only>
  </div>
</template>

<script>
import VTKLoader from '@/utils/vtkLoader'
import modelData from '@/assets/data/modelData.json';

export default {
  props: {
    // Model control states from parent component
    useTubeRendering: {
      type: Boolean,
      default: true
    },
    currentPerformanceMode: {
      type: String,
      default: 'high'
    },
    modelName: {
      type: String,
      default: 'Loading...'
    }
  },
  
  // Component data - stores all reactive properties
  data() {
    return {
      Copper: null,        // Copper3D library instance for 3D rendering
      THREE: null,         // Three.js library instance for 3D geometry
      baseRenderer: null,  // Main renderer for managing 3D scenes
      container: null,     // DOM container for 3D canvas
      vtkLoader: null,     // VTK loader utility instance
      _resizeHandler: null, // Store resize handler for cleanup
      clientMounted: false, // Track if component is mounted on client
      currentColorMappingType: 'pressure', // Track current color mapping type
      renderingComplete: false, // Track if model is fully rendered and ready
      // Model configuration
      modelConfig: null
    };
  },

  computed: {
   
    mdAndUp() {
      // Ensure consistent behavior between SSR and client
      if (!this.clientMounted) {
        return false; // Default to mobile layout during SSR
      }
      // Add comprehensive null checks for $vuetify
      try {
        return this.$vuetify && 
               this.$vuetify.breakpoint && 
               this.$vuetify.breakpoint.mdAndUp;
      } catch (e) {
        console.warn("[Model] Error accessing vuetify breakpoint:", e);
        return false;
      }
    },
  },

  // Component mounted lifecycle - initializes 3D environment
  mounted() {
    this.modelConfig = modelData.models[0].config;
    // Mark component as client-side mounted
    this.clientMounted = true;
    
    // Only initialize if we're on client-side
    if (process.client) {
      // Use nextTick to ensure DOM is fully rendered after client-only activation
      this.$nextTick(() => {
        // Wait for plugins to be ready before initializing
        this.waitForPluginsAndInitialize();
      });
    }
  },

  methods: {
    // Get correct path for static assets based on deployment environment
    getAssetPath(relativePath) {
      let basePath = '';
      
      // Check if we're in GitHub Pages environment using multiple methods
      if (process.client) {
        // Check current URL to determine if we're on GitHub Pages
        const isGitHubPages = window.location.pathname.startsWith('/pregnancy-app/') || 
                            window.location.hostname.includes('github.io');
        basePath = isGitHubPages ? '/pregnancy-app' : '';
      } else {
        // Server-side: use environment variable
        const isGitHubPages = process.env.DEPLOY_ENV === 'GH_PAGES';
        basePath = isGitHubPages ? '/pregnancy-app' : '';
      }
      
      // Ensure the path starts with / if not already
      const cleanPath = relativePath.startsWith('/') ? relativePath : '/' + relativePath;
      
      return basePath + cleanPath;
    },

    // Wait for plugins to be available and then initialize
    async waitForPluginsAndInitialize(retryCount = 0) {
      const maxRetries = 10;
      const delay = 200; // 200ms delay between retries
      
      // Check if required plugins are available
      if (this.checkPluginsAvailability()) {
        this.initializeCopper3D();
      } else if (retryCount < maxRetries) {
        this.$emit('model-state-updated', { modelName: `Loading 3D Engine... (${retryCount + 1}/${maxRetries})` });
        
        setTimeout(() => {
          this.waitForPluginsAndInitialize(retryCount + 1);
        }, delay);
      } else {
        console.error("[Model] Failed to initialize plugins after maximum retries");
        this.$emit('model-state-updated', { modelName: "Error: 3D engine initialization timed out" });
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
      // Wait for DOM elements to be available in client-only context
      this.waitForDOMAndInitialize();
    },

    // Wait for DOM elements to be available and then initialize
    async waitForDOMAndInitialize(retryCount = 0) {
      const maxRetries = 20;
      const delay = 100;

      // Check if DOM container is available
      this.container = this.$refs.baseDomObject;
      
      if (this.container) {
        this.initialize3DEngine();
      } else if (retryCount < maxRetries) {
        this.$emit('model-state-updated', { modelName: `Preparing 3D Container... (${retryCount + 1}/${maxRetries})` });
        
        setTimeout(() => {
          this.waitForDOMAndInitialize(retryCount + 1);
        }, delay);
      } else {
        console.error("[Model] Failed to find DOM container after maximum retries");
        this.$emit('model-state-updated', { modelName: "Error: DOM container not found" });
      }
    },

    // Initialize 3D engine after DOM is ready
    initialize3DEngine() {
      try {
        this.Copper = this.$Copper();           // Get Copper3D instance
        this.THREE = this.$three();             // Get Three.js instance  
        this.baseRenderer = this.$baseRenderer(); // Get main renderer
        const baseContainer = this.$baseContainer(); // Get 3D container

        // Verify all components are properly initialized
        if (!this.baseRenderer || !baseContainer || !this.container) {
          console.error("[Model] 3D components not properly initialized");
          this.$emit('model-state-updated', { modelName: "Error: 3D components missing" });
          return;
        }
      
        // Setup container with slight delay to ensure DOM is ready
        setTimeout(() => {
          // Set container size to match parent element
          if (baseContainer && this.container) {
            baseContainer.style.width = "100%";
            baseContainer.style.height = "100%";
            
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
        this.$emit('model-state-updated', { modelName: "Error: Failed to initialize 3D engine" });
      }
    },
    // get the model config
  changeModel(config) {
    this.modelConfig = config;
    this.loadTree(); 
    return config;
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
      } catch (error) {
        console.error("[Model] Error initializing VTK loader:", error);
        this.$emit('model-state-updated', { modelName: "Error: VTK loader initialization failed" });
      }
    },

    // Main initialization method - called after component is mounted
    async start(){
      
      // Use unified loadTree function for default model
      await this.loadTree();
    },

    async reciveColoringType(colorModelBy){
      
      if (!this.vtkLoader) {
        console.warn('[Model] VTK loader not initialized');
        return;
      }
      
      // Map the received coloring type to our colorMappingType values
      let colorMappingType = 'pressure'; // default
      
      if (colorModelBy === 'flux' || colorModelBy === 'flow') {
        colorMappingType = 'flux';
      } else if (colorModelBy === 'default' || colorModelBy === 'vessel-type') {
        colorMappingType = 'default';
      } else if (colorModelBy === 'pressure') {
        colorMappingType = 'pressure';
      }
      
      
      // Store the current color mapping type
      this.currentColorMappingType = colorMappingType;
      
      // Reload the current model with new color mapping
      try {
        // Set rendering state to false when updating color mapping
        this.renderingComplete = false;
        this.$emit('model-state-updated', { 
          modelName: 'Updating color mapping...',
          renderingComplete: false 
        });
        
        await this.loadTree({
          colorMappingType: colorMappingType,
          clearScene: true // Clear existing model first
        });
        
        
      } catch (error) {
        console.error('[Model] Error updating color mapping:', error);
        this.$emit('model-state-updated', { modelName: 'Error updating color mapping' });
      }
    },

    /**
     * Load tree model with enhanced configuration
     * @param {Object} options - Override default options
     */
    async loadTree(options = {}) {
      
      // Set rendering state to false when starting to load
      this.renderingComplete = false;
      this.$emit('model-state-updated', { 
        modelName: `Loading model...`,
        renderingComplete: false 
      });
      
      // Get base configuration
      const baseConfig = this.modelConfig;
      if (!baseConfig) {
        console.error(`[Model] Model configuration not found`);
        this.$emit('model-state-updated', { modelName: `Error: Model configuration not found` });
        return;
      }

      // Merge base config with provided options
      const config = {
        ...baseConfig,
        ...options,
        // Handle high quality option
        cylinderSegments: options.highQuality ? 12 : (options.cylinderSegments || baseConfig.cylinderSegments),
        // Use current color mapping type if not explicitly provided
        colorMappingType: options.colorMappingType || this.currentColorMappingType,
        // Force useCylinderGeometry to true to avoid line rendering first
        useCylinderGeometry: true
      };

      const vtkPath = this.getAssetPath(config.path);
      const result = await this.vtkLoader.loadVTKFile(vtkPath, {
        displayName: config.displayName,
        color: config.color,
        opacity: config.opacity,
        modelSize: config.modelSize,
        useCylinderGeometry: config.useCylinderGeometry,
        cylinderSegments: config.cylinderSegments,
        colorMappingType: config.colorMappingType || 'pressure', // Pass color mapping type
        defaultRotationY: config.defaultRotationY || 0, // Pass default horizontal rotation angle
        clearPrevious: options.clearScene !== false, // Only clear if not explicitly set to false
        useLoD: false,
        onProgress: (message) => {
          const progressMessage = `${message}`;
          this.$emit('model-state-updated', { modelName: progressMessage });
        },
        onComplete: () => {
          // Set rendering state to true when loading is complete
          this.renderingComplete = true;
          this.$emit('model-size-changed', config.modelSize);
          // Emit state update to parent
          this.$emit('model-state-updated', { 
            modelName: config.displayName,
            renderingComplete: true 
          });
          
          // Load camera view and resize
          const viewPath = this.getAssetPath('modelView/noInfarct_view.json');
          this.scene.loadViewUrl(viewPath);
          this.scene.onWindowResize();
        }
      });
      
      if (!result.success) {
        this.$emit('model-state-updated', { modelName: `Error: ${result.error.message}` });
      }
      
      return result;
    },

    // Handle click on gesture icons area
    handleGestureIconClick(event) {
      const rect = event.target.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const imageWidth = rect.width;
      
      // Check if click is in the first quarter (first 25% from left)
      if (clickX <= imageWidth / 4) {
        this.resetModelToDefault();
      }
    },

    // Handle model size changes from PanelControls
    handleModelSizeChange(newSize) {
      if (this.vtkLoader && this.vtkLoader.scene) {
        this.vtkLoader.scaleModel(newSize*2);
      }
    },

    // Reset model to default position, zoom, and remove any effects
    resetModelToDefault() {
      if (!this.scene) {
        console.warn('[Model] Scene not available for reset');
        return;
      }

      try {
        // Reset camera to default view
        const viewPath = this.getAssetPath('modelView/noInfarct_view.json');
        this.scene.loadViewUrl(viewPath);
        
        // Trigger window resize to ensure proper rendering
        this.scene.onWindowResize();
        
        // Clear any zoom/pan transformations and reset to initial state 
        if (this.vtkLoader) {
          // Remove any overlaid data or effects
          this.vtkLoader.clearTemporaryData();
        }
        
        
        // Emit state update to parent
        this.$emit('model-state-updated', { 
          modelName: this.modelName || 'Placental Arterial Tree',
          resetTriggered: true
        });
        
      } catch (error) {
        console.error('[Model] Error resetting model to default:', error);
      }
    },


  },



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
  },

  // Set model rotation angle (in radians)
  setModelRotation(rotationY) {
    if (!this.scene) {
      console.warn('[Model] Scene not available for rotation');
      return;
    }

    try {
      // Update the model configuration with new rotation
      this.modelConfig.defaultRotationY = rotationY;
      
      // Reload the model with new rotation
      this.loadTree({
        defaultRotationY: rotationY
      });
      
      
    } catch (error) {
      console.error('[Model] Error setting model rotation:', error);
    }
  }
};
</script>

<style scoped lang="scss">

.baseModelControl {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .baseModelCB {
    width: 240px;
    height: 70px;
    position: relative;
  }
  .baseModelCB-md {
    width: 280px;
    height: 100px;
  }
}

.baseModelControl-md {
  // Desktop specific styles
  bottom: 20px;
}
.baseModelControl-sm {
  height: 60px;
  bottom: 10px;
  
  .baseModelCB {
    width: 200px;
    height: 60px;
  }
}

.model-info {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2em;
  color: white;
  z-index: 1000;
  background-color: var(--v-info-base);
  padding: 8px 16px;
  border-radius: 4px;
}
.model-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--v-backgroundAlt-base);
}

.model-viewport {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.baseDom-md {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.baseDom-sm {
  width: 100%;
  height: 100%;
}

// Responsive adjustments for mobile
@media (max-width: 768px) {
  // Mobile responsive adjustments
}
</style> 