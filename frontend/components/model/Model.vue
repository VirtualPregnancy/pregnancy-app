<template>
  <div class="model">
    <!-- Display current model loading status -->
    {{ modelName }}
    <!-- 3D model container div, responsive sizing based on screen size -->
    <div
        ref="baseDomObject"
        :class="mdAndUp ? 'baseDom-md' : 'baseDom-sm'"
      />
    <!-- Control panel with multiple VTK model options -->
    <div class="model-controls">
      <v-btn @click="reloadVTKModel" color="primary" small class="ma-1">
        Load Arterial
      </v-btn>
      <v-btn @click="loadVenousTree" color="blue" small class="ma-1">
        Load Venous
      </v-btn>
      <v-btn @click="loadTerminalVessels" color="green" small class="ma-1">
        Load Terminal
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
      vtkLoader: null      // VTK loader utility instance
    };
  },

  
 

  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },

  // Component mounted lifecycle - initializes 3D environment
  mounted() {
    // Initialize 3D libraries from plugins
    this.Copper = this.$Copper();           // Get Copper3D instance
    this.THREE = this.$three();             // Get Three.js instance  
    this.baseRenderer = this.$baseRenderer(); // Get main renderer
    const baseContainer = this.$baseContainer(); // Get 3D container
    this.container = this.$refs.baseDomObject;   // Get DOM reference
    
    // Setup container with slight delay to ensure DOM is ready
    setTimeout(() => {
      // Set responsive height based on screen size
      this.mdAndUp
        ? (baseContainer.style.height = "100vh")  // Full height on desktop
        : (baseContainer.style.height = "100vw"); // Square on mobile
      
      
      this.container.appendChild(baseContainer);
      
      // Initialize VTK loader and start loading models
      this.initializeVTKLoader();
      this.start();
    }, 100);

    window.addEventListener("resize", () => {
      setTimeout(() => {
        this.mdAndUp
          ? (baseContainer.style.height = "100vh")
          : (baseContainer.style.height = "100vw");
        this.scene.onWindowResize();
      }, 500);
    });
  },

  methods: {
    // Initialize VTK loader utility
    initializeVTKLoader() {
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

    /**
     * Load terminal vessels using VTKLoader utility
     */
    async loadTerminalVessels() {
      const result = await this.vtkLoader.loadVTKFile('/model/healthy_gen_np3ns1_flux_250_term.vtk', {
        displayName: 'Placental Terminal Vessels',
        color: 0x22ff22,
        opacity: 0.7,
        modelSize: 420, 
        lineWidth: 15, 
        pointSize: 50.0, 
        onProgress: (message, progress) => {
          this.modelName = `${message} (${Math.round(progress)}%)`;
        },
        onComplete: (mesh, isPointCloud) => {
          this.modelName = isPointCloud ? 
            'Placental Terminal Vessels (Point Cloud)' : 
            'Placental Terminal Vessels (Enhanced)';
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
      
    },
  },

  watch: {},

  beforeDestroy() {
    // Clean up VTK loader resources
    if (this.vtkLoader) {
      this.vtkLoader.dispose();
      this.vtkLoader = null;
    }
  }
};
</script>

<style scoped lang="scss">
.model-controls {
  position: absolute;
  top: 10px;
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
