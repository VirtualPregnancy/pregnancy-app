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
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    PanelControls,
    Waveform,
    Logo
  },
  
  data() {
    return {
      clientMounted: false, // Track if component is mounted on client
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
    ...mapGetters('model', [
      'getModelStates',
      'getWaveformData',
      'isModelReady',
      'hasErrors'
    ]),
    
    // Map Vuex getters to local computed properties
    modelStates() {
      return this.getModelStates;
    },
    
    waveformData() {
      return this.getWaveformData;
    },
    
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
    ...mapActions('model', [
      'updateColorMapping',
      'updateModelSize',
      'updateConditions',
      'loadModel'
    ]),
    
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

    // Handle color mapping changes using Vuex action
    async handleColoredModelsByChanged(coloredModelsBy) {
      console.log('[RightPane] Color mapping changed to:', coloredModelsBy);
      
      // Use Vuex action to update color mapping
      await this.updateColorMapping(coloredModelsBy);
      
      // Show global loading immediately for better perceived responsiveness
      try {
        this.$nuxt && this.$nuxt.$emit('global-loading', true);
      } catch (e) {
        // no-op
      }

      // Apply the color change to the current model
      this.$refs.modelComponent.reciveColoringType(coloredModelsBy);
    },

    // Handle state updates from Model component using Vuex mutations
    handleModelStateUpdate(newStates) {
      // Use Vuex mutation to update states
      this.$store.commit('model/UPDATE_MODEL_STATES', newStates);
      
      // Handle rendering complete state updates
      if (newStates.hasOwnProperty('renderingComplete')) {
        // Emit global loading overlay toggle based on rendering state
        try {
          this.$nuxt && this.$nuxt.$emit('global-loading', !newStates.renderingComplete);
        } catch (e) {
          // no-op
        }
      }
    },
    
    // Handle model size changes using Vuex action
    async handleModelSizeChanged(modelSize) {
      // Use Vuex action to update model size
      await this.updateModelSize(modelSize);
      
      // Forward the size change to the model component for scaling
      if (this.$refs.modelComponent && this.$refs.modelComponent.handleModelSizeChange) {
        this.$refs.modelComponent.handleModelSizeChange(modelSize);
      }
    },

    
    // Update the model and the waveform data using Vuex action
    async handleConditionsUpdated(data) {
      // Use Vuex action to update conditions and model configuration
      await this.updateConditions(data);
      try {
        this.$nuxt && this.$nuxt.$emit('global-loading', true);
      } catch (e) {
        // no-op
      }
      if (this.$refs.modelComponent && this.$refs.modelComponent.changeModel) {
        this.$refs.modelComponent.changeModel(data.conditionData.config);
      }

      // update the waveform data using Vuex
      this.$store.commit('model/SET_WAVEFORM_DATA', data.conditionData.waveform);
      
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
    height: 60vh; /* Fallback for browsers that don't support dvh */
    height: 60dvh; /* Dynamic viewport height for modern browsers */
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
