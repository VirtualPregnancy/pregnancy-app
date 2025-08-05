<template>
  <div ref="outerDiv">
    <div class="text-center">
      <!-- Use 3D model for specific pages -->
      <right-pane v-if="shouldShowModel" />
      
      <!-- Use content layout for other pages -->
      <content-pane 
        v-else
        :page-title="pageTitle"
        :page-description="pageDescription"
        :content-sections="contentSections"
      />
    </div>
  </div>
</template>

<script>
import ContentPane from '@/components/navigation/ContentPane.vue';
import pageData from './pageData.js';

export default {
  layout: "default",
  components: {
    ContentPane
  },

  async asyncData({ route, $getContentBySlug, error, store }) {
    const slug = route.params.slug;
    let content = $getContentBySlug(slug);
    if (content === null) {
      error({ statusCode: 404, message: "Unexpected Error, Page not found" });
    }
    store.commit("setCurrentContent", content);
    
    return {
      slug,
      content
    };
  },

  computed: {
    shouldShowModel() {
      return pageData.modelPages.includes(this.slug);
    },

    pageTitle() {
      return pageData.titles[this.slug] || 'Page Title';
    },

    pageDescription() {
      return pageData.descriptions[this.slug] || 'Page description goes here';
    },

    contentSections() {
      return pageData.contentSections[this.slug] || [];
    }
  }
};
</script>

<style scoped lang="scss">
.right-pane {
  width: 100%;
  color: $text-color;
}
</style>
