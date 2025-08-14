<template>
  <div class="left-pane h-full">
    <!-- Home button in top right corner -->
    <v-btn
      fab
      small
      color="primary"
      class="home-btn"
      :to="{ path: '/' }"
      @click="goHome"
    >
      <v-icon>mdi-home</v-icon>
    </v-btn>

   
    
    <div class="sm-logo d-md-none">
      <logo />
    </div>
    <div v-if="$route.name == 'slug'">
      
      <!-- Show different content based on page type -->
      <div v-if="isModelPage" class="pa-4" :class="currentBg" tile :style="panelHeightStyle">
        <lazy-panel 
          @trigger-model-visualization="handleModelVisualization"
          @ultrasound-tool-ready="handleUltrasoundToolReady"
          @conditions-updated="handleConditionsUpdate"
          @trigger-condition-visualization="handleConditionVisualization"
        />
      </div>
      
      <!-- Show quick access for content pages -->
      <div v-else class="pa-4" :class="currentBg" tile :style="panelHeightStyle">
        <lazy-panel 
          @trigger-model-visualization="handleModelVisualization"
          @ultrasound-tool-ready="handleUltrasoundToolReady"
          @conditions-updated="handleConditionsUpdate"
          @trigger-condition-visualization="handleConditionVisualization"
        />
        <QuickAccess 
          :content-sections="currentPageData.contentSections"
          :cards="currentPageData.cards"
          :mdAndUp="mdAndUp"
        />
      </div>
    </div>
    <div v-if="$route.name == 'support'">
      <v-card class="pa-4 bg-secondary" :style="panelHeightStyle">
        <lazy-support />
      </v-card>
    </div>
  </div>
</template>

<script>
import QuickAccess from './QuickAccess.vue';
import pageDataMap from '@/pages/_slug/pageData/index.js';

  export default {
  name: "LeftPane",
  
  components: {
    QuickAccess
  },

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
    
    // Get current page data
    currentPageData() {
      const slug = this.$route.params.slug;
      const pageData = pageDataMap[slug] || { contentSections: [], cards: [] };
      console.log('[LeftPane] Current slug:', slug);
      console.log('[LeftPane] Page data:', pageData);
      return pageData;
    },
    
    // Check if current page should show model
    isModelPage() {
      const showModel = this.currentPageData.showModel || false;
      console.log('[LeftPane] isModelPage:', showModel, 'for page:', this.$route.params.slug);
      return showModel;
    },
    
    // Vuetify breakpoint helper
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },
  
  methods: {
    // Navigate to home route
    goHome() {
      console.log('[LeftPane] Navigating to home');
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

<!-- Not scoped, will be available at other places. Currently, also used in Panel(.md files) and Support components -->

<style lang="scss" src="@/assets/sass/components/left-panel.scss"></style>
