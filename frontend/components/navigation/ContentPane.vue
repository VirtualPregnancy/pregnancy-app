<template>
  <!-- All the data is in _slug/pageData -->
  <div :class="mdAndUp ? ' w-full h-100 full_main_content' : 'w-full small_main_content'" style="background-color: var(--v-background-base);">
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

      <!-- Resources -->
      <div class="grid md:grid-cols-2 gap-6">
        <v-card 
          v-for="card in cards" 
          :key="card.id" 
          class="resource-card elevation-2"
          :style="{ backgroundColor: card.backgroundColor, color: card.textColor }"
        >
          <v-card-title class="resource-card-title">
            <v-icon left :color="card.iconColor" class="resource-icon">{{ card.icon }}</v-icon>
            <span class="resource-title">{{ card.title }}</span>
          </v-card-title>
          <v-card-text :style="{ color: card.textColor }" class="resource-content">
            <div v-html="card.content"></div>
          </v-card-text>
        </v-card>
      </div>
      <Logo v-if="mdAndUp" class="logo" />
    </div>
  </div>
</template>

<script>
import Logo from '@/components/support/Logo.vue';
import UltrasoundWhatIsFetalDevelopment from '@/components/content/UltrasoundWhatIsFetalDevelopment.vue';
import UltrasoundWhatIsPlacentaPosition from '@/components/content/UltrasoundWhatIsPlacentaPosition.vue';
import UltrasoundDoppler from '@/components/content/UltrasoundDoppler.vue';
import PregnancyFetalDev from '@/components/content/PregnancyFetalDev.vue';
import PregnancyPersonalisedAssessment from '@/components/content/PregnancyPersonalisedAssessment.vue';
export default {
  name: 'ContentPane',  
  components: {
    Logo,
    UltrasoundWhatIsFetalDevelopment,
    UltrasoundWhatIsPlacentaPosition,
    UltrasoundDoppler,
    PregnancyFetalDev,
    PregnancyPersonalisedAssessment
  },
  props: {
    pageTitle: {
      type: String,
      default: 'Page Title'
    },
    pageDescription: {
      type: String,
      default: 'Page description'
    },
    contentSections: {
      type: Array,
      default: () => []
    },
    cards: {
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
  min-height: 100vh;
  padding-bottom: 120px; /* Extra space for navigation */
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

/* Resource Cards */
.resource-card {
  border-radius: 16px;
  transition: all 0.3s ease;
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.logo {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 20dvh;
  height: 10dvh;
  z-index: 1000;
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
</style> 