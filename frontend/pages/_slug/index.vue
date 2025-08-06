<template>
  <component 
    :is="pageComponent" 
    v-bind="pageProps"
  />
</template>

<script>
import ContentPane from '@/components/navigation/ContentPane.vue';
import RightPane from '@/components/navigation/RightPane.vue';
import TimelineContentPane from '@/components/navigation/TimelineContentPane.vue';
import pageDataMap from './pageData/index.js';

export default {
  layout: "default",
  components: { ContentPane, RightPane, TimelineContentPane },

  async asyncData({ route, $getContentBySlug, error, store }) {
    const slug = route.params.slug;
    const content = $getContentBySlug(slug);
    
    if (!content) {
      error({ statusCode: 404, message: "Page not found" });
    }
    
    store.commit("setCurrentContent", content);
    return { slug, content };
  },

  computed: {
    pageData() {
      return pageDataMap[this.slug] || null;
    },

    pageComponent() {
      // Priority order: Model pages > Custom component type > Default content pane
      if (this.pageData?.showModel) {
        return 'RightPane';
      }
      
      // Use custom component type if specified
      if (this.pageData?.componentType) {
        const availableComponents = [
          'TimelineContentPane', 
          'ContentPane'
        ];
        
        if (availableComponents.includes(this.pageData.componentType)) {
          return this.pageData.componentType;
        }
      }
      
      // Default fallback
      return 'ContentPane';
    },

    pageProps() {
      if (!this.pageData) {
        return {
          pageTitle: 'Page Not Found',
          pageDescription: 'The requested page could not be found.',
          contentSections: []
        };
      }

      // For RightPane (model pages), return minimal props
      if (this.pageComponent === 'RightPane') {
        return {};
      }

      // For all content panes (including custom ones), provide full props
      const baseProps = {
        pageTitle: this.pageData.title,
        pageDescription: this.pageData.description,
        contentSections: this.pageData.contentSections
      };

      // Add renderConfig for custom components that support it
      if (this.pageData.renderConfig && 
          ['TimelineContentPane'].includes(this.pageComponent)) {
        baseProps.renderConfig = this.pageData.renderConfig;
      }

      return baseProps;
    }
  }
};
</script>
