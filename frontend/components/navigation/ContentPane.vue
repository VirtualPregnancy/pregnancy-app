<template>
  <!-- All the data is in _slug/pageData -->
  <div :class="mdAndUp ? ' w-full h-100 full_main_content' : 'w-full small_main_content'" style="background-color: var(--v-backgroundAlt-base);">
    
    <div class="mx-auto md:p-8 pb-32 md:pb-40 w-full">
      <!-- Header -->
       <Header />
      <div class="mb-6 mt-6 mx-4">
        <h1 class="text-xl md:text-2xl font-medium font-weight-bold">
          {{ pageTitle }}
        </h1>
        <p class="text-sm text-gray-600 leading-relaxed" v-html="pageDescription">
        </p>
      </div>
      <!-- Content Sections -->
      <div class="space-y-6 mb-8">
        <!-- Single section article layout -->
        <SingleSection 
          v-if="isSingleSection" 
          :section="contentSections[0]"
        />

        <!-- Multiple sections expandable layout -->
        <template v-else>
          <MultipleSection
            v-for="section in contentSections" 
            :key="section.id"
            :section="section"
            :is-expanded="expandedSections[section.id]"
            @toggle="toggleSection"
          />
        </template>
      </div>

      <!-- Additional Resources Section -->
      <div v-if="additionalResources && additionalResources.length > 0" class="mb-8">
        <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
          Additional Resources
        </h2>
        <div :class="additionalResources.length > 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'grid grid-cols-1 gap-6'">
          <div 
            v-for="resource in additionalResources" 
            :key="resource.title"
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-l-4 border-transparent hover:border-blue-500"
          >
            <div class="p-6">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <v-icon 
                    :color="resource.iconColor" 
                    size="32"
                    class="resource-icon"
                  >
                    {{ resource.icon }}
                  </v-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {{ resource.title }}
                  </h3>
                  <p class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3" v-html="resource.description">
                  </p>
                  <a 
                    v-if="resource.link"
                    :href="resource.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                  >
                    Learn More
                    <v-icon size="16" class="ml-1">mdi-arrow-top-right</v-icon>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="logo">
        <Logo />
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Logo.vue';
import SingleSection from '@/components/content/SingleSection.vue'; // For article layout
import MultipleSection from '@/components/content/MultipleSection.vue'; // For expandable layout
import Header from '@/components/navigation/Header.vue';

