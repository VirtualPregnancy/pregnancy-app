<template>
  <div :class="mdAndUp ? 'h-screen w-screen full_main_content' : 'w-full small_main_content'" style="background-color: var(--v-background-base);">
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
          class="elevation-2 overflow-hidden"
        >
          <!-- Section Header -->
          <v-card-title 
            class="cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            @click="toggleSection(section.id)"
          >
            <v-icon left :color="section.iconColor">{{ section.icon }}</v-icon>
            <span class="text-xl font-semibold flex-1">{{ section.title }}</span>
            <v-icon 
              :class="{ 'rotate-180': expandedSections[section.id] }"
              class="transition-transform duration-300"
            >
              mdi-chevron-down
            </v-icon>
          </v-card-title>

          <!-- Section Content -->
          <v-expand-transition>
            <v-card-text v-show="expandedSections[section.id]" class="pt-4">
              <div class="space-y-6">
                <div 
                  v-for="item in section.items" 
                  :key="item.id"
                  class="border-l-4 border-primary bg-gray-50 p-4 rounded-r-lg"
                >
                  <div class="flex items-center mb-3">
                    <v-icon 
                      small 
                      :color="item.iconColor" 
                      class="mr-2"
                    >
                      {{ item.icon }}
                    </v-icon>
                    <h3 class="text-lg font-semibold text-gray-800">
                      {{ item.title }}
                    </h3>
                  </div>
                  
                  <p class="text-gray-700 mb-4">{{ item.description }}</p>
                  
                  <ul v-if="item.list" class="space-y-2">
                    <li 
                      v-for="listItem in item.list" 
                      :key="listItem"
                      class="flex items-start text-gray-700"
                    >
                      <span class="text-primary mr-2 mt-1">•</span>
                      <span>{{ listItem }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </v-card-text>
          </v-expand-transition>
        </v-card>
      </div>

      <!-- Resources -->
      <div class="grid md:grid-cols-2 gap-6">
        <v-card class="elevation-2 hover:elevation-4 transition-all">
          <v-card-title class="text-primary">
            <v-icon left>mdi-book-open</v-icon>
            Learn More
          </v-card-title>
          <v-card-subtitle>Educational resources</v-card-subtitle>
          <v-card-text>
            Explore detailed information about pregnancy care and development.
          </v-card-text>
        </v-card>

        <v-card class="elevation-2 hover:elevation-4 transition-all">
          <v-card-title class="text-success">
            <v-icon left>mdi-phone</v-icon>
            Get Support
          </v-card-title>
          <v-card-subtitle>Contact information</v-card-subtitle>
          <v-card-text>
            Connect with healthcare providers and support services.
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentPane',
  
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
    }
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
    // Expand first section by default
    if (this.contentSections.length > 0) {
      this.$set(this.expandedSections, this.contentSections[0].id, true);
    }
  }
}
</script>

<style scoped>
/* Minimal styling - most done with TailwindCSS */
.full_main_content {
  background-color: var(--v-background-base);
  padding-left: 35%;
}
.small_main_content {
  background-color: var(--v-background-base);
}
.rotate-180 {
  transform: rotate(180deg);
}
</style> 