<template>
  <div :class="mdAndUp ? 'aboutPanel-l' : 'aboutPanel-s'">
   
    <!-- right: service details and resources -->
    <div >
      <div class="services-content">
        <!-- Section 5.a - For Everyone Pregnant -->
        <div class="service-section">
          <div class="section-header" @click="toggleSection('general')">
            <v-icon left color="success">mdi-account-group</v-icon>
            <h3>For Everyone Pregnant</h3>
            <v-icon class="expand-icon" :class="{ 'rotated': sections.general }">
              mdi-chevron-down
            </v-icon>
          </div>
          <v-expand-transition>
            <div v-show="sections.general" class="section-content">
              <div class="service-item">
                <h4>
                  <v-icon left small color="primary">mdi-compass-outline</v-icon>
                  General Pregnancy Navigation Services
                </h4>
                <p>Services that help you navigate pregnancy and connect with appropriate care:</p>
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
                        <li v-for="service in getRegionalServices(selectedRegion)" :key="service">
                          {{ service }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-expand-transition>
        </div>
        <!-- Section - Specialist Support Services -->
        <div class="service-section">
          <div class="section-header" @click="toggleSection('specialist')">
            <v-icon left color="warning">mdi-medical-bag</v-icon>
            <h3>Specialist Support Services</h3>
            <v-icon class="expand-icon" :class="{ 'rotated': sections.specialist }">
              mdi-chevron-down
            </v-icon>
          </div>
          <v-expand-transition>
            <div v-show="sections.specialist" class="section-content">
              <!-- Mental Health Support -->
              <div class="service-item">
                <h4>
                  <v-icon left small color="accent">mdi-brain</v-icon>
                  Mental Health Support Services
                </h4>
                <p>Specialized mental health support during pregnancy:</p>
                <ul class="service-list">
                  <li>Perinatal mental health services</li>
                  <li>Counselling and therapy services</li>
                  <li>Support groups for pregnant mothers</li>
                  <li>Crisis intervention services</li>
                  <li>Postnatal depression and anxiety support</li>
                </ul>
              </div>
              <!-- Pregnancy Complications Support -->
              <div class="service-item">
                <h4>
                  <v-icon left small color="info">mdi-alert-circle-outline</v-icon>
                  Pregnancy Complications Support
                </h4>
                <p>Support for various pregnancy complications and concerns:</p>
                <ul class="service-list">
                  <li>High-risk pregnancy management</li>
                  <li>Fetal growth restriction support</li>
                  <li>Multiple pregnancy (twins/triplets) services</li>
                  <li>Pregnancy loss and bereavement support</li>
                  <li>Genetic counselling services</li>
                  <li>Maternal medical conditions support</li>
                </ul>
              </div>
              <!-- Premature Birth Support -->
              <div class="service-item">
                <h4>
                  <v-icon left small color="error">mdi-baby-face-outline</v-icon>
                  Premature Birth Support
                </h4>
                <p>Specialized care and support for premature birth:</p>
                <ul class="service-list">
                  <li>Prevention and management of preterm labour</li>
                  <li>Antenatal steroid administration</li>
                  <li>Premature baby care education</li>
                  <li>Family support during NICU stay</li>
                  <li>Post-discharge follow-up care</li>
                  <li>Developmental support services</li>
                </ul>
              </div>
              <!-- NICU/SCBU Services -->
              <div class="service-item">
                <h4>
                  <v-icon left small color="secondary">mdi-hospital-building</v-icon>
                  NICU / SCBU Services
                </h4>
                <p>Neonatal Intensive Care Unit and Special Care Baby Unit services:</p>
                <ul class="service-list">
                  <li>Level 1, 2, and 3 neonatal intensive care</li>
                  <li>Specialized medical equipment and monitoring</li>
                  <li>Respiratory support and ventilation</li>
                  <li>Nutritional support and feeding assistance</li>
                  <li>Family-centered care programs</li>
                  <li>Transition to home support</li>
                  <li>Long-term developmental follow-up</li>
                </ul>
              </div>
            </div>
          </v-expand-transition>
        </div>
        <!-- Additional Resources Section -->
        <div class="service-section">
          <div class="section-header" @click="toggleSection('resources')">
            <v-icon left color="accent">mdi-book-open-variant</v-icon>
            <h3>Additional Resources & Contacts</h3>
            <v-icon class="expand-icon" :class="{ 'rotated': sections.resources }">
              mdi-chevron-down
            </v-icon>
          </div>
          <v-expand-transition>
            <div v-show="sections.resources" class="section-content">
              <div class="resource-cards">
                <v-card class="resource-card" elevation="2">
                  <v-card-title class="pb-2">
                    <v-icon left color="primary">mdi-phone</v-icon>
                    Emergency Contacts
                  </v-card-title>
                  <v-card-subtitle>24/7 support services</v-card-subtitle>
                  <v-card-text>
                    <p><strong>Emergency:</strong> 111</p>
                    <p><strong>Healthline:</strong> 0800 611 116</p>
                    <p><strong>Pregnancy support:</strong> Contact your LMC</p>
                  </v-card-text>
                </v-card>
                <v-card class="resource-card" elevation="2">
                  <v-card-title class="pb-2">
                    <v-icon left color="success">mdi-web</v-icon>
                    Online Resources
                  </v-card-title>
                  <v-card-subtitle>Helpful websites and tools</v-card-subtitle>
                  <v-card-text>
                    <p><strong>Ministry of Health:</strong> health.govt.nz</p>
                    <p><strong>Plunket:</strong> plunket.org.nz</p>
                    <p><strong>PMMRC:</strong> pmmrc.health.govt.nz</p>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-expand-transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { regions, regionalServices, serviceSections } from './aboutData';

export default {
  layout: "default",
  name: "AboutPage",

  data() {
    return {
      sections: {
        general: true,
        specialist: false,
        resources: false
      },
      selectedRegion: '',
      regions,
      regionalServices,
      serviceSections
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
      return this.regionalServices[region] || [
        'Local District Health Board Maternity Services',
        'Community Midwifery Services',
        'Local Birthing Units',
        'Regional Support Groups'
      ];
    },
    handleScrollToSection(sectionId) {
      if (this.sections.hasOwnProperty(sectionId)) {
        this.sections[sectionId] = true;
      }
      this.$nextTick(() => {
        setTimeout(() => {
          const sectionMap = {
            'general': 1,
            'specialist': 2,
            'resources': 3
          };
          const sectionIndex = sectionMap[sectionId];
          const element = document.querySelector(`.service-section:nth-child(${sectionIndex})`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      });
    }
  },

  created() {
    this.$store.commit("setChartLoaded", "");
    this.$nuxt.$on('scroll-to-section', this.handleScrollToSection);
  },
  beforeDestroy() {
    this.$nuxt.$off('scroll-to-section');
  }
};
</script>

<style lang="scss" scoped src="@/assets/sass/pages/about.scss"></style>
