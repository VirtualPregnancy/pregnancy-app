<template>
  <component 
    :is="pageComponent" 
    v-bind="pageProps"
  />
</template>

<script>
import ContentPane from '@/components/navigation/ContentPane.vue';
import RightPane from '@/components/navigation/RightPane.vue';
import { getPageData } from './pageData/pageDataLoader.js';

export default {
  layout: "default",
  components: { ContentPane, RightPane },

  async asyncData({ route, $getContentBySlug, error, store }) {
    const slug = route.params.slug;
    const content = $getContentBySlug(slug);
    
    if (!content) {
      error({ statusCode: 404, message: "Page not found" });
    }
    
    // Load page data from JSON
    const pageData = await getPageData(slug);
    
    // Extract URL query parameters for section expansion
    const query = route.query || {};
    const defaultExpandedIndex = query.index ? parseInt(query.index, 10) : null;
    
    store.commit("setCurrentContent", content);
    return { slug, content, pageData, defaultExpandedIndex };
  },

  computed: {
    // pageData is now loaded in asyncData

    pageComponent() {
      // Priority order: Model pages > Custom component type > Default content pane
      if (this.pageData?.showModel) {
        return 'RightPane';
      }
      
      // Use custom component type if specified
      if (this.pageData?.componentType) {
        const availableComponents = [
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
        pageDescription: this.pageData.description
      };

      // Add content sections
      baseProps.contentSections = this.pageData.contentSections || [];

      // Add renderConfig for custom components that support it
      if (this.pageData.renderConfig && 
          [].includes(this.pageComponent)) {
        baseProps.renderConfig = this.pageData.renderConfig;
      }


      // Add additional resources
      baseProps.additionalResources = this.pageData.addtionalResources || [];

      // Add default expanded section index from URL parameter
      baseProps.defaultExpandedIndex = this.defaultExpandedIndex;

      return baseProps;
    },
    
    
  }
};
</script>
