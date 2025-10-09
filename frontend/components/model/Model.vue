<template>
  <div :class="mdAndUp ? 'model-container' : 'model-container-sm'">
    <!-- Model Info Header -->
    <div class="model-header">
      <!-- Refresh Icon -->
      <v-btn @click="resetModelToDefault" color="primary" icon>
        <v-icon :size="mdAndUp ? 30 : 24">mdi-refresh</v-icon>
      </v-btn>
      <!-- Model Name -->
      <span class="model-info">{{ modelName }}</span>
      <!-- Help Icon -->
      <v-btn @click="showHelpDialog = true" color="primary" icon>
        <v-icon :size="mdAndUp ? 30 : 24">mdi-help-circle-outline</v-icon>
      </v-btn>
      <!-- Fullscreen Icon -->
      <v-btn @click="toggleFullscreen" v-if="mdAndUp" color="primary" icon>
        <v-icon :size="mdAndUp ? 30 : 24">{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
      </v-btn>
    </div>

    <!-- Scale Bar -->
    <!-- <div
      v-if="scaleBarConfig && scaleBarConfig.enabled"
      class="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
    >
      <div class="rounded px-3 py-2 flex flex-col items-center gap-1">
        <div
          class="relative flex items-center"
          :style="{ width: scaleBarConfig.length + 'px' }"
        >
          <div
            class="absolute left-0 bg-black"
            :class="mdAndUp ? 'w-0.5 h-3' : 'w-0.5 h-2'"
          ></div>
          <div
            class="bg-black mx-1"
            :class="mdAndUp ? 'h-0.5' : 'h-0.5'"
            :style="{ width: scaleBarConfig.length - 8 + 'px' }"
          ></div>
          <div
            class="absolute right-0 bg-black"
            :class="mdAndUp ? 'w-0.5 h-3' : 'w-0.5 h-2'"
          ></div>
        </div>
        <div
          class="text-black font-semibold text-shadow-sm whitespace-nowrap"
          :class="mdAndUp ? 'text-sm' : 'text-xs'"
        >
          {{ scaleBarConfig.label }}
        </div>
      </div>
    </div> -->
    <!-- Help Dialog -->
    <v-dialog v-model="showHelpDialog" max-width="400" persistent>
      <v-card class="help-dialog">
        <v-card-title class="text-h6 pb-2">
          Model Controls 
        </v-card-title>
        <v-card-text class="pt-0">
          <span class="text-l mt-4 font-bold"> For touchable devices, use the following gestures to control the model:</span>
          <div class="help-content">
            <div class="help-item">
              <v-icon color="primary" class="mr-3">mdi-gesture-two-tap</v-icon>
              <span>Use 3 fingers to drag and move the model</span>
            </div>
            <div class="help-item">
              <v-icon color="primary" class="mr-3">mdi-gesture-pinch</v-icon>
              <span>Use 2 fingers to pinch and zoom the model</span>
            </div>
            <div class="help-item">
              <v-icon color="primary" class="mr-3">mdi-gesture-swipe</v-icon>
              <span>Swipe to rotate the model</span>
            </div>
          </div>
          <span class="text-l mt-4 font-bold">For non-touchable devices, use the mouse to control the model:</span>
          <div class="help-content">
            <div class="help-item">
              <v-icon color="primary" class="mr-3">mdi-mouse</v-icon>
              <span>Use the mouse to drag and move the model</span>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showHelpDialog = false">
            Got it
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <client-only>
      <!-- 3D model container -->
      <div class="model-viewport">
        <div
          ref="baseDomObject"
          :class="mdAndUp ? 'baseDom-md' : 'baseDom-sm'"
        />
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
import VTKLoader from "@/utils/vtkLoader";
import modelData from "@/assets/data/modelData.json";

export default {
  props: {
    // Model control states from parent component
    useTubeRendering: {
      type: Boolean,
      default: true,
    },
    currentPerformanceMode: {
      type: String,
      default: "high",
    },
    modelName: {
      type: String,
      default: "Loading...",
    },
  },

  // Component data - stores all reactive properties
  data() {
    return {
      Copper: null, // Copper3D library instance for 3D rendering
      THREE: null, // Three.js library instance for 3D geometry
      baseRenderer: null, // Main renderer for managing 3D scenes
      container: null, // DOM container for 3D canvas
      vtkLoader: null, // VTK loader utility instance
      _resizeHandler: null, // Store resize handler for cleanup
      clientMounted: false, // Track if component is mounted on client
      currentColorMappingType: "pressure", // Track current color mapping type
      renderingComplete: false, // Track if model is fully rendered and ready
      // Model configuration
      modelConfig: null,
      // Scale bar configuration
      scaleBarConfig: null,
      scaleBarWidth: 50, // Default width in pixels
      // Help dialog state
      showHelpDialog: false, // Control help dialog visibility
      // Fullscreen state
      isFullscreen: false, // Track fullscreen mode
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
        return (
          this.$vuetify &&
          this.$vuetify.breakpoint &&
          this.$vuetify.breakpoint.mdAndUp
        );
      } catch (e) {
        console.warn("[Model] Error accessing vuetify breakpoint:", e);
        return false;
      }
    },
  },

  watch: {
    // Watch for changes in mdAndUp to trigger re-render
    mdAndUp: {
      handler(newVal) {
        // Force re-render when breakpoint changes
        this.$nextTick(() => {
          if (this.scene && this.scene.onWindowResize) {
            this.scene.onWindowResize();
          }
        });
      },
      immediate: false
    }
  },

  // Component mounted lifecycle - initializes 3D environment
  mounted() {
    this.modelConfig = modelData.models[0].config;
    this.initializeScaleBar();
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
    // Apply device-aware, stable camera control settings
    applyControlTuning() {
      try {
        const scene = this.scene;
        if (!scene || !scene.controls) return;

        const controls = scene.controls;
        const size =
          this.modelConfig && this.modelConfig.modelSize
            ? this.modelConfig.modelSize
            : 200;

        // Mobile/tablet detection: fall back to Vuetify breakpoint
        const isTouchDevice =
          typeof window !== "undefined" &&
          ("ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0);
        const isMobileOrTablet = isTouchDevice && !this.mdAndUp;

        if (isMobileOrTablet) {
          // Lower speeds to avoid sudden jumps; clamp distances
          controls.rotateSpeed = 0.8;
          controls.zoomSpeed = 0.2;
          controls.panSpeed = 0.15;
          // Constrain camera distance around model size
          controls.minDistance = Math.max(10, size * 0.25);
          controls.maxDistance = Math.max(controls.minDistance + 10, size * 6);
          if (typeof controls.minZoom !== "undefined") {
            controls.minZoom = 0.8;
            controls.maxZoom = 2.0;
          }
        } else {
          // Desktop: slightly faster but still stable
          controls.rotateSpeed = 1.0;
          controls.zoomSpeed = 0.8;
          controls.panSpeed = 0.5;
          controls.minDistance = Math.max(10, size * 0.2);
          controls.maxDistance = Math.max(controls.minDistance + 10, size * 10);
          if (typeof controls.minZoom !== "undefined") {
            controls.minZoom = 0.5;
            controls.maxZoom = 4.0;
          }
        }

        // Nudge an update if available, but don't block the main thread
        if (typeof controls.update === "function") {
          requestAnimationFrame(() => {
            controls.update();
          });
        }
      } catch (e) {
        console.warn("[Model] Failed to apply control tuning:", e);
      }
    },
    // Get correct path for static assets based on deployment environment
    getAssetPath(relativePath) {
      let basePath = "";

      // Check if we're in GitHub Pages environment using multiple methods
      if (process.client) {
        // Check current URL to determine if we're on GitHub Pages
        const isGitHubPages =
          window.location.pathname.startsWith("/pregnancy-app/") ||
          window.location.hostname.includes("github.io");
        basePath = isGitHubPages ? "/pregnancy-app" : "";
      } else {
        // Server-side: use environment variable
        const isGitHubPages = process.env.DEPLOY_ENV === "GH_PAGES";
        basePath = isGitHubPages ? "/pregnancy-app" : "";
      }

      // Ensure the path starts with / if not already
      const cleanPath = relativePath.startsWith("/")
        ? relativePath
        : "/" + relativePath;

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
        this.$emit("model-state-updated", {
          modelName: `Loading 3D Engine... (${retryCount + 1}/${maxRetries})`,
        });

        setTimeout(() => {
          this.waitForPluginsAndInitialize(retryCount + 1);
        }, delay);
      } else {
        console.error(
          "[Model] Failed to initialize plugins after maximum retries"
        );
        this.$emit("model-state-updated", {
          modelName: "Error: 3D engine initialization timed out",
        });
      }
    },

    // Check if all required plugins are available
    checkPluginsAvailability() {
      try {
        return (
          this.$Copper &&
          this.$three &&
          this.$baseRenderer &&
          this.$baseContainer &&
          typeof this.$Copper === "function" &&
          typeof this.$three === "function" &&
          typeof this.$baseRenderer === "function" &&
          typeof this.$baseContainer === "function"
        );
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
        this.$emit("model-state-updated", {
          modelName: `Preparing 3D Container... (${
            retryCount + 1
          }/${maxRetries})`,
        });

        setTimeout(() => {
          this.waitForDOMAndInitialize(retryCount + 1);
        }, delay);
      } else {
        console.error(
          "[Model] Failed to find DOM container after maximum retries"
        );
        this.$emit("model-state-updated", {
          modelName: "Error: DOM container not found",
        });
      }
    },

    // Initialize 3D engine after DOM is ready
    initialize3DEngine() {
      try {
        this.Copper = this.$Copper(); // Get Copper3D instance
        this.THREE = this.$three(); // Get Three.js instance
        this.baseRenderer = this.$baseRenderer(); // Get main renderer
        const baseContainer = this.$baseContainer(); // Get 3D container

        // Verify all components are properly initialized
        if (!this.baseRenderer || !baseContainer || !this.container) {
          console.error("[Model] 3D components not properly initialized");
          this.$emit("model-state-updated", {
            modelName: "Error: 3D components missing",
          });
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
        this.$emit("model-state-updated", {
          modelName: "Error: Failed to initialize 3D engine",
        });
      }
    },
    // Initialize scale bar configuration
    initializeScaleBar() {
      if (this.modelConfig?.scaleBar) {
        this.scaleBarConfig = this.modelConfig.scaleBar;
        this.scaleBarWidth = this.scaleBarConfig.length;
      } else {
        this.scaleBarConfig = null;
      }
    },

    // get the model config
    changeModel(config) {
      this.modelConfig = config;
      this.initializeScaleBar();
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
        this.scene = this.baseRenderer.getSceneByName("placental-scene");
        if (this.scene === undefined) {
          this.scene = this.baseRenderer.createScene("placental-scene");
          this.baseRenderer.setCurrentScene(this.scene);
        }

        // Create VTK loader instance
        this.vtkLoader = new VTKLoader(this.THREE, this.scene.scene);

        // Set copper scene reference for camera control
        this.vtkLoader.setCopperScene(this.scene);

        // Apply safer/tuned controls, especially for touch devices
        this.applyControlTuning();
      } catch (error) {
        console.error("[Model] Error initializing VTK loader:", error);
        this.$emit("model-state-updated", {
          modelName: "Error: VTK loader initialization failed",
        });
      }
    },

    // Main initialization method - called after component is mounted
    async start() {
      // Use unified loadTree function for default model
      await this.loadTree();
    },

    async reciveColoringType(colorModelBy) {
      if (!this.vtkLoader) {
        console.warn("[Model] VTK loader not initialized");
        return;
      }

      // Map the received coloring type to our colorMappingType values
      let colorMappingType = "pressure"; // default

      if (colorModelBy === "flux" || colorModelBy === "flow") {
        colorMappingType = "flux";
      } else if (colorModelBy === "default" || colorModelBy === "vessel-type") {
        colorMappingType = "default";
      } else if (colorModelBy === "pressure") {
        colorMappingType = "pressure";
      }

      // Store the current color mapping type
      this.currentColorMappingType = colorMappingType;

      // Reload the current model with new color mapping
      try {
        // Set rendering state to false when updating color mapping
        this.renderingComplete = false;
        this.$emit("model-state-updated", {
          modelName: "Updating color mapping...",
          renderingComplete: false,
        });

        await this.loadTree({
          colorMappingType: colorMappingType,
          clearScene: true, // Clear existing model first
        });
      } catch (error) {
        console.error("[Model] Error updating color mapping:", error);
        this.$emit("model-state-updated", {
          modelName: "Error updating color mapping",
        });
      }
    },

    /**
     * Load tree model with enhanced configuration
     * @param {Object} options - Override default options
     */
    async loadTree(options = {}) {
      // Set rendering state to false when starting to load
      this.renderingComplete = false;
      this.$emit("model-state-updated", {
        modelName: `Loading model...`,
        renderingComplete: false,
      });

      // Get base configuration
      const baseConfig = this.modelConfig;
      if (!baseConfig) {
        console.error(`[Model] Model configuration not found`);
        this.$emit("model-state-updated", {
          modelName: `Error: Model configuration not found`,
        });
        return;
      }

      // Merge base config with provided options
      const config = {
        ...baseConfig,
        ...options,
        // Handle high quality option
        cylinderSegments: options.highQuality
          ? 12
          : options.cylinderSegments || baseConfig.cylinderSegments,
        // Use current color mapping type if not explicitly provided
        colorMappingType:
          options.colorMappingType || this.currentColorMappingType,
        // Force useCylinderGeometry to true to avoid line rendering first
        useCylinderGeometry: true,
      };

      const vtkPath = this.getAssetPath(config.path);
      const result = await this.vtkLoader.loadVTKFile(vtkPath, {
        displayName: config.displayName,
        color: config.color,
        opacity: config.opacity,
        modelSize: config.modelSize,
        useCylinderGeometry: config.useCylinderGeometry,
        cylinderSegments: config.cylinderSegments,
        colorMappingType: config.colorMappingType || "pressure", // Pass color mapping type
        defaultRotationY: config.defaultRotationY || 0, // Pass default horizontal rotation angle
        clearPrevious: options.clearScene !== false, // Only clear if not explicitly set to false
        useLoD: false,
        onProgress: (message) => {
          const progressMessage = `${message}`;
          this.$emit("model-state-updated", { modelName: progressMessage });
        },
        onComplete: () => {
          // Set rendering state to true when loading is complete
          this.renderingComplete = true;
          this.$emit("model-size-changed", config.modelSize);
          // Emit state update to parent
          this.$emit("model-state-updated", {
            modelName: config.displayName,
            renderingComplete: true,
          });

          // Load camera view and resize
          const viewPath = this.getAssetPath("modelView/noInfarct_view.json");
          this.scene.loadViewUrl(viewPath);
          this.scene.onWindowResize();

          // Re-apply control tuning after view load
          this.applyControlTuning();
        },
      });

      if (!result.success) {
        this.$emit("model-state-updated", {
          modelName: `Error: ${result.error.message}`,
        });
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
        // Use requestAnimationFrame to prevent blocking the main thread
        requestAnimationFrame(() => {
          this.vtkLoader.scaleModel(newSize * 2);
          // Update controls to keep distances proportional to size
          this.applyControlTuning();
        });
      }
    },

    // Reset model to default position, zoom, and remove any effects
    resetModelToDefault() {
      console.log("[Model] Resetting model to default");
      if (!this.scene) {
        console.warn("[Model] Scene not available for reset");
        return;
      }

      // Use requestAnimationFrame to ensure smooth UI updates
      requestAnimationFrame(() => {
        try {
          // First, clear any temporary data
          if (this.vtkLoader) {
            console.log("[Model] Clearing temporary data");
            this.vtkLoader.clearTemporaryData();
          }

          // Reset model size first
          if (this.modelConfig && this.modelConfig.modelSize) {
            console.log("[Model] Resetting model size to:", this.modelConfig.modelSize);
            this.handleModelSizeChange(this.modelConfig.modelSize);
            this.$emit("model-size-changed", this.modelConfig.modelSize);
          }

          // Try to reset camera controls directly first
          if (this.scene && this.scene.controls) {
            console.log("[Model] Resetting camera controls");
            const controls = this.scene.controls;
            
            // Reset camera position and target to defaults
            if (controls.object && controls.target) {
              controls.object.position.set(0, 0, 500);
              controls.target.set(0, 0, 0);
              controls.update();
            }
          }

          // Apply control tuning before loading view
          this.applyControlTuning();

          // Reset camera to default view with proper timing
          const viewPath = this.getAssetPath("modelView/noInfarct_view.json");
          console.log("[Model] Loading camera view from:", viewPath);
          
          // Load the view
          this.scene.loadViewUrl(viewPath);
          
          // Force a render update immediately
          if (this.scene && this.scene.render) {
            this.scene.render();
          }
          
          // Give the view time to load and then trigger resize
          setTimeout(() => {
            console.log("[Model] Triggering window resize after view load");
            if (this.scene && this.scene.onWindowResize) {
              this.scene.onWindowResize();
            }
            
            // Force another render after resize
            if (this.scene && this.scene.render) {
              this.scene.render();
            }
            
            // Apply control tuning again after resize
            setTimeout(() => {
              this.applyControlTuning();
              
              // Final render to ensure everything is updated
              if (this.scene && this.scene.render) {
                this.scene.render();
              }
            }, 100);
          }, 100);

          // Emit state update to parent
          this.$emit("model-state-updated", {
            modelName: this.modelName || "Placental Arterial Tree",
            resetTriggered: true,
          });

          // If the above doesn't work, try reloading the entire model as a fallback
          setTimeout(() => {
            console.log("[Model] Fallback: attempting to reload model");
            this.loadTree({
              clearScene: true,
              colorMappingType: this.currentColorMappingType
            });
          }, 500);
        } catch (error) {
          console.error("[Model] Error resetting model to default:", error);
        }
      });
    },

    // Toggle fullscreen mode and reload model
    toggleFullscreen() {
      console.log("[Model] Toggling fullscreen mode");
      this.isFullscreen = !this.isFullscreen;
      
      // Emit fullscreen toggle event to parent layout
      this.$emit('fullscreen-toggle', this.isFullscreen);
      
      // If entering fullscreen, reload the model after a short delay
      if (this.isFullscreen) {
        console.log("[Model] Entering fullscreen mode, reloading model");
        setTimeout(() => {
          this.loadTree({
            clearScene: true,
            colorMappingType: this.currentColorMappingType
          });
        }, 300); // Give time for fullscreen transition
      } else {
        console.log("[Model] Exiting fullscreen mode");
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
      console.warn("[Model] Scene not available for rotation");
      return;
    }

    try {
      // Update the model configuration with new rotation
      this.modelConfig.defaultRotationY = rotationY;

      // Reload the model with new rotation
      this.loadTree({
        defaultRotationY: rotationY,
      });
    } catch (error) {
      console.error("[Model] Error setting model rotation:", error);
    }
  },
};
</script>

<style scoped lang="scss">
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

.model-header {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-info {
  font-size: 1.2em;
  color: black;
  font-weight: bold;
  white-space: nowrap;
  padding: 8px 16px;
  border-radius: 4px;
}
.model-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80dvh;

}
.model-container-sm{
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh; /* Fallback for browsers that don't support dvh */
  height: 60dvh; /* Dynamic viewport height for modern browsers */
  min-height: 300px; /* Ensure minimum height */
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
</style> 

