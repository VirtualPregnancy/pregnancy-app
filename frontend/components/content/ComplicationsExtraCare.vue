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
          Neonatal care units support pēpi who need extra help after birth. Special Care Baby Units (SCBU) and
          Neonatal Intensive Care Units (NICU) provide monitoring, breathing support, feeding assistance and specialist
          care depending on what your baby needs.
        </p>
        <p>
          Babies may be admitted for many reasons — being born preterm, low birthweight, breathing difficulties,
          infections, jaundice, or after a complicated birth. The teams include doctors, nurses, lactation consultants
          and allied health professionals working alongside you and your LMC.
        </p>
      </div>
    </section>

    <!-- Patient stories -->
    <section class="mb-10">
      <h3 class="text-xl font-semibold mb-3" style="color: var(--v-accent-base);">Patient stories</h3>
      <div class="text-gray-700 leading-relaxed">
        <p>
          Every whānau’s experience is unique. We’re curating short stories that explain what the first hours and days
          can feel like in SCBU/NICU, how families stayed connected with their pēpi, and practical tips that helped.
        </p>
      </div>
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
            outlined
            dense
            hide-details
            placeholder="Select..."
            class="themed-vselect"
            style="--v-theme-overlay-multiplier: 1;"
          ></v-select>
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
      <!-- Disclaimer -->
    <div class="text-xs text-gray-500 mt-6">
      Data collected from <a href="https://catalogue.data.govt.nz/dataset/certified-health-care-providers" target="_blank" rel="noopener noreferrer" class="underline ml-1">catalogue.data.govt.nz</a>. It may not always be up to date.
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
// Load CSVs as raw text via webpack raw-loader
import publicHospitalCsv from 'raw-loader!~/assets/data/hospital/LegalEntitySummaryPublicHospital.csv';
import ngoHospitalCsv from 'raw-loader!~/assets/data/hospital/LegalEntitySummaryNGOHospital.csv';
import fertilityCsv from 'raw-loader!~/assets/data/hospital/LegalEntitySummaryFertility.csv';

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
    };
  },
  mounted() {
    this.loadHospitals();
  },
  methods: {
    loadHospitals() {
      const all = [];
      const addFromCsv = (csvText) => {
        const rows = this.parseCsv(csvText).filter(r => r.length > 0);
        if (!rows.length) return;
        const header = rows[0];
        const nameIdx = header.findIndex(h => /Premises Name/i.test(h));
        const addr1Idx = header.findIndex(h => /Premises Address Other/i.test(h));
        const addr2Idx = header.findIndex(h => /Premises Address(?!.*Other)/i.test(h));
        const suburbIdx = header.findIndex(h => /Premises Address Suburb/i.test(h));
        const cityIdx = header.findIndex(h => /Premises Address Town|City/i.test(h));
        const postIdx = header.findIndex(h => /Premises Address Post Code/i.test(h));
        const websiteIdx = header.findIndex(h => /Premises Website/i.test(h));
        const typeIdx = header.findIndex(h => /Certification Service Type/i.test(h));
        const svcTypesIdx = header.findIndex(h => /Service Types/i.test(h));
        const bedsIdx = header.findIndex(h => /Total Beds/i.test(h));

        rows.slice(1).forEach((cols, i) => {
          const name = (cols[nameIdx] || '').trim();
          if (!name) return;
          const item = {
            id: `${name}-${i}-${all.length}`,
            name,
            addr1: (cols[addr1Idx] || '').trim(),
            addr2: (cols[addr2Idx] || '').trim(),
            suburb: (cols[suburbIdx] || '').trim(),
            city: (cols[cityIdx] || '').trim(),
            postcode: (cols[postIdx] || '').trim(),
            website: (cols[websiteIdx] || '').trim(),
            type: (cols[typeIdx] || '').trim(),
            serviceTypes: (cols[svcTypesIdx] || '').trim(),
            beds: (cols[bedsIdx] || '').trim(),
            region: (cols[cityIdx] || '').trim(),
          };
          all.push(item);
        });
      };

      addFromCsv(publicHospitalCsv);
      addFromCsv(ngoHospitalCsv);
      addFromCsv(fertilityCsv);

      this.hospitals = all.sort((a, b) => a.name.localeCompare(b.name));
      this.regions = Array.from(new Set(all.map(h => h.region).filter(Boolean))).sort((a, b) => a.localeCompare(b));
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

    // Minimal CSV parser handling quoted fields and commas inside quotes
    parseCsv(text) {
      const rows = [];
      let row = [];
      let cur = '';
      let inQuotes = false;
      let i = 0;
      while (i < text.length) {
        const ch = text[i];
        if (inQuotes) {
          if (ch === '"') {
            if (i + 1 < text.length && text[i + 1] === '"') {
              cur += '"';
              i += 2;
              continue;
            } else {
              inQuotes = false;
              i++;
              continue;
            }
          } else {
            cur += ch;
            i++;
            continue;
          }
        } else {
          if (ch === '"') {
            inQuotes = true;
            i++;
            continue;
          }
          if (ch === ',') {
            row.push(cur);
            cur = '';
            i++;
            continue;
          }
          if (ch === '\n' || ch === '\r') {
            // finalize row on newline
            if (cur.length || row.length) {
              row.push(cur);
              rows.push(row);
              row = [];
              cur = '';
            }
            // skip \r\n combinations
            if (ch === '\r' && i + 1 < text.length && text[i + 1] === '\n') {
              i += 2;
            } else {
              i++;
            }
            continue;
          }
          cur += ch;
          i++;
        }
      }
      if (cur.length || row.length) {
        row.push(cur);
        rows.push(row);
      }
      // Trim header/footers that may include empty lines
      return rows.map(r => r.map(c => (c || '').trim()));
    },
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
</style>
