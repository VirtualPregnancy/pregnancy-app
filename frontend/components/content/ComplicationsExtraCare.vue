<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Title -->
    <h2 class="text-2xl md:text-2xl font-bold text-center mb-8" style="color: var(--v-primary-base);">
      NICU / SCBU – what they are and what to expect
    </h2>

    <!-- What it is -->
    <section class="mb-10">
      <h3 class="text-xl font-semibold mb-3" style="color: var(--v-accent-base);">
        What it is, why baby might need to be sent there
      </h3>
      <div class="text-gray-700 leading-relaxed space-y-3">
        <p>
          Neonatal care units support Pēpi(baby) who need extra help after birth. Special Care Baby Units (SCBU) and
          Neonatal Intensive Care Units (NICU) provide monitoring, breathing support, feeding assistance and specialist
          care depending on what your baby needs.
        </p>
        <p>
          Babies may be admitted for many reasons — being born preterm, low birth weight, breathing difficulties,
          infections, jaundice, or after a complicated birth. The teams include doctors, nurses, lactation consultants
          and allied health professionals working alongside you and your LMC.
        </p>
      </div>
    </section>

    <!-- Patient stories -->
    <section class="mb-10">
      <h3 class="text-xl font-semibold mb-3" style="color: var(--v-accent-base);">Patient stories</h3>
      <div class="text-gray-700 leading-relaxed mb-4">
        <p>
          Every whānau's experience is unique. We're curating short stories that explain what the first hours and days
          can feel like in SCBU/NICU, how families stayed connected with their pēpi, and practical tips that helped.
        </p>
      </div>
      
      <!-- Story bubbles -->
      <div class="story-bubbles-container relative py-2">
        <button
          v-for="(story, index) in patientStories"
          :key="index"
          @click="selectedStoryIndex = index"
          class="story-bubble absolute w-20 h-20 rounded-full text-sm font-medium text-white transition-all duration-300 hover:scale-110 hover:shadow-xl flex items-center justify-center text-center"
          :style="{
            backgroundColor: story.color || 'var(--v-primary-base)',
            left: getBubblePosition(index).left + '%',
            top: getBubblePosition(index).top + 'px'
          }"
        >
          {{ story.title }}
        </button>
      </div>

      <!-- Story popup -->
      <transition name="fade">
        <div
          v-if="selectedStoryIndex !== null"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          @click="selectedStoryIndex = null"
        >
          <div
            class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h4 class="text-xl font-semibold text-gray-800">{{ selectedStory.title }}</h4>
              <button @click="selectedStoryIndex = null" class="text-gray-400 hover:text-gray-600">
                <v-icon size="24">mdi-close</v-icon>
              </button>
            </div>
            <div class="px-6 py-5 text-gray-700 leading-relaxed space-y-4">
              <p v-for="(para, idx) in selectedStory.content" :key="idx">{{ para }}</p>
            </div>
          </div>
        </div>
      </transition>
    </section>

    <!-- Practical info: hospital selector -->
    <section class="mb-10">
      <h3 class="text-xl font-semibold mb-3" style="color: var(--v-accent-base);">Practical information to help</h3>
      <p class="text-gray-700 mb-4">
        Choose your hospital to get quick links for maps and local information. This uses public hospital data for
        Aotearoa New Zealand including certified fertility clinics, NGO hospitals and public hospitals.
      </p>
      <p class="text-gray-700 mb-4">
        You can find the local health provider by selecting your city/town below:
      </p>

      <div class="grid gap-4 sm:grid-cols-3 items-center mb-4">
        <label for="region" class="text-gray-800 font-medium font-bold">City/Town</label>
        <div class="sm:col-span-2">
          <v-select
            v-model="selectedRegion"
            :items="regionItems"
            @change="onRegionChange"
            :disabled="loading"
            outlined
            dense
            hide-details
            class="themed-vselect"
            style="--v-theme-overlay-multiplier: 1;"
          ></v-select>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-3 items-center">
        <label for="hospital" class="text-gray-800 font-medium font-bold">Find your hospital:</label>
        <div class="sm:col-span-2">
          <v-select
            v-model="selectedHospitalName"
            :items="hospitalItems"
            @change="onHospitalChange"
            :disabled="loading"
            outlined
            dense
            hide-details
            placeholder="Select..."
            class="themed-vselect"
            style="--v-theme-overlay-multiplier: 1;"
          ></v-select>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="mt-4 p-4 text-center">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading hospital data...
        </div>
      </div>

      <!-- Error state -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ error }}</p>
            <button @click="loadHospitals" class="mt-2 text-sm text-red-600 underline hover:text-red-500">
              Try again
            </button>
          </div>
        </div>
      </div>

      <div v-if="selectedHospital" class="mt-6 p-4 rounded-lg shadow-sm" style="background: var(--v-background-base); border: 1px solid var(--v-secondary-base);">
        <div class="flex flex-row items-center justify-between mb-2">
          <h4 class="text-lg font-semibold text-gray-900">{{ selectedHospital.name }}</h4>
          <span class="badge">{{ selectedHospital.type || 'Hospital' }}</span>
        </div>
        <p class="text-gray-700 mb-4">
          {{ displayAddress(selectedHospital) }}
        </p>
        <p v-if="selectedHospital.beds>=1" class="text-gray-700 mb-2">Total beds: <span class="font-medium ml-1" >{{ selectedHospital.beds }}</span></p>
        <div v-if="selectedHospital.serviceTypes" class="text-gray-700 mb-4">
          <div class="text-gray-800 font-medium mb-1">Service types: <span v-for="t in splitTypes(selectedHospital.serviceTypes)" :key="t" class="tag">{{ t }}</span>
        </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <a
            :href="googleMapsUrl(selectedHospital)"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md btn-primary"
          >
            Open in Google Maps
          </a>
          <a
            v-if="selectedHospital.website"
            :href="selectedHospital.website"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md btn-ghost"
          >
            Hospital website
          </a>
        </div>
      </div>
      <!-- Data Attribution -->
      <div class="text-xs text-gray-500 mt-6 p-2 bg-gray-50 rounded border">
        <div class="mb-1">
          <strong>Source:</strong> 
          <a href="https://catalogue.data.govt.nz/dataset/certified-health-care-providers" target="_blank" rel="noopener noreferrer" class="underline text-blue-600">
            NZ Government Open Data
          </a>
        </div>
        <div>
          <strong>License:</strong> 
          <a href="https://opendefinition.org/od/2.1/en/" target="_blank" rel="noopener noreferrer" class="underline text-blue-600">
            Open Definition 2.1
          </a>
          - Free to access, use, modify, and share
        </div>
      </div>
    </section>

    <!-- Support services link -->
    <section>
      <h3 class="text-xl font-semibold mb-3" style="color: var(--v-accent-base);">Support services</h3>
      <nuxt-link
        :to="{ path: '/support-specialist', query: { index: 3 } }"
        class="inline-flex items-center px-4 py-2 font-medium rounded-md support-link"
      >
        <v-icon size="20" class="mr-2" color="primary">mdi-link</v-icon>
        Link through to relevant NICU/SCBU support services
      </nuxt-link>
    </section>
    
    
  </div>
  
