<template>
  <div class="pa-2">
    <div class="flexbox demo-head">
      <div>
        <h1 class="pt-2 main-heading">
          {{ $parentTopic().heading }} 
        </h1>
      </div>
    </div>
   
    <div>
      <client-only>
        <div
          v-if="$parentTopic().content"
          class="pt-2 pt-xl-4 marked"
        >
        {{ $parentTopic().content }}
      </div>
      <div v-if="$component() == 'ConditionSelector'">
        <div class="conditions-panel">
          <ConditionSelector
            @conditions-changed="handleConditionsChanged"
            @trigger-visualization="handleConditionVisualization"
            @reset-to-normal="handleResetToNormal"
            @panel-expanded="handleConditionsPanelExpanded"
            @panel-collapsed="handleConditionsPanelCollapsed"
          />
        </div>
      </div>
        <template #fallback>
          <div class="loading-placeholder pt-2">
            <v-skeleton-loader type="article" />
          </div>
        </template>
      </client-only>
    </div>
  </div>
</template>

<script>
import ConditionSelector from "../model/ConditionSelector.vue"

export default {
  components: { ConditionSelector },
  name: "Panel",

  data() {
    return {
      select: "",
      currentPanel: "",
      items: ["latest", "version 2.0", "version 1.0"],
      ultrasoundToolRef: null, // Reference to the ultrasound tool component
      isClient: false, // Track if we're on client side
    };
  },

  methods: {
    play: function (event) {
      // /model-heart#video-div
      const routeStr = this.$nuxt.$route.path;

      const lastChar = routeStr.charAt(routeStr.length - 1);

      if (lastChar === "/") {
        const newstr = routeStr.substr(0, routeStr.length - 1);
        this.$router.push({
          name: "video",
          params: { videoId: event.target.id, originPath: newstr },
        });
      } else {
        this.$router.push({
          name: "video",
          params: { videoId: event.target.id, originPath: routeStr },
        });
      }
    },
    
    // Handle metrics updates from the ultrasound tool
    handleMetricsUpdate(data) {
      //console.log('[Panel] Ultrasound metrics updated:', data);
      
      // Emit to parent components for potential handling
      // Note: ultrasound-metrics functionality removed
      
      // Store metrics for potential future use
      this.lastMetricsData = data;
    },
    
    // Handle model visualization requests from the ultrasound tool
    handleModelVisualization(data) {
      //console.log('[Panel] Model visualization requested:', data);
      
      // Emit to parent components (likely RightPane) to trigger model updates
      this.$emit('trigger-model-visualization', {
        type: 'model-visualization',
        data: data
      });
      
      // Future implementation: communicate with 3D model component
      // to highlight relevant parts based on ultrasound metrics
    },
    
    // Handle ultrasound tool component mounting
    handleToolMounted(toolComponent) {
      //console.log('[Panel] Ultrasound tool mounted and ready');
      this.ultrasoundToolRef = toolComponent;
      
      // Emit to parent to notify that the interactive tool is ready
      this.$emit('ultrasound-tool-ready', toolComponent);
    },
    
    // Method for parent components to interact with the ultrasound tool
    updateUltrasoundToolWithModelData(modelData) {
      if (this.ultrasoundToolRef && this.ultrasoundToolRef.updateModelVisualization) {
        this.ultrasoundToolRef.updateModelVisualization(modelData);
      }
    },
    
    // Handle pregnancy condition updates from the ultrasound tool
    handleConditionsUpdate(data) {
      //console.log('[Panel] Pregnancy conditions updated:', data);
      
      // Emit to parent components for potential handling
      this.$emit('conditions-updated', data);
      
      // Store condition data for potential future use
      this.lastConditionData = data;
    },
    
    // Handle condition visualization requests from the ultrasound tool
    handleConditionVisualization(data) {
      //console.log('[Panel] Condition visualization requested:', data);
      
      // Emit to parent components (likely RightPane) to trigger model updates
      this.$emit('trigger-condition-visualization', {
        type: 'pregnancy-conditions',
        data: data
      });
      
      // Future implementation: communicate with 3D model component
      // to show different placental models based on selected conditions
    },
    
    // Handle condition changes from ConditionSelector
    handleConditionsChanged(data) {
      //console.log('[Panel] Conditions changed:', data);
      
      // Forward to parent components
      this.$emit('conditions-updated', data);
      
      // Store condition data for potential future use
      this.lastConditionData = data;
    },
    
    // Handle reset to normal from ConditionSelector
    handleResetToNormal() {
      //console.log('[Panel] Reset to normal conditions');
      
      // Forward to parent components
      this.$emit('conditions-updated', { selectedConditions: [], reset: true });
    },
    
    // Handle condition panel expansion
    handleConditionsPanelExpanded() {
      //console.log('[Panel] Conditions panel expanded');
      // Optional: handle layout adjustments if needed
    },
    
    // Handle condition panel collapse
    handleConditionsPanelCollapsed() {
      //console.log('[Panel] Conditions panel collapsed');
      // Optional: handle layout adjustments if needed
    },
  },

  mounted() {
    this.isClient = true;
  },

  created() {
    // Only run on client side to avoid SSR mismatch
    if (process.client) {
      // Client-side initialization if needed
    }
  },

  updated() {
    if (this.isClient) {
      // Client-side updates if needed
    }
  },
};
</script>

<style lang="scss" scoped>
.conditions-panel {
  margin-top: 2dvh;
}
.select {
  width: 127px;
}
.v-input__slot {
  background: #fff;
}
.theme--dark.v-list {
  // v-secondary-base
  background: rgba(34, 155, 34, 1);
}

// .primary--text {
//   // color: var(--v-secondary-base) !important;
//   // caret-color: var(--v-secondary-base) !important;
//   color: #fff;
// }
</style>
