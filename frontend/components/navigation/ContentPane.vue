<template>
  <div :class="mdAndUp ? 'h-screen w-screen full_main_content' : 'w-full h-screen small_main_content'" style="background-color: var(--v-background-base);">
    <div class="max-w-4xl mx-auto p-6 md:p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {{ pageTitle }}
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ pageDescription }}
        </p>
      </div>

      <!-- Content Sections -->
      <div class="space-y-6 mb-8">
        <v-card 
          v-for="section in contentSections" 
          :key="section.id"
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
              <div class="space-y-6">
                {{ section.content }}
              </div>
            </v-card-text>
          </div>
        </v-card>
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
            {{ card.content }}
          </v-card-text>
        </v-card>
      </div>
      <Logo class="logo" />
    </div>
  </div>
</template>

<script>
import Logo from '@/components/support/Logo.vue';
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
    }
  },

  methods: {
    toggleSection(sectionId) {
      this.$set(this.expandedSections, sectionId, !this.expandedSections[sectionId]);
    }
  },

  mounted() {
    // No sections expanded by default for cleaner initial appearance
  }
}
</script>

<style scoped>
.full_main_content {
  background-color: var(--v-background-base);
  padding-left: 35%;
}
.small_main_content {
  background-color: var(--v-background-base);
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
  overflow: hidden;
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
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20dvh;
  height: 10dvh;
  z-index: 1000;
}
</style> 