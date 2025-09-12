<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Simple heading -->
    <h2 class="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">
      Pregnancy Support Services
    </h2>
    
    <p class="text-center text-gray-600 mb-8">
      Services that help you navigate pregnancy and connect with appropriate care
    </p>

    <!-- Region selector -->
    <div class="mb-8">
      <v-select
        v-model="selectedRegion"
        :items="regions"
        label="Select your region"
        variant="outlined"
        color="primary"
        prepend-inner-icon="mdi-map-marker"
        class="max-w-md mx-auto"
      />
    </div>

    <!-- Services list -->
    <div v-if="selectedRegion" class="bg-blue-50 rounded-lg p-6">
      <h3 class="text-xl font-semibold text-blue-800 mb-4">
        Services in {{ selectedRegion }}
      </h3>
      
      <!-- Show services if available -->
      <div v-if="getRegionalServices(selectedRegion).length > 0">
        <ul class="space-y-3">
          <li 
            v-for="service in getRegionalServices(selectedRegion)" 
            :key="service.name || service"
            class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            @click="openServiceLink(service)"
          >
            <v-icon color="green" size="20" class="mt-0.5">mdi-check</v-icon>
            <div class="flex-grow">
              <span class="text-gray-700 hover:text-blue-600 transition-colors">
                {{ service.name || service }}
              </span>
              <v-icon 
                v-if="service.link" 
                color="blue" 
                size="16" 
                class="ml-2"
              >
                mdi-open-in-new
              </v-icon>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Show no services message -->
      <div v-else class="text-center py-8">
        <v-icon color="gray" size="48" class="mb-4">mdi-information-outline</v-icon>
        <p class="text-gray-600 text-lg mb-2">No specific services found for {{ selectedRegion }}</p>
        <p class="text-gray-500 text-sm">
          Please contact your local healthcare provider or visit the nearest hospital for assistance.
        </p>
        <v-btn 
          color="primary" 
          variant="outlined" 
          class="mt-4"
        >
          <v-icon start>mdi-phone</v-icon>
          Contact Healthline (0800 611 116)
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {
  regions,
  regionalServices,
  serviceSections,
} from "@/assets/data/supportData.json";

export default {
  layout: "default",
  name: "SupportPage",

  data() {
    return {
      sections: {
        general: true,
        specialist: false,
        resources: false,
      },
      selectedRegion: "",
      regions,
      regionalServices,
      serviceSections,
    };
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },

  methods: {
    toggleSection(section) {
      this.sections[section] = !this.sections[section];
    },
    getRegionalServices(region) {
      return this.regionalServices[region] || [];
    },
    openServiceLink(service) {
      // Handle both old string format and new object format
      if (typeof service === 'string') {
        // For backward compatibility, show alert for string services
        this.$toast.info(`Service: ${service}\n\nLink not available yet.`);
        return;
      }
      
      if (service.link) {
        // Open link in new tab
        window.open(service.link, '_blank', 'noopener,noreferrer');
      } else {
        // Show info if no link available
        this.$toast.info(`Service: ${service.name}\n\nLink not available yet.`);
      }
    },
    handleScrollToSection(sectionId) {
      if (this.sections.hasOwnProperty(sectionId)) {
        this.sections[sectionId] = true;
      }
      this.$nextTick(() => {
        setTimeout(() => {
          const sectionMap = {
            general: 1,
            specialist: 2,
            resources: 3,
          };
          const sectionIndex = sectionMap[sectionId];
          const element = document.querySelector(
            `.service-section:nth-child(${sectionIndex})`
          );
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 300);
      });
    },
  },

  created() {
    this.$store.commit("setChartLoaded", "");
    this.$nuxt.$on("scroll-to-section", this.handleScrollToSection);
  },
  beforeDestroy() {
    this.$nuxt.$off("scroll-to-section");
  },
};
</script>

<style lang="scss" scoped>
// Simple responsive design with Tailwind CSS
.max-w-4xl {
  max-width: 56rem;
}

// Ensure proper spacing and alignment
.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

// Enhanced hover effects for service items
.shadow-sm:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease-in-out;
  transform: translateY(-1px);
}

// Cursor pointer for clickable items
.cursor-pointer {
  cursor: pointer;
}

// Smooth transitions
.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

.transition-colors {
  transition: color 0.2s ease-in-out;
}

// Responsive text sizes
@media (max-width: 768px) {
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
}
</style>