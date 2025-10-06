<template>
  <div class="left-pane h-full">
    <!-- Global menu now floats in layout; remove local controls -->

   
    
  
    <div v-if="$route.name == 'slug'">
      
      <div class="pa-4 mb-4" :class="currentBg" tile :style="panelHeightStyle">
        <lazy-panel 
          @conditions-updated="handleConditionsUpdate"
        />
        <div v-if="$component() == 'ConditionSelector' && $vuetify.breakpoint.mdAndUp">
          <div class="conditions-panel">
            <ConditionSelector
              @conditions-changed="handleConditionsChanged"
              @reset-to-normal="handleResetToNormal"
              @panel-expanded="handleConditionsPanelExpanded"
              @panel-collapsed="handleConditionsPanelCollapsed"
            />
          </div>
        </div>
        <SubMenu 
          :subtopics="currentTopicSubtopics"
          :parent-slug="currentParentSlug"
          :topic-title="currentTopicTitle"
        />
        <div v-if="$component() == 'ConditionSelector' && !$vuetify.breakpoint.mdAndUp">
          <div class="conditions-panel">
            <ConditionSelector
              @conditions-changed="handleConditionsChanged"
              @reset-to-normal="handleResetToNormal"
              @panel-expanded="handleConditionsPanelExpanded"
              @panel-collapsed="handleConditionsPanelCollapsed"
            />
          </div>
        </div>
        
        <!-- Anchor for mobile scroll target -->
        <div id="leftpane-bottom" class="scroll-anchor"></div>
      </div>

   
    </div>
    
  </div>
</template>

<script>
import ConditionSelector from "../model/ConditionSelector.vue"
import SubMenu from './SubMenu.vue';

  export default {
  name: "LeftPane",
  
  components: {
    SubMenu,
    ConditionSelector
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
    
    
    
    // Vuetify breakpoint helper
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },

    // Get current topic's subtopics
    currentTopicSubtopics() {
      if (this.$route.name !== 'slug') return {};
      
      const parentTopic = this.$parentTopic();
      if (!parentTopic) return {};
      
      const topics = this.$getTopics();
      const topic = topics[parentTopic.slug.toLowerCase()];
      return topic?.subTopics || {};
    },

    // Get current parent slug
    currentParentSlug() {
      return this.$route.name === 'slug' ? this.$parentTopic()?.slug.toLowerCase() : '';
    },

    // Get current topic title
    currentTopicTitle() {
      if (this.$route.name !== 'slug') return '';
      
      const parentTopic = this.$parentTopic();
      if (!parentTopic) return '';
      
      const topics = this.$getTopics();
      const topic = topics[parentTopic.slug.toLowerCase()];
      return topic?.title || '';
    },
  },
  
  methods: {
    // Navigate to home route
    goHome() {
      //console.log('[LeftPane] Navigating to home');
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
    // Forward pregnancy condition updates to parent components
    handleConditionsUpdate(data) {
      //console.log('[LeftPane] Forwarding conditions update:', data);
      this.$emit('conditions-updated', data);
    },
    

  },
};
</script>

<style lang="scss" src="@/assets/sass/components/left-panel.scss"></style>

<style scoped>
.scroll-anchor {
  height: 1px;
  visibility: hidden;
}
</style>