</template>

<script>
// Import clean API service
import hospitalApiService from '~/services/hospitalApi.js';

export default {
  layout: 'default',
  name: 'ComplicationsExtraCare',
  data() {
    return {
      hospitals: [],
      regions: [],
      selectedRegion: '',
      selectedHospitalName: '',
      selectedHospital: null,
      loading: false,
      error: null,
      selectedStoryIndex: null,
      patientStories: [
        {
          title: 'First Hours',
          color: 'var(--v-primary-base)',
          content: [
            'The first hours in SCBU were overwhelming. Our pēpi was so small, surrounded by machines and wires. The nurses were incredible - they explained everything and made sure we understood what was happening.',
            'We learned that skin-to-skin contact (kangaroo care) was possible even with all the equipment. That first cuddle meant everything to us.'
          ]
        },
        {
          title: 'Staying Connected',
          color: 'var(--v-accent-base)',
          content: [
            'We found ways to stay connected even when we couldn\'t be there 24/7. We recorded our voices reading stories, and the nurses played them for our pēpi.',
            'Taking photos and keeping a journal helped us track progress and celebrate small milestones. Every gram gained, every day breathing on their own - these were huge victories.'
          ]
        },
        {
          title: 'Staying Connected',
          color: 'var(--v-accent-base)',
          content: [
            'We found ways to stay connected even when we couldn\'t be there 24/7. We recorded our voices reading stories, and the nurses played them for our pēpi.',
            'Taking photos and keeping a journal helped us track progress and celebrate small milestones. Every gram gained, every day breathing on their own - these were huge victories.'
          ]
        },
        {
          title: 'Practical Tips',
          color: 'var(--v-info-base)',
          content: [
            'Bring comfortable clothes and snacks - you\'ll be spending a lot of time there. A small notebook helped us remember questions for doctors.',
            'Accept help from whānau and friends. Let them bring meals, do laundry, or just sit with you. You don\'t have to do this alone.',
            'The NICU nurses became our teachers. Don\'t hesitate to ask questions - they want you to feel confident caring for your pēpi.'
          ]
        },
        {
          title: 'Practical Tips',
          color: 'var(--v-primary-base)',
          content: [
            'Bring comfortable clothes and snacks - you\'ll be spending a lot of time there. A small notebook helped us remember questions for doctors.',
            'Accept help from whānau and friends. Let them bring meals, do laundry, or just sit with you. You don\'t have to do this alone.',
            'The NICU nurses became our teachers. Don\'t hesitate to ask questions - they want you to feel confident caring for your pēpi.'
          ]
        }
      ]
    };
  },
  mounted() {
    this.loadHospitals();
  },
  methods: {
    async loadHospitals() {
      this.loading = true;
      this.error = null;
      
      try {
        const allHospitals = await Promise.all([
          hospitalApiService.fetchAllRecords('publicHospitals'),
          hospitalApiService.fetchAllRecords('ngoHospitals'),
          hospitalApiService.fetchAllRecords('fertilityClinic')
        ]);

        // Flatten and combine all hospital data
        const combinedHospitals = allHospitals.flat();
        
        this.hospitals = combinedHospitals.sort((a, b) => a.name.localeCompare(b.name));
        this.regions = this.extractUniqueRegions(combinedHospitals);
        
      } catch (error) {
        console.error('Error loading hospitals:', error);
        this.error = 'Failed to load hospital data. Please try again later.';
      } finally {
        this.loading = false;
      }
    },

    /**
     * Extract unique regions from hospital data
     * @param {Array} hospitals - Hospital data array
     * @returns {Array} Sorted array of unique regions
     */
    extractUniqueRegions(hospitals) {
      const regions = hospitals
        .map(h => h.region)
        .filter(region => region && region.trim() !== '')
        .filter((region, index, self) => self.indexOf(region) === index);
      
      return regions.sort((a, b) => a.localeCompare(b));
    },

    onHospitalChange() {
      const source = this.filteredHospitals;
      this.selectedHospital = source.find(h => h.name === this.selectedHospitalName) || null;
    },

    onRegionChange() {
      if (this.selectedHospital && this.selectedRegion && this.selectedHospital.region !== this.selectedRegion) {
        this.selectedHospital = null;
        this.selectedHospitalName = '';
      }
    },

    displayAddress(h) {
      return [h.addr1, h.addr2, h.suburb, h.city, h.postcode].filter(Boolean).join(', ');
    },

    googleMapsUrl(h) {
      const q = encodeURIComponent(`${h.name}, ${this.displayAddress(h)}`);
      return `https://www.google.com/maps/search/?api=1&query=${q}`;
    },


    splitTypes(val) {
      if (!val) return [];
      return val.split(',').map(s => s.trim()).filter(Boolean);
    },
    getBubblePosition(index) {
      const positions = [
        { left: 5, top: 0 },
        { left: 45, top: 15 },
        { left: 80, top: 5 },
        { left: 25, top: 5 }
      ];
      return positions[index] || { left: 50, top: 0 };
    }
  },
  computed: {
    filteredHospitals() {
      if (!this.selectedRegion) return this.hospitals;
      return this.hospitals.filter(h => h.region === this.selectedRegion);
    },
    regionItems() {
      return [
        { text: 'All regions', value: '' },
        ...this.regions.map(r => ({ text: r, value: r }))
      ];
    },
    hospitalItems() {
      return this.filteredHospitals.map(h => ({
        text: h.name,
        value: h.name
      }));
    },
    selectedStory() {
      if (this.selectedStoryIndex === null || !this.patientStories[this.selectedStoryIndex]) {
        return { title: '', content: [] };
      }
      return this.patientStories[this.selectedStoryIndex];
    }
  }
};
</script>

