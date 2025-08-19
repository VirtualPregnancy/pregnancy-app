<template>
  <div>
    <!-- Menu Icon -->
    <v-icon 
      size="28" 
      color="#333" 
      @click="toggleMenu"
      class="transition-transform duration-300 hover:scale-110 cursor-pointer"
    >
      mdi-menu
    </v-icon>
    <!-- Menu Popup -->
    <div 
      v-if="showMenu" 
      class="menu-popup"
      @click.stop
    >
      <!-- Menu Content -->
      <div class="menu-content">
        <!-- Header -->
        <div class="menu-header">
          <span class="text-h6">Pregnancy App Menu</span>
          <v-btn icon small @click="closeMenu" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <!-- Menu Items -->
        <div class="menu-items border-b border-gray-200">
          <!-- Main Topics -->
          <div v-for="(topic, topicKey) in menuData" :key="topicKey" class="topic-section mb-1 ">
            <!-- Main Topic -->
            <v-btn
              block
              text
              small
              class="menu-main-item justify-start"
              :class="{ 'topic-expanded': expandedTopic === topicKey }"
              @click="toggleTopic(topicKey, topic)"
            >
              <span class="flex-1 text-left">{{ topic.title }}</span>
              <v-icon class="chevron-icon" :class="{ 'rotated': expandedTopic === topicKey }" size="16">
                mdi-chevron-down
              </v-icon>
            </v-btn>

            <!-- Subtopics -->
            <v-expand-transition>
              <div v-show="expandedTopic === topicKey" class="subtopics-container ml-3 mt-1">
                <v-btn
                  v-for="(subtopic, subKey) in topic.subTopics"
                  :key="subKey"
                  block
                  text
                  x-small
                  class="menu-sub-item justify-start mb-1"
                  @click="navigateToPage(topicKey, subKey)"
                >
                  <span class="text-left text-caption">{{ subtopic.title }}</span>
                </v-btn>
              </div>
            </v-expand-transition>
          </div>

          <!-- About -->
          <div class="menu-item">
            <v-btn
              block
              text
              small
              class="menu-main-item justify-start"
              @click="navigateToAbout"
            >
              <span class="text-left">About Us</span>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      showMenu: false,
      expandedTopic: null,
      menuData: {}
    }
  },

  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
      if (this.showMenu) {
        this.loadMenuData();
      }
    },

    closeMenu() {
      this.showMenu = false;
      this.expandedTopic = null;
    },

    loadMenuData() {
      try {
        this.menuData = this.$getTopics() || {};
      } catch (error) {
        console.warn('Could not load topics data:', error);
        // Fallback static data
        this.menuData = {
          'ultrasound': {
            title: 'Ultrasound',
            subTopics: {
              'what-is-ultrasound': { title: 'What is Ultrasound' },
              'how': { title: 'How Ultrasound Works' },
              'waveforms': { title: 'Waveforms' }
            }
          },
          'pregnancy': {
            title: 'Pregnancy',
            subTopics: {
              'changes': { title: 'Pregnancy Changes' },
              'fetal-dev': { title: 'Fetal Development' },
              'placenta': { title: 'Placenta Role' },
              'baby': { title: 'Baby Health' }
            }
          },
          'clinical': {
            title: 'Clinical Care',
            subTopics: {
              'mid-wife': { title: 'Midwife Care' },
              'when-care-changes': { title: 'When Care Changes' }
            }
          },
          'conditions': {
            title: 'Conditions',
            subTopics: {
              'fetal': { title: 'Fetal Conditions' },
              'birth': { title: 'Birth Conditions' },
              'care': { title: 'Care Conditions' }
            }
          }
        };
      }
    },

    toggleTopic(topicKey, topic) {
      // If topic has only one subtopic, navigate directly
      if (topic.subTopics && Object.keys(topic.subTopics).length === 1) {
        const subKey = Object.keys(topic.subTopics)[0];
        this.navigateToPage(topicKey, subKey);
        return;
      }

      // Toggle expansion - only one topic can be expanded at a time
      this.expandedTopic = this.expandedTopic === topicKey ? null : topicKey;
    },

    navigateToSupport() {
      this.$router.push('/support');
      this.closeMenu();
    },

    navigateToAbout() {
      this.$router.push('/about');
      this.closeMenu();
    },



    navigateToPage(topicKey, subKey) {
      const slug = `${topicKey}-${subKey}`;
      this.$router.push(`/${slug}`);
      this.closeMenu();
    }
  }
}
</script>

<style scoped>
.menu-icon {
  transition: transform 0.3s ease;
}

.menu-icon:hover {
  transform: scale(1.1);
}

.menu-popup {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  margin-top: 8px;
}

.menu-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  max-width: 300px;
  animation: slideDown 0.2s ease;
  overflow: hidden;
}

.menu-header {
  background: var(--v-success-base);
  color:white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
}

.close-btn {
  color: white !important;
}

.menu-items {
  padding: 8px;
  max-height: 500px;
  overflow-y: auto;
}

.menu-main-item {
  border-radius: 6px;
  margin-bottom: 2px;
  transition: all 0.2s ease;
  color: #333 !important;
  min-height: 36px;
}

.menu-main-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.topic-expanded {
  background-color: rgba(25, 118, 210, 0.08);
  border-left: 3px solid var(--v-accent-base);
}

.menu-sub-item {
  border-radius: 4px;
  margin-left: 8px;
  transition: all 0.2s ease;
  color: #666 !important;
  min-height: 28px;
}

.menu-sub-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.chevron-icon {
  transition: transform 0.2s ease;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.subtopics-container {
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 8px;
}

@keyframes slideDown {
  from { 
    opacity: 0;
    transform: translateY(-10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .menu-content {
    min-width: 200px;
    max-width: 250px;
  }
}
</style>