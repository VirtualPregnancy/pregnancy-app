<template>
  <div class="responsive-container display-flex ">
    <!-- Model Section -->
    <div class="model-section" :class="{ 'model-section-mobile': !mdAndUp }">
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
          <Logo />
      </div>
    </div>
  </div>

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

    // Proactively show loading overlay until first render completes
    try {
      this.$nuxt && this.$nuxt.$emit('global-loading', true);
    } catch (e) {
      // no-op
    }
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
        // Emit global loading overlay toggle based on rendering state
        try {
          this.$nuxt && this.$nuxt.$emit('global-loading', !newStates.renderingComplete);
        } catch (e) {
          // no-op
        }
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
// Layout: grid on desktop, stacked on mobile
.responsive-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr clamp(280px, 28vw, 420px);
  grid-column-gap: 16px;
  align-items: start;

  // Vuetify md breakpoint ~960px
  @media (max-width: 959.98px) {
    display: block;
  }
}

// Model Section
.model-section {
  position: relative;
  min-height: 60vh;
  width: 100%;

  &.model-section-mobile {
    width: 100%;
    min-width: 100%;
    height: 45vh; /* Fallback for browsers that don't support dvh */
    height: 45dvh; /* Dynamic viewport height for modern browsers */
    min-height: 300px; /* Ensure minimum height */
    margin: 0;
    padding: 0;
  }
}

// Controls Section
.controls-section {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh; 
  padding: 16px;
  padding-bottom: calc(96px + env(safe-area-inset-bottom)); 
  overflow-y: auto;
  box-sizing: border-box;

  // Mobile responsive layout
  &.controls-section-mobile {
    position: static;
    height: auto;
    width: 100%;
    max-width: 100%;
    overflow: visible;
    padding: 16px;
    padding-bottom: 120px; // Extra space for bottom navigation
    border-top: 1px solid rgba(31, 102, 131, 0.2);
    background-color: var(--v-background-base);
  }
}

// Individual Panels spacing
.controls-panel {
  margin-bottom: 16px;

  .controls-section-mobile & {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
  }
}

.waveform-panel {
  flex: 1 1 auto;
  background: rgba(49, 54, 87, 0.06);
  border: 1px solid rgba(31, 102, 131, 0.25);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }

  .controls-section-mobile & {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
    order: 2;
  }
}

.logo-section {
  max-width: 200px;
  margin: 10px auto 0 auto;
  opacity: 0.85;
  display: block;

  .controls-section-mobile & {
    order: 3;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

// Legacy styles compatibility (kept for safety)
.model-panel {
  position: relative;
}
</style>
