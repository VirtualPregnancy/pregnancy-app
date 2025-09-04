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
      </div>

   
      <!-- Show Menu for content pages -->
      <div class="pa-4" :class="currentBg" tile :style="panelHeightStyle">
        <lazy-panel 
          @conditions-updated="handleConditionsUpdate"
        />
        <SubMenu 
          :subtopics="currentTopicSubtopics"
          :parent-slug="currentParentSlug"
          :topic-title="currentTopicTitle"
        />
      </div>
    </div>
    
  </div>
</template>

<script>
import SubMenu from './SubMenu.vue';
import pageDataMap from '@/pages/_slug/pageData/index.js';

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
    
    // Get current page data
    currentPageData() {
      const slug = this.$route.params.slug;
      const pageData = pageDataMap[slug] || { contentSections: [], cards: [] };
      //console.log('[LeftPane] Current slug:', slug);
      //console.log('[LeftPane] Page data:', pageData);
      return pageData;
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
