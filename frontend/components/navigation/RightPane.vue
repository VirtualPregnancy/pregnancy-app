<template>
  <div class="parent">
    <div class="model-panel">
              <model 
          ref="modelComponent"
          :use-tube-rendering="modelStates.useTubeRendering"
          :current-performance-mode="modelStates.currentPerformanceMode"
          :model-name="modelStates.modelName"
          @model-state-updated="handleModelStateUpdate"
        />
    </div>
    <div
      class="trace-main"
      :class="mdAndUp ? 'tracePanel-md' : 'tracePanel-sm'"
    >
      <div :class="mdAndUp ? 'trace-md' : 'trace-sm'">
        <PanelControls
          :use-tube-rendering="modelStates.useTubeRendering"
          :current-performance-mode="modelStates.currentPerformanceMode"
          :model-name="modelStates.modelName"
          :rendering-type="modelStates.renderingType"
          @reload-arterial="handleReloadArterial"
          @load-venous="handleLoadVenous"
          @load-arterial-cylinders="handleLoadArterialCylinders"
          @load-venous-cylinders="handleLoadVenousCylinders"
          @toggle-render-mode="handleToggleRenderMode"
          @cycle-performance="handleCyclePerformance"
        />
      </div>
      <div
        class="d-none d-md-flex justify-center"
        :class="mdAndUp ? 'logo-md' : 'logo-sm'"
      >
        <div class="logo-mdAndUp">
          <logo />
        </div>
      </div>
    </div>
  </div>

  <!-- </div> -->
</template>

<script>
import PanelControls from '../model/PanelControls.vue';

export default {
    data() {
        return {
            clientMounted: false, // Track if component is mounted on client
            // Centralized model state management
            modelStates: {
                useTubeRendering: true,
                currentPerformanceMode: 'high',
                modelName: 'Loading...',
                renderingType: '3D Cylinders' // Default to 3D cylinder rendering
            }
        };
    },
    
    mounted() {
        this.clientMounted = true;
        $nuxt.$emit("send-emitter-data", "data in RightPanel.vue send to Model.vue");
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
                console.warn("[RightPane] Error accessing vuetify breakpoint:", e);
                return false;
            }
        },
    },
    
    methods: {
        // Handle events from PanelControls and forward to Model component
        handleReloadArterial() {
            if (this.$refs.modelComponent && this.$refs.modelComponent.reloadModel) {
                this.$refs.modelComponent.reloadModel();
                this.modelStates.renderingType = '3D Cylinders';
            }
        },
        
        handleLoadVenous() {
            if (this.$refs.modelComponent && this.$refs.modelComponent.loadVenousTree) {
                this.$refs.modelComponent.loadVenousTree();
                this.modelStates.renderingType = '3D Cylinders';
            }
        },
        
        handleLoadArterialCylinders() {
            if (this.$refs.modelComponent && this.$refs.modelComponent.loadArterialTreeWithCylinders) {
                this.$refs.modelComponent.loadArterialTreeWithCylinders();
                this.modelStates.renderingType = 'High Quality 3D';
            }
        },
        
        handleLoadVenousCylinders() {
            if (this.$refs.modelComponent && this.$refs.modelComponent.loadVenousTreeWithCylinders) {
                this.$refs.modelComponent.loadVenousTreeWithCylinders();
                this.modelStates.renderingType = 'High Quality 3D';
            }
        },
        
        handleToggleRenderMode() {
            if (this.$refs.modelComponent && this.$refs.modelComponent.toggleRenderMode) {
                this.$refs.modelComponent.toggleRenderMode();
                // Update local state
                this.modelStates.useTubeRendering = !this.modelStates.useTubeRendering;
            }
        },
        
        handleCyclePerformance() {
            if (this.$refs.modelComponent && this.$refs.modelComponent.cyclePerformanceMode) {
                this.$refs.modelComponent.cyclePerformanceMode();
                // Update local state - cycle through modes
                const modes = ['high', 'medium', 'low', 'auto'];
                const currentIndex = modes.indexOf(this.modelStates.currentPerformanceMode);
                const nextIndex = (currentIndex + 1) % modes.length;
                this.modelStates.currentPerformanceMode = modes[nextIndex];
            }
        },
        
        // Handle state updates from Model component
        handleModelStateUpdate(newStates) {
            Object.assign(this.modelStates, newStates);
        }
    },
    components: { PanelControls }
};
</script>

<style scoped lang="scss">
.parent{
  width: 100vw;
  height: 100vh;
  display: flex;
}
.model-panel {
  // width: 100vw;
  // height: auto;
  flex: 1; 
  
}
.model-rate {
  position: relative;
  width: 100%;
  text-align: center;
}

.rate-mdAndUp {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-height: 20%;
  .heart-rate {
    margin-top: 10px;
    width: 60%;
    height: 100px;
  }
}

.logo-mdAndUp {
  width: 50%;
  // height: 100px;
  // display: block;
}
.logo-md {
  display: block;
  height: 10%;
}

.trace-main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 25px 3px;
}
.tracePanel-md {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  min-width: 280px;
  max-width: 25vw;
}
.tracePanel-sm {
  width: 100vw;
  height: auto;
}
.trace-md {
  min-height: 60%;
}
.trace-sm {
  width: 100%;
  margin-bottom: 100px;
  padding-right: 10px;
}
</style>
