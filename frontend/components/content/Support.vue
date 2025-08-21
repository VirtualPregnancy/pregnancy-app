<template>
  <div :class="mdAndUp ? 'supportPanel-l' : 'supportPanel-s'" class="support-container">
    <h4 class="pt-2 main-heading text-center support-heading">
      Services that help you navigate pregnancy and connect with appropriate
      care:
    </h4>
    <div class="regional-services">
      <v-select
        v-model="selectedRegion"
        :items="regions"
        label="Select your region for specific services"
        outlined
        dense
        color="primary"
        class="region-selector"
      >
        <template v-slot:prepend-inner>
          <v-icon color="primary">mdi-map-marker</v-icon>
        </template>
      </v-select>
      <div v-if="selectedRegion" class="regional-info">
        <div class="regional-services-list">
          <h5>Services available in {{ selectedRegion }}:</h5>
          <ul>
            <li
              v-for="service in getRegionalServices(selectedRegion)"
              :key="service"
            >
              {{ service }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import {
  regions,
  regionalServices,
  serviceSections,
} from "@/assets/data/supportData";

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
      return (
        this.regionalServices[region] || [
          "Local District Health Board Maternity Services",
          "Community Midwifery Services",
          "Local Birthing Units",
          "Regional Support Groups",
        ]
      );
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
.support-container {
  @apply max-w-4xl mx-auto p-6;
  
  // Responsive padding
  @screen md {
    @apply p-8;
  }
  
  @screen lg {
    @apply p-10;
  }
}

.support-heading {
  @apply text-xl md:text-2xl lg:text-3xl font-bold mb-8;
  color: var(--v-primary-base, #1976d2);
  line-height: 1.4;
  
  // Add subtle text shadow for better readability
  text-shadow: 0 1px 3px rgba(25, 118, 210, 0.1);
  
  // Responsive font sizes
  @screen sm {
    @apply text-2xl;
  }
  
  @screen md {
    @apply text-3xl;
  }
  
  @screen lg {
    @apply text-4xl;
  }
}

.regional-services {
  @apply space-y-6;
  
  // Add smooth transitions
  transition: all 0.3s ease;
}

.region-selector {
  @apply mb-6;
  
  // Custom styling for the select component
  ::v-deep .v-input__slot {
    @apply bg-white border-2 border-gray-200 rounded-lg;
    transition: all 0.3s ease;
    
    &:hover {
      @apply border-blue-300;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
    }
    
    &.v-input--is-focused {
      @apply border-blue-500;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }
  }
  
  ::v-deep .v-label {
    @apply text-gray-700 font-medium;
  }
  
  ::v-deep .v-select__selections {
    @apply text-gray-900 font-medium;
  }
  
  ::v-deep .v-icon {
    @apply text-blue-500;
  }
}

.regional-info {
  @apply bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6;
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 30px rgba(25, 118, 210, 0.15);
    transform: translateY(-2px);
  }
  
  // Responsive padding
  @screen sm {
    @apply p-8;
  }
  
  @screen md {
    @apply p-10;
  }
}

.regional-services-list {
  @apply space-y-4;
  
  h5 {
    @apply text-lg md:text-xl font-bold mb-4;
    color: var(--v-primary-base, #1976d2);
    
    // Add underline decoration
    position: relative;
    
    &::after {
      content: '';
      @apply absolute bottom-0 left-0 w-16 h-1 bg-blue-500 rounded-full;
      transform: translateY(4px);
    }
  }
  
  ul {
    @apply space-y-3;
    
    li {
      @apply flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100;
      transition: all 0.3s ease;
      
      // Custom bullet point
      position: relative;
      
      &::before {
        content: '✓';
        @apply flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold;
        margin-top: 2px;
      }
      
      &:hover {
        @apply border-blue-200 bg-blue-50;
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
      }
      
      // Responsive text size
      @apply text-sm md:text-base;
      line-height: 1.6;
      color: var(--v-on-surface-base, #212121);
      font-weight: 500;
    }
  }
}

// Responsive design for different screen sizes
@screen sm {
  .support-container {
    @apply px-4;
  }
  
  .regional-info {
    @apply p-6;
  }
}

@screen md {
  .support-container {
    @apply px-6;
  }
  
  .regional-info {
    @apply p-8;
  }
  
  .regional-services-list {
    h5 {
      @apply text-xl;
    }
    
    ul li {
      @apply text-base;
    }
  }
}

@screen lg {
  .support-container {
    @apply px-8;
  }
  
  .regional-info {
    @apply p-10;
  }
}

// Dark mode support (if needed)
@media (prefers-color-scheme: dark) {
  .regional-info {
    @apply bg-gray-800 border-blue-400;
  }
  
  .regional-services-list {
    ul li {
      @apply bg-gray-700 border-gray-600 text-gray-100;
      
      &:hover {
        @apply bg-gray-600 border-blue-400;
      }
    }
  }
}

// Animation for smooth transitions
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.regional-info {
  animation: fadeInUp 0.5s ease-out;
}

// Focus states for accessibility
.region-selector:focus-within {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}

// Print styles
@media print {
  .support-container {
    @apply max-w-none p-0;
  }
  
  .regional-info {
    @apply bg-white border border-gray-300 shadow-none;
    break-inside: avoid;
  }
  
  .regional-services-list ul li {
    @apply bg-white border border-gray-200;
    
    &::before {
      @apply bg-gray-500;
    }
  }
}
</style>
  