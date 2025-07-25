<template>
  <div class="left-pane">
    <div class="sm-logo d-md-none">
      <logo />
    </div>
    <div v-if="$route.name == 'slug'">
      <!-- currentBg  -->
      <div class="pa-4" :class="currentBg" tile :style="panelHeightStyle">
        <lazy-panel 
          @ultrasound-metrics-updated="handleUltrasoundMetricsUpdate"
          @trigger-model-visualization="handleModelVisualization"
          @ultrasound-tool-ready="handleUltrasoundToolReady"
          @conditions-updated="handleConditionsUpdate"
          @trigger-condition-visualization="handleConditionVisualization"
        />
      </div>
    </div>
    <div v-if="$route.name == 'about'">
      <v-card class="pa-4 bg-secondary" :style="panelHeightStyle">
        <lazy-about-us />
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeftPane",

  props: {
    panelHeight: {
      type: Number,
    },
  },

  computed: {
    currentBg() {
      return this.$category() ? "bg-" + this.$category() : "bg-success";
    },
    panelHeightStyle() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return { "min-height": this.panelHeight - 2 + "px" };
      } else return { height: "auto" };
    },
  },
  
  methods: {
    // Forward ultrasound metrics updates to parent components
    handleUltrasoundMetricsUpdate(data) {
      console.log('[LeftPane] Forwarding ultrasound metrics update:', data);
      this.$emit('ultrasound-metrics-updated', data);
    },
    
    // Forward model visualization requests to parent components
    handleModelVisualization(data) {
      console.log('[LeftPane] Forwarding model visualization request:', data);
      this.$emit('trigger-model-visualization', data);
    },
    
    // Handle ultrasound tool ready event
    handleUltrasoundToolReady(toolComponent) {
      console.log('[LeftPane] Ultrasound tool ready, forwarding to parent');
      this.$emit('ultrasound-tool-ready', toolComponent);
    },
    
    // Forward pregnancy condition updates to parent components
    handleConditionsUpdate(data) {
      console.log('[LeftPane] Forwarding conditions update:', data);
      this.$emit('conditions-updated', data);
    },
    
    // Forward condition visualization requests to parent components
    handleConditionVisualization(data) {
      console.log('[LeftPane] Forwarding condition visualization request:', data);
      this.$emit('trigger-condition-visualization', data);
    },
  },
};
</script>

<!-- Not scoped, will be available at other places. Currently, also used in Panel(.md files) and AboutUs components -->

<style lang="scss" src="@/assets/sass/components/left-panel.scss"></style>
