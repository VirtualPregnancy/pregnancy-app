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
    
    <!-- Show interactive tool for ultrasound topics -->
    <div v-if="isUltrasoundTopic" class="ultrasound-tool-container pt-2">
      <lazy-ultrasound-metrics-tool 
        @metrics-updated="handleMetricsUpdate"
        @trigger-model-visualization="handleModelVisualization"
        @ultrasound-tool-mounted="handleToolMounted"
        @conditions-updated="handleConditionsUpdate"
        @trigger-condition-visualization="handleConditionVisualization"
      />
    </div>
    
    <!-- Show regular content for non-ultrasound topics -->
    <div v-else>
      <div
        v-if="fileFound"
        ref="markedDiv"
        class="pt-2 pt-xl-4 marked"
        v-html="markedText"
      ></div>
      <div v-if="!fileFound" class="error-message">
        <span>Data Not Found</span>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from "marked";

export default {
  name: "Panel",

  data() {
    return {
      select: "",
      currentPanel: "",
      fileFound: false,
      items: ["latest", "version 2.0", "version 1.0"],
      ultrasoundToolRef: null, // Reference to the ultrasound tool component
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
    refreshContent: function () {
      const fileName = this.$dataFile();
      try {
        const panelData = require(`@/assets/data/markdown/${fileName}.md`);
        this.fileFound = true;
        this.currentPanel = panelData.default;
      } catch (e) {
        this.fileFound = false;
      }
    },
    addVideoLinks: function () {
      // Only add video links for non-ultrasound topics that have markdown content
      if (this.fileFound && !this.isUltrasoundTopic && this.$refs.markedDiv) {
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
      console.log('[Panel] Ultrasound metrics updated:', data);
      
      // Emit to parent components for potential handling
      this.$emit('ultrasound-metrics-updated', data);
      
      // Store metrics for potential future use
      this.lastMetricsData = data;
    },
    
    // Handle model visualization requests from the ultrasound tool
    handleModelVisualization(data) {
      console.log('[Panel] Model visualization requested:', data);
      
      // Emit to parent components (likely RightPane) to trigger model updates
      this.$emit('trigger-model-visualization', {
        type: 'ultrasound-metrics',
        data: data
      });
      
      // Future implementation: communicate with 3D model component
      // to highlight relevant parts based on ultrasound metrics
    },
    
    // Handle ultrasound tool component mounting
    handleToolMounted(toolComponent) {
      console.log('[Panel] Ultrasound tool mounted and ready');
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
      console.log('[Panel] Pregnancy conditions updated:', data);
      
      // Emit to parent components for potential handling
      this.$emit('conditions-updated', data);
      
      // Store condition data for potential future use
      this.lastConditionData = data;
    },
    
    // Handle condition visualization requests from the ultrasound tool
    handleConditionVisualization(data) {
      console.log('[Panel] Condition visualization requested:', data);
      
      // Emit to parent components (likely RightPane) to trigger model updates
      this.$emit('trigger-condition-visualization', {
        type: 'pregnancy-conditions',
        data: data
      });
      
      // Future implementation: communicate with 3D model component
      // to show different placental models based on selected conditions
    },
  },

  computed: {
    markedText() {
      return marked(this.currentPanel);
    },
    
    isUltrasoundTopic() {
      // Check if current route/topic is related to ultrasound
      const currentRoute = this.$route.path;
      const dataFile = this.$dataFile ? this.$dataFile() : '';
      
      return currentRoute.includes('ultrasound') || 
             dataFile === 'ultrasound' ||
             (this.$route.params && this.$route.params.slug === 'ultrasound-model');
    },
  },

  mounted() {
    this.addVideoLinks();
  },

  created() {
    this.refreshContent();
  },

  updated() {
    this.refreshContent();
    this.addVideoLinks();
  },
};
</script>

<style lang="scss" scoped>
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