export default {
  name: 'ContentPane',  
  components: {
    Logo,
    SingleSection,
    MultipleSection,
    Header
  },
  props: {
    pageTitle: {
      type: String,
      default: 'Page Title'
    },
    pageDescription: {
      type: String,
      default: ''
    },
    contentSections: {
      type: Array,
      default: () => []
    },
    additionalResources: {
      type: Array,
      default: () => []
    },
    defaultExpandedIndex: {
      type: Number,
      default: null
    },
  },

  data() {
    return {
      expandedSections: {}
    }
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    isSingleSection() {
      return this.contentSections && this.contentSections.length === 1;
    }
  },

  methods: {
    toggleSection(sectionId) {
      const willExpand = !this.expandedSections[sectionId];
      this.$set(this.expandedSections, sectionId, willExpand);
      if (willExpand) {
        // After expanding, scroll this section to the top for maximum view
        this.$nextTick(() => {
          setTimeout(() => this.scrollSectionToTop(sectionId), 300);
        });
      }
    },
    
    // Find the nearest scrollable ancestor
    getScrollParent(el) {
      if (!el) return null;
      let node = el.parentElement;
      while (node) {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
          return node;
        }
        node = node.parentElement;
      }
      return document.scrollingElement || document.documentElement;
    },

    // Check if an element can scroll vertically
    isScrollable(el) {
      if (!el) return false;
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      const canScroll = (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
      return canScroll;
    },

    // Smoothly scroll a section card to the top of its scroll container
    scrollSectionToTop(sectionId) {
      const element = document.querySelector(`[data-section-id="${sectionId}"]`);
      if (!element) return;

      // Prefer the layout's content panel if present
      const contentPanel = document.querySelector('.content-panel');
      const preferred = (contentPanel && this.isScrollable(contentPanel)) ? contentPanel : null;
      const container = preferred || this.getScrollParent(element);

      try {
        const isWindowContainer = (container === document.scrollingElement) || (container === document.documentElement) || (container === document.body);
        const elementRect = element.getBoundingClientRect();
        const offset = 12; // small breathing space from the very top

        if (isWindowContainer) {
          const targetTop = (window.pageYOffset || document.documentElement.scrollTop || 0) + elementRect.top - offset;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        } else {
          const containerRect = container.getBoundingClientRect();
          const currentScrollTop = container.scrollTop || 0;
          const delta = elementRect.top - containerRect.top - offset;
          const targetTop = currentScrollTop + delta;
          if (typeof container.scrollTo === 'function') {
            container.scrollTo({ top: targetTop, behavior: 'smooth' });
          } else {
            // Fallback
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      } catch (e) {
        // Ultimate fallback
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    
    // Handle scroll to section requests from quick access navigation
    handleScrollToSection(sectionId) {
      // First expand the section if it's not already expanded
      if (!this.expandedSections[sectionId]) {
        this.$set(this.expandedSections, sectionId, true);
      }
      
      
      // Wait for section to expand, then scroll to it
      this.$nextTick(() => {
        setTimeout(() => this.scrollSectionToTop(sectionId), 300);
      });
    },
    
    // Fix internal links to work with the app's routing system
    fixInternalLinks() {
      const basePath = this.$config.basePath || '';
      const links = this.$el.querySelectorAll('a[href^="/"]');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        // Add click event to handle internal navigation
        link.addEventListener('click', (e) => {
          e.preventDefault();
          // Use Nuxt router to navigate
          this.$router.push(href);
        });
        
        // Update href for proper display (but click handler will override)
        if (basePath && !href.startsWith(basePath)) {
          link.setAttribute('href', basePath + href);
        }
      });
    }
  },

  mounted() {
    // Handle default expanded section based on URL parameter
    if (this.defaultExpandedIndex !== null && this.contentSections && this.contentSections.length > 0) {
      // Convert 1-based index to 0-based array index
      const sectionIndex = this.defaultExpandedIndex - 1;
      if (sectionIndex >= 0 && sectionIndex < this.contentSections.length) {
        const targetSection = this.contentSections[sectionIndex];
        if (targetSection && targetSection.id) {
          this.$set(this.expandedSections, targetSection.id, true);
          
          // Scroll to the expanded section after a short delay
          this.$nextTick(() => {
            setTimeout(() => this.scrollSectionToTop(targetSection.id), 500);
          });
        }
      }
    }
    
    // Listen for scroll to section events from quick access navigation
    this.$nuxt.$on('scroll-to-content-section', this.handleScrollToSection);
    
    // Fix internal links after component is mounted
    this.$nextTick(() => {
      this.fixInternalLinks();
    });
  },
  
  beforeDestroy() {
    // Clean up event listeners
    this.$nuxt.$off('scroll-to-content-section', this.handleScrollToSection);
  }
}
</script>

<style scoped>
.full_main_content {
  background-color: var(--v-background-base);
  
}
.small_main_content {
  background-color: var(--v-background-base);
  padding:10px;
  min-height: 100vh;
  padding-bottom: 100px; /* Extra space for navigation */
}

.logo {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}


/* HTML Content Styles */
.content-text ::v-deep a {
  color: var(--v-primary-base);
  text-decoration: underline;
  transition: color 0.3s ease;
}

.content-text ::v-deep a:hover {
  color: var(--v-secondary-base);
  text-decoration: none;
}

.content-text ::v-deep a:visited {
  color: var(--v-accent-base);
}

.resource-content ::v-deep a {
  color: inherit;
  text-decoration: underline;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.resource-content ::v-deep a:hover {
  opacity: 1;
  text-decoration: none;
}

/* HTML Content Typography */
.content-text ::v-deep p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.content-text ::v-deep ul,
.content-text ::v-deep ol {
  margin-bottom: 1rem;
}

.content-text ::v-deep li {
  margin-bottom: 0.5rem;
}

.content-text ::v-deep strong {
  font-weight: 600;
}

.content-text ::v-deep em {
  font-style: italic;
}

/* Additional Resources Styles */
.resource-icon {
  transition: transform 0.3s ease;
}

.resource-card:hover .resource-icon {
  transform: scale(1.1);
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