<style lang="scss" scoped>
// Keep list styling clean and spacing consistent
.max-w-4xl {
  max-width: 56rem;
}

.shadow-sm:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease-in-out;
}

/* Themed select uses Vuetify CSS variables from nuxt.config.js */
.themed-select {
  border: 1px solid var(--v-secondary-base);
  background-color: var(--v-background-base);
  color: var(--v-text-base);
}
.themed-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--v-info-base);
}

/* Vuetify v-select theming */
.themed-vselect :deep(.v-input__control) {
  min-height: 40px;
}

.themed-vselect :deep(.v-input__slot) {
  border: 1px solid var(--v-secondary-base) !important;
  background-color: var(--v-background-base) !important;
  border-radius: 6px !important;
}

.themed-vselect :deep(.v-select__selection) {
  color: var(--v-primary-base) !important;
}

.themed-vselect :deep(.v-input__control:hover .v-input__slot) {
  border-color: var(--v-info-base) !important;
}

.themed-vselect :deep(.v-input--is-focused .v-input__slot) {
  border-color: var(--v-info-base) !important;
  box-shadow: 0 0 0 2px var(--v-info-base) !important;
}

/* Buttons with theme colors */
.btn-primary {
  background-color: var(--v-buttonMain-base);
  color: var(--v-buttonText-base);
}
.btn-primary:hover {
  background-color: var(--v-buttonMainHover-base);
  color: var(--v-buttonTextHover-base);
}
.btn-primary:active {
  background-color: var(--v-buttonMainActive-base);
  color: var(--v-buttonTextActive-base);
}

