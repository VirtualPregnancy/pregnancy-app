<template>
  <div class="responsive-container display-flex ">
    <!-- Model Section -->
    <div class="model-section " :class="{ 'model-section-mobile': !mdAndUp }">
      <model
        ref="modelComponent"
        :use-tube-rendering="modelStates.useTubeRendering"
        :current-performance-mode="modelStates.currentPerformanceMode"
        :model-name="modelStates.modelName"
        :model-config="modelStates.modelConfig"
        @model-size-changed="handleModelSizeChanged"
        @model-state-updated="handleModelStateUpdate"

      />
    </div>

    <!-- Controls and Analytics Section -->
    <div class="controls-section" :class="{ 'controls-section-mobile': !mdAndUp }">
      <!-- Model Controls -->
      <div class="controls-panel">
        <PanelControls
          :use-tube-rendering="modelStates.useTubeRendering"
          :current-performance-mode="modelStates.currentPerformanceMode"
          :model-name="modelStates.modelName"
          :pressure-color-mapping="modelStates.pressureColorMapping"
          :pressure-mapping="modelStates.pressureMapping"
          :is-loading="modelStates.isLoading"
          :loading-complete="modelStates.loadingComplete"
          :rendering-complete="modelStates.renderingComplete"
          :current-model-size="modelStates.modelSize"
          @reload-arterial="handleReloadArterial"
          @colored-models-by-changed="handleColoredModelsByChanged"
          @model-size-changed="handleModelSizeChanged"
        />
      </div>

      <!-- Waveform Panel -->
      <div class="waveform-panel">
        <div>
          <img class="pb-5" :src="getAssetUrl(waveformData.waveformImg)" alt="Waveform" />
          <div class="text-center mb-3 font-italic text-sm">
            {{ waveformData.waveformNote }}
          </div>
        </div>
        <div class="waveform-content">
          <Waveform :waveform="waveformData" />
          <div class="mt-20 text-center mb-5">
            {{ waveformData.description }}
          </div>
        </div>
      </div>

      <!-- Logo Section for Desktop -->
      <div  class="logo-section ">
        <div class="logo-container">
          <Logo />
        </div>
      </div>
    </div>
  </div>

  <!-- </div> -->
</template>

