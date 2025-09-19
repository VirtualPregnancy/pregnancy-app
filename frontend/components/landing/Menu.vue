<template>
  <div>
    <!-- Menu Icon -->
    <v-icon
      size="28"
      color="primary"
      @click="toggleMenu"
      class="transition-transform duration-300 hover:scale-110 cursor-pointer"
    >
      mdi-menu
    </v-icon>

    <!-- Fullscreen Floating Menu -->
    <div v-if="showMenu" class="fixed inset-0 z-50" @click="closeMenu">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-20"></div>

      <!-- Panel anchored to top-left, expands to the right -->
      <div
        class="absolute top-4 left-4 md:top-6 md:left-6 w-[92vw] sm:w-[70vw] md:w-[420px] max-w-[92vw]"
        @click.stop
      >
        <div class="bg-white rounded-lg shadow-xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 text-white" :style="{ background: 'var(--v-success-base)' }">
            <span class="text-base md:text-lg font-semibold">Pregnancy App Menu</span>
            <v-btn icon small @click="closeMenu" class="!text-white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Back to Landing Page (optional) -->
          <div v-if="showBackToLanding && !isOnLanding" class="px-2 pt-2">
            <v-btn
              block
              text
              small
              class="justify-start rounded-md"
              @click="goLanding"
            >
              <v-icon left small>mdi-home</v-icon>
              <span>Back to Landing Page</span>
            </v-btn>
          </div>

          <!-- Menu Items -->
          <div class="px-2 pb-2 max-h-[70vh] overflow-y-auto">
            <div
              v-for="(topic, topicKey) in menuData"
              :key="topicKey"
              class="mb-1"
            >
              <!-- Main Topic -->
              <v-btn
                block
                text
                small
                class="justify-start rounded-md"
                :class="[
                  expandedTopic === topicKey ? 'bg-blue-50 border-l-2 border-blue-400' : '',
                  activeTopicClass(topicKey) ? 'bg-blue-100' : ''
                ]"
                @click="toggleTopic(topicKey, topic)"
              >
                <span class="text-left break-words whitespace-normal leading-tight pr-2 w-[70vw] sm:w-[60vw] md:w-[340px]">{{ topic.heading }}</span>
                <v-icon :class="expandedTopic === topicKey ? 'transform rotate-180 transition-transform' : 'transition-transform'" size="16">
                  mdi-chevron-down
                </v-icon>
              </v-btn>

              <!-- Subtopics -->
              <v-expand-transition>
                <div v-show="expandedTopic === topicKey" :class="expandedTopic === topicKey ? 'bg-blue-50 ml-3 pt-1 border-l border-gray-200 pl-2' : 'ml-3 mt-1 border-l border-gray-200 pl-2'">
                  <v-btn
                    v-for="(subtopic, subKey) in topic.subTopics"
                    :key="subKey"
                    block
                    text
                    x-small
                    class="justify-start rounded-md mb-1"
                    
                    :class="isActiveSub(topicKey, subKey) ? 'bg-blue-200 font-bold text-blue-700' : ''"
                    @click="navigateToPage(topicKey, subKey)"
                  >
                    <span class="border-b border-gray-200 text-left text-caption break-words whitespace-normal leading-tight w-[66vw] sm:w-[56vw] md:w-[300px] block">{{ subtopic.heading }}</span>
                  </v-btn>
                </div>
              </v-expand-transition>
            </div>

            <!-- About -->
            <div class="mt-1">
              <v-btn
                block
                text
                small
                class="justify-start rounded-md"
                @click="navigateToAbout"
              >
                <span class="text-left">About Us</span>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    showBackToLanding: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showMenu: false,
      expandedTopic: null,
      menuData: {}
    }
  },
  computed: {
    // Parse current topic/sub from slug route like `topic-sub`
    currentTopicKey() {
      const slug = this.$route && this.$route.params && this.$route.params.slug;
      if (!slug) return '';
      const [topic] = slug.split('-');
      return (topic || '').toLowerCase();
    },
    currentSubKey() {
      const slug = this.$route && this.$route.params && this.$route.params.slug;
      if (!slug) return '';
      const parts = slug.split('-');
      return parts.slice(1).join('-');
    },
    isOnLanding() {
      return this.$route && (this.$route.path === '/' || this.$route.name === 'index');
    }
  },

  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
      if (this.showMenu) {
        this.loadMenuData();
        // Expand current topic by default
        this.expandedTopic = this.currentTopicKey;
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
    },

    goLanding() {
      this.$router.push('/');
      this.closeMenu();
    },

    activeTopicClass(topicKey) {
      return this.currentTopicKey === topicKey ? 'active-topic' : '';
    },

    isActiveSub(topicKey, subKey) {
      return this.currentTopicKey === topicKey && this.currentSubKey === subKey;
    }
  }
}
</script>

<style scoped>
/* Minimal: most styling via Tailwind utility classes */
</style>
