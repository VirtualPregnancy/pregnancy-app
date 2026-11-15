<template>
  <v-card 
    :data-section-id="section.id"
    class="section-card elevation-2 overflow-hidden"
    :class="{ 'section-card--expanded': isExpanded }"
  >
    <!-- Section Header -->
    <v-card-title 
      class="section-header cursor-pointer"
      @click="toggleSection"
    >
      <v-icon left :color="section.iconColor" class="section-icon">{{ section.icon }}</v-icon>
      <span class="text-xl font-semibold flex-1 section-title word-break-keep">{{ section.title }}</span>
      <v-icon 
        :class="{ 'chevron-rotated': isExpanded }"
        class="chevron-icon"
        color="primary"
      >
        mdi-chevron-down
      </v-icon>
    </v-card-title>

    <!-- Section Content -->
    <div class="section-content" :class="{ 'section-content--expanded': isExpanded }">
      <v-card-text class="content-text">
        <!-- Use custom component if specified -->
        <component 
          v-if="section.component" 
          :is="section.component"
          v-bind="section.props || {}"
          class="space-y-6"
        />
        <!-- Fallback to HTML content -->
        <div v-else class="space-y-6" v-html="contentHtml">
        </div>
      </v-card-text>

      <div v-if="section.additionalResources && section.additionalResources.length" class="px-6 pb-6">
        <div
          v-for="resource in section.additionalResources"
          :key="resource.title"
          class="resource-box"
        >
          <v-icon :color="resource.iconColor" size="28">{{ resource.icon }}</v-icon>
          <div class="resource-box__content">
            <h3 class="resource-box__title">{{ resource.title }}</h3>
            <p class="resource-box__description">{{ resource.description }}</p>
            <a
              :href="resource.link"
              target="_blank"
              rel="noopener noreferrer"
              class="resource-box__link"
            >
              Learn More
              <v-icon size="16" class="ml-1">mdi-arrow-top-right</v-icon>
            </a>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'MultipleSection',
  
  props: {
    section: {
      type: Object,
      required: true
    },
    isExpanded: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    contentHtml() {
      const basePath = this.$config.basePath || (
        process.env.DEPLOY_ENV === 'GH_PAGES' ? '/pregnancy-app' : ''
      );

      if (!basePath || !this.section.content) {
        return this.section.content;
      }

      return this.section.content.replace(
        /(["'])\/img\//g,
        `$1${basePath}/img/`
      );
    }
  },
 
  methods: {
    toggleSection() {
      this.$emit('toggle', this.section.id);
    }
  }
}
</script>

<style scoped lang="scss">
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

/* Word Break - Keep words intact */
.word-break-keep {
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: auto;
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

.resource-box {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-left: 4px solid var(--v-accent-base);
  border-radius: 8px;
  background: #f8fafc;
}

.resource-box__content {
  min-width: 0;
}

.resource-box__title {
  margin: 0 0 6px;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
}

.resource-box__description {
  margin: 0 0 10px;
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
}

.resource-box__link {
  display: inline-flex;
  align-items: center;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.resource-box__link:hover {
  color: #1e40af;
}
</style>

