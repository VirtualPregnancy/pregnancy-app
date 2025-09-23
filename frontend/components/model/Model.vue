<template>
  <div class="model-container">
    <div class="flex justify-between items-center row-flex">
      <!-- Model Info Header -->
      <header class="flex items-center gap-2 header-info">
        <!-- Help Icon -->
         <v-btn
         @click="showHelpDialog = true"
         color="primary"
         
         class="mr-5"
         >
         <v-icon size="32">mdi-help-circle-outline</v-icon>
        </v-btn>
        <!-- Model Name -->
        <span class="model-info">{{ modelName }}</span>
        <!-- Refresh Icon -->
        <v-btn
          @click="resetModelToDefault"
          color="primary"
          class="ml-5"
        >
          <v-icon size="32">mdi-refresh</v-icon>
        </v-btn>
      </header>
    </div>
    <!-- Scale Bar -->
    <div
      v-if="scaleBarConfig && scaleBarConfig.enabled"
      class="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
    >
      <div class="rounded px-3 py-2 flex flex-col items-center gap-1">
        <!-- Scale bar with end markers -->
        <div
          class="relative flex items-center"
          :style="{ width: scaleBarConfig.length + 'px' }"
        >
          <!-- Left vertical marker -->
          <div
            class="absolute left-0 bg-black"
            :class="mdAndUp ? 'w-0.5 h-3' : 'w-0.5 h-2'"
          ></div>
          <!-- Horizontal line -->
          <div
            class="bg-black mx-1"
            :class="mdAndUp ? 'h-0.5' : 'h-0.5'"
            :style="{ width: scaleBarConfig.length - 8 + 'px' }"
          ></div>
          <!-- Right vertical marker -->
          <div
            class="absolute right-0 bg-black"
            :class="mdAndUp ? 'w-0.5 h-3' : 'w-0.5 h-2'"
          ></div>
        </div>
        <!-- Label -->
        <div
          class="text-black font-semibold text-shadow-sm whitespace-nowrap"
          :class="mdAndUp ? 'text-sm' : 'text-xs'"
        >
          {{ scaleBarConfig.label }}
        </div>
      </div>
    </div>

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

    <!-- Help Dialog -->
    <v-dialog v-model="showHelpDialog" max-width="400" persistent>
      <v-card class="help-dialog">
        <v-card-title class="text-h6 pb-2">
          <v-icon left color="primary">mdi-gesture-tap</v-icon>
          Model Controls
        </v-card-title>
        <v-card-text class="pt-0">
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showHelpDialog = false">
            Got it
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

        // Nudge an update if available
        if (typeof controls.update === "function") {
          controls.update();
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

    // Handle model size changes from PanelControls
    handleModelSizeChange(newSize) {
      if (this.vtkLoader && this.vtkLoader.scene) {
        this.vtkLoader.scaleModel(newSize * 2);
        // Update controls to keep distances proportional to size
        this.applyControlTuning();
      }
    },

    // Reset model to default position, zoom, and remove any effects
    resetModelToDefault() {
      if (!this.scene) {
        console.warn("[Model] Scene not available for reset");
        return;
      }

      try {
        this.handleModelSizeChange(this.modelConfig.modelSize);
        this.$emit("model-size-changed", this.modelConfig.modelSize);
        // Reset camera to default view
        const viewPath = this.getAssetPath("modelView/noInfarct_view.json");
        this.scene.loadViewUrl(viewPath);

        // Trigger window resize to ensure proper rendering
        this.scene.onWindowResize();

        // Clear any zoom/pan transformations and reset to initial state
        if (this.vtkLoader) {
          // Remove any overlaid data or effects
          this.vtkLoader.clearTemporaryData();
        }

        // Ensure controls remain within sane limits after reset
        this.applyControlTuning();

        // Emit state update to parent
        this.$emit("model-state-updated", {
          modelName: this.modelName || "Placental Arterial Tree",
          resetTriggered: true,
        });
      } catch (error) {
        console.error("[Model] Error resetting model to default:", error);
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
.header-info {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}
.model-info {
  z-index: 1000;
  background-color: var(--v-info-base);
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 1.2em;
  color: white;
}

.help-icon {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  cursor: pointer;
  transition: opacity 0.2s ease;
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

.help-dialog {
  .help-content {
    .help-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      span {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }
}
</style> 