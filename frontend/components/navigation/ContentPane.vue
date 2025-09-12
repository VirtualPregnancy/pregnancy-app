<template>
  <!-- All the data is in _slug/pageData -->
  <div :class="mdAndUp ? ' w-full h-100 full_main_content' : 'w-full small_main_content'" style="background-color: var(--v-backgroundAlt-base);">
    <div class="max-w-4xl mx-auto md:p-8 pb-32 md:pb-40">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {{ pageTitle }}
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto" v-html="pageDescription">
        </p>
      </div>

      <!-- Content Sections -->
      <div class="space-y-6 mb-8">
        <!-- Single section article layout -->
        <div v-if="isSingleSection" class="w-full">
          <article class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            
            <div class="p-6 md:p-10">
              <!-- Use custom component if specified -->
              <component 
                v-if="contentSections[0].component" 
                :is="contentSections[0].component"
                v-bind="contentSections[0].props || {}"
                class="prose prose-lg max-w-none prose-slate prose-headings:text-slate-800 prose-headings:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium"
              />
              <!-- Fallback to HTML content -->
              <div v-else class="prose prose-lg max-w-none prose-slate prose-headings:text-slate-800 prose-headings:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-blockquote:border-l-blue-500 prose-blockquote:bg-slate-50 prose-blockquote:rounded-r-lg prose-code:bg-slate-100 prose-code:rounded prose-pre:bg-slate-50" v-html="contentSections[0].content">
              </div>
            </div>
          </article>
        </div>

        <!-- Multiple sections expandable layout -->
        <template v-else>
          <v-card 
            v-for="section in contentSections" 
            :key="section.id"
            :data-section-id="section.id"
            class="section-card elevation-2 overflow-hidden"
            :class="{ 'section-card--expanded': expandedSections[section.id] }"
          >
            <!-- Section Header -->
            <v-card-title 
              class="section-header cursor-pointer"
              @click="toggleSection(section.id)"
            >
              <v-icon left :color="section.iconColor" class="section-icon">{{ section.icon }}</v-icon>
              <span class="text-xl font-semibold flex-1 section-title">{{ section.title }}</span>
              <v-icon 
                :class="{ 'chevron-rotated': expandedSections[section.id] }"
                class="chevron-icon"
                color="primary"
              >
                mdi-chevron-down
              </v-icon>
            </v-card-title>

            <!-- Section Content -->
            <div class="section-content" :class="{ 'section-content--expanded': expandedSections[section.id] }">
              <v-card-text class="content-text">
                <!-- Use custom component if specified -->
                <component 
                  v-if="section.component" 
                  :is="section.component"
                  v-bind="section.props || {}"
                  class="space-y-6"
                />
                <!-- Fallback to HTML content -->
                <div v-else class="space-y-6" v-html="section.content">
                </div>
              </v-card-text>
            </div>
          </v-card>
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
export default {
  name: 'ContentPane',  
  components: {
    Logo
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
      this.$set(this.expandedSections, sectionId, !this.expandedSections[sectionId]);
    },
    
    // Handle scroll to section requests from quick access navigation
    handleScrollToSection(sectionId) {
      // First expand the section if it's not already expanded
      if (!this.expandedSections[sectionId]) {
        this.$set(this.expandedSections, sectionId, true);
      }
      
      
      // Wait for section to expand, then scroll to it
      this.$nextTick(() => {
        setTimeout(() => {
          const element = document.querySelector(`[data-section-id="${sectionId}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300); // Wait for expansion animation
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
    // No sections expanded by default for cleaner initial appearance
    
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

/* Section Cards */
.section-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-left-color: var(--v-primary-base);
}

.section-card--expanded {
  border-left-color: var(--v-secondary-base);
}

/* Section Header */
.section-header {
  background: rgba(248, 250, 252, 0.95);
  transition: all 0.3s ease;
}

.section-header:hover {
  background: rgba(243, 244, 246, 1);
  transform: translateX(4px);
}

/* Chevron Animation */
.chevron-icon {
  transition: transform 0.3s ease;
}

.chevron-rotated {
  transform: rotate(180deg);
}

/* Content Animation */
.section-content {
  max-height: 0;
  overflow: scroll;
  transition: all 0.3s ease;
  opacity: 0;
}

.section-content--expanded {
  max-height: 1000px;
  opacity: 1;
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