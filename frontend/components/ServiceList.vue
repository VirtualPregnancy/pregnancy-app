<template>
  <div>
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

    <div v-if="selectedRegion" class="bg-blue-50 rounded-lg p-6">
      <h3 class="text-xl font-semibold text-blue-800 mb-4">
        Find Out {{ this.title }} in {{ selectedRegion }}
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
              <v-icon v-if="service.link" color="blue" size="16" class="ml-2">
                mdi-open-in-new
              </v-icon>
            </div>
          </li>
        </ul>
      </div>

      <!-- Show no services message -->
      <div v-else class="text-center py-8">
        <v-icon color="gray" size="48" class="mb-4"
          >mdi-information-outline</v-icon
        >
        <p class="text-center text-gray-600 text-lg mb-2">
          No specific services found for {{ selectedRegion }}
        </p>

        <v-btn
          color="primary"
          variant="outlined"
          class="mt-4"
          @click="
            window.open(
              'https://www.tewhatuora.govt.nz/for-health-providers/publicly-funded-health-and-disability-services/pregnancy-services',
              '_blank'
            )
          "
        >
          <v-icon color="white" size="16" class="ml-2">
            mdi-open-in-new
          </v-icon>
          For overall pregnancy services.
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    regions: {
      type: Array,
    },
    regionalServices: {
      type: Object,
    },
  },
  name: "ServiceList",
  data() {
    return {
      selectedRegion: "",
      regions: this.regions,
      regionalServices: this.regionalServices,
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
      if (typeof service === "string") {
        // For backward compatibility, show alert for string services
        this.$toast.info(`Service: ${service}\n\nLink not available yet.`);
        return;
      }

      if (service.link) {
        // Open link in new tab
        window.open(service.link, "_blank", "noopener,noreferrer");
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