<script>
import PanelControls from "../model/PanelControls.vue";
import Waveform from "../model/Waveform.vue";
import Logo from '@/components/Logo.vue';
import modelData from '@/assets/data/modelData.json';
export default {
  data() {
    return {
      
      clientMounted: false, // Track if component is mounted on client
      // Centralized model state management
      modelStates: {
        useTubeRendering: true,
        currentPerformanceMode: "high",
        modelName: "Loading...",
        modelConfig: modelData.models[0].config, // Initialize with healthy model config
        pressureColorMapping: null, // Pressure color mapping for display
        pressureMapping: true, // Track pressure mapping state
        isLoading: false, // Track if model is currently loading - initialize to false
        loadingComplete: false, // Track if loading has completed
        colorMappingType: 'pressure', // Track current color mapping type
        renderingComplete: false, // Track if model is fully rendered and ready for interaction
        modelSize: 200,
      },
      // Waveform data
      waveformData: modelData.models[0].waveform
    };
  },

  mounted() {
    this.clientMounted = true;
    $nuxt.$emit(
      "send-emitter-data",
      "data in RightPanel.vue send to Model.vue"
    );
    
    
    // Listen for condition events from the layout
    this.$nuxt.$on('conditions-updated', this.handleConditionsUpdated);
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
        console.warn("[RightPane] Error accessing vuetify breakpoint:", e);
        return false;
      }
    },
  },

  methods: {
    getAssetUrl(path) {
      const base = this.$config?.basePath || '';
      return `${base}${path}`;
    },
    
    // Handle events from PanelControls and forward to Model component
    handleReloadArterial() {
      if (this.$refs.modelComponent && this.$refs.modelComponent.loadTree) {
        this.$refs.modelComponent.loadTree({
          color: 0xff2222,
          displayName: 'Placental Tree',
          colorMappingType: this.modelStates.colorMappingType,
          pressureMapping: this.modelStates.pressureMapping
        });
      }
    },



    handleColoredModelsByChanged(coloredModelsBy) {
      console.log('[RightPane] Color mapping changed to:', coloredModelsBy);
      
      // Store the color mapping type in our state
      this.modelStates.coloredModelsBy = coloredModelsBy;
      this.modelStates.colorMappingType = coloredModelsBy; // Keep both for compatibility
      
      // Apply the color change to the current model
      this.$refs.modelComponent.reciveColoringType(coloredModelsBy);
    },

    // Handle state updates from Model component
    handleModelStateUpdate(newStates) {
      Object.assign(this.modelStates, newStates);
      
      // Ensure pressure mapping state is properly synchronized
      if (newStates.hasOwnProperty('pressureMapping')) {
        this.modelStates.pressureMapping = newStates.pressureMapping;
      }
      
      // Handle loading state updates
      if (newStates.hasOwnProperty('isLoading')) {
        this.modelStates.isLoading = newStates.isLoading;
      }
      
      if (newStates.hasOwnProperty('loadingComplete') && newStates.loadingComplete) {
        this.modelStates.loadingComplete = newStates.loadingComplete;
      }
      
      // Handle rendering complete state updates
      if (newStates.hasOwnProperty('renderingComplete')) {
        this.modelStates.renderingComplete = newStates.renderingComplete;
      }
    },
    
    handleModelSizeChanged(modelSize) {
      this.modelStates.modelSize = modelSize;
      // Forward the size change to the model component for scaling
      if (this.$refs.modelComponent && this.$refs.modelComponent.handleModelSizeChange) {
        this.$refs.modelComponent.handleModelSizeChange(modelSize);
      }
    },

    
    // Update the model and the waveform data
    handleConditionsUpdated(data) {
      // update the model and transfer the config to the model component
      if (this.$refs.modelComponent && this.$refs.modelComponent.changeModel) {
        this.$refs.modelComponent.changeModel(data.conditionData.config);
      }

      // update the waveform data
      this.waveformData = data.conditionData.waveform;
      
      // update model size from config
      if (data.conditionData.config && data.conditionData.config.modelSize) {
        this.modelStates.modelSize = data.conditionData.config.modelSize;
      }
    },
    

    

    

    

  },
  
  beforeDestroy() {
    // Clean up event listeners
    this.$nuxt.$off('conditions-updated', this.handleConditionsUpdated);
  },
  
  components: { PanelControls, Waveform, Logo },
};
</script>

<style scoped lang="scss">
// Responsive Container
.responsive-container {
  height: 100%;
  display: flex;
  flex-direction: row;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

// Model Section
.model-section {
  position: relative;
  min-height: 60vh;
  width: 60dvw;
  right: 10dvw;
  
  &.model-section-mobile {
    width: 100vw;
    min-width: 100vw;
    flex: 1;
    height: 50vh;
    right: 0;
    left: 0;
    margin: 0;
    padding: 0;
  }
}

// Controls Section
.controls-section {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 25dvw;
  max-width: 30vw;
  padding: 15px;
  padding-bottom: 120px; // Leave space for navigation
  overflow-y: auto;
  
  &.controls-section-mobile {
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;
    max-width: 100%;
    justify-content: center;
    align-items: center;
    height: auto;
    overflow-y: auto;
    flex-wrap: wrap;
    margin: 10px;
    box-sizing: border-box;
    padding-bottom: 100px; // Leave space for navigation on mobile
    border-left: none;
    border-top: 1px solid rgba(31, 102, 131, 0.2);
  }
}

// Individual Panels
.controls-panel {
  margin-bottom: 15px;
  
  .controls-section-mobile & {
    flex: 1;
    min-width: 300px;
    margin-right: 15px;
    margin-bottom: 10px;
  }
}

.waveform-panel {
  flex: 1;
  background: rgba(49, 54, 87, 0.1);
  border: 1px solid rgba(31, 102, 131, 0.3);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  

  
  .controls-section-mobile & {
    width: 100%;
    min-width: 100%;
    margin-right: 0;
    order: 3;
  }
}






.logo-section {
  max-width: 200px;
  margin: 0 auto;
  margin-top: 10px;
  opacity: 0.8;
}

// Legacy styles compatibility (remove after testing)
.model-panel {
  position: relative;
}
</style>