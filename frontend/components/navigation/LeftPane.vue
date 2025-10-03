<template>
  <div class="left-pane h-full">
    <!-- Global menu now floats in layout; remove local controls -->

   
    
  
    <div v-if="$route.name == 'slug'">
      
      <div class="pa-4 mb-4" :class="currentBg" tile :style="panelHeightStyle">
        <lazy-panel 
          @conditions-updated="handleConditionsUpdate"
        />
        <SubMenu 
          :subtopics="currentTopicSubtopics"
          :parent-slug="currentParentSlug"
          :topic-title="currentTopicTitle"
        />
        
        <!-- Anchor for mobile scroll target -->
        <div id="leftpane-bottom" class="scroll-anchor"></div>
      </div>

   
    </div>
    
  </div>
</template>

<script>
import SubMenu from './SubMenu.vue';

  export default {
  name: "LeftPane",
  
  components: {
    SubMenu
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
    
    

    

    
    // Forward pregnancy condition updates to parent components
    handleConditionsUpdate(data) {
      //console.log('[LeftPane] Forwarding conditions update:', data);
      this.$emit('conditions-updated', data);
    },
    

  },
};
</script>

<!-- Not scoped, will be available at other places. Currently, also used in Panel(.md files) and Support components -->

<style lang="scss" src="@/assets/sass/components/left-panel.scss"></style>

<style scoped>
.scroll-anchor {
  height: 1px;
  visibility: hidden;
}
</style>
