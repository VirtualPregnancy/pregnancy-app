<template>
  <div class="pa-2">
    <div class="flexbox demo-head">
      <div>
        <h1 class="pt-2 main-heading">
          {{ $parentTopic().heading }} 
        </h1>
        <h4 :class="'sub-heading font-weight-black ' + $subTitle() + '--text'">
          {{ $heading() }}
        </h4>
      </div>
    </div>
   
    <!-- Show regular markdown content for all topics -->
    
    <div>
      <client-only>
        <div
          v-if="fileFound"
          ref="markedDiv"
          class="pt-2 pt-xl-4 marked"
          v-html="markedText"
        >

      </div>
      <div v-if="$showConditionSelector()">
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
        <div v-if="!fileFound" class="error-message">
          <span>Data Not Found</span>
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
import { marked } from "marked";
import ConditionSelector from "../model/ConditionSelector.vue"

export default {
  components: { ConditionSelector },
  name: "Panel",

  data() {
    return {
      select: "",
      currentPanel: "",
      fileFound: false,
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
    async refreshContent() {
      const fileName = this.$dataFile();
      //console.log(`[Panel] Attempting to load markdown file: ${fileName}.md`);
      //console.log(`[Panel] Current route:`, this.$route);
      //console.log(`[Panel] Current content:`, this.$store.getters.getCurrentContent);
      
      try {
        // Try dynamic import first (better for webpack)
        const panelData = await import(`@/assets/data/markdown/${fileName}.md`);
        //console.log(`[Panel] Dynamic import data:`, panelData);
        
        let content = '';
        if (panelData && panelData.default) {
          content = panelData.default;
        } else if (typeof panelData === 'string') {
          content = panelData;
        }
        
        if (content && content.trim()) {
          this.fileFound = true;
          this.currentPanel = content;
          //console.log(`[Panel] Successfully loaded markdown file: ${fileName}.md with content length:`, content.length);
        } else {
          this.fileFound = false;
          this.currentPanel = '';
          //console.warn(`[Panel] Markdown file loaded but no usable content: ${fileName}.md`);
        }
      } catch (e) {
        //console.error(`[Panel] Failed to load markdown file with dynamic import: ${fileName}.md`, e);
        
        // Fallback to require
        try {
          const panelData = require(`@/assets/data/markdown/${fileName}.md`);
          //console.log(`[Panel] Fallback require data:`, panelData);
          
          let content = '';
          if (typeof panelData === 'string') {
            content = panelData;
          } else if (panelData && panelData.default) {
            content = panelData.default;
          }
          
          if (content && content.trim()) {
            this.fileFound = true;
            this.currentPanel = content;
            //console.log(`[Panel] Successfully loaded markdown file with require: ${fileName}.md`);
          } else {
            this.fileFound = false;
            this.currentPanel = '';
            //console.warn(`[Panel] Require fallback: no usable content: ${fileName}.md`);
          }
        } catch (requireError) {
          //console.error(`[Panel] Both dynamic import and require failed for: ${fileName}.md`, requireError);
          this.fileFound = false;
          this.currentPanel = '';
        }
      }
    },
    addVideoLinks: function () {
      // Add video links for topics that have markdown content
      if (this.fileFound && this.$refs.markedDiv) {
        const markedDiv = this.$refs.markedDiv;
        const links = markedDiv.getElementsByTagName("span");
        let i;
        for (i = 0; i < links.length; i++) {
          let element = links[i];

          if (element.getAttribute("data-aed-play") == "aed_img") {
            element.addEventListener("click", () => {
              this.$router.push("/electricity-healthy");
            });
          }
          if (element.getAttribute("data-play") == "video") {
            element.addEventListener("click", this.play);
          }
        }
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

  computed: {
    markedText() {
      if (!this.currentPanel || typeof this.currentPanel !== 'string') {
        return '';
      }
      return marked(this.currentPanel);
    },
    
  },

  mounted() {
    this.isClient = true;
    this.refreshContent();
    this.addVideoLinks();
  },

  created() {
    // Only run on client side to avoid SSR mismatch
    if (process.client) {
      this.refreshContent();
    }
  },

  updated() {
    if (this.isClient) {
      this.refreshContent();
      this.addVideoLinks();
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