.btn-secondary {
  background-color: var(--v-accent-base);
  color: #fff;
}
.btn-secondary:hover {
  filter: brightness(0.95);
}
.btn-secondary:active {
  filter: brightness(0.9);
}

.btn-ghost {
  background-color: var(--v-primary-base);
  color: white;
  border: 1px solid var(--v-secondary-base);
}
.btn-ghost:hover {
  filter: brightness(0.95);
}
.btn-ghost:active {
  filter: brightness(0.9);
}

.support-link {
  background: var(--v-backgroundAlt-base);
  color: var(--v-accent-base);
  border: 1px solid var(--v-secondary-base);
}
.support-link:hover {
  background: var(--v-subSuccess-base);
}

.tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  background: var(--v-backgroundAlt-base);
  color: var(--v-primary-base);
  border: 1px solid var(--v-secondary-base);
}

.badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  background: var(--v-backgroundAlt-base);
  color: var(--v-accent-base);
  border: 1px solid var(--v-secondary-base);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.story-bubbles-container {
  min-height: 70px;
  width: 100%;
  position: relative;
}

.story-bubble {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.story-bubble::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 30%;
  width: 30%;
  height: 30%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0.8;
}

.story-bubble:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .story-bubbles-container {
    min-height: 200px;
  }
  
  .story-bubble {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    margin: 0.5rem;
  }
  
  .story-bubbles-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
