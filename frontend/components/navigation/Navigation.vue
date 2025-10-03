<template>
  <div class="navi">
    
    <v-bottom-navigation
      grow
      :fixed="shouldFixBottom"
      :color="activeColor"
      v-model="currentMenuCaption"
      :background-color="$vuetify.theme.themes.light.background"
    >
      <v-btn
        v-for="(topic, index) in topics"
        :class="[
          'button-default',
          isMobile ? 'button-main-topic-mobile' : 'button-main-topic',
          { 'active-tab': currentMenuCaption === index }
        ]"
        :key="index"
        :value="index"
        :disabled="$isTopicDisabled(topic)"
        :to="{
          name: 'slug',
          params: { slug: index + '-' + getDefaultSlug(topic) },
        }"
        @click="handTopicClick(topic)"
        :style="buttonStyles"
      >
        <!-- Mobile: Dynamic icon size and text display -->
        <template v-if="isMobile">
          <div class="mobile-tab-content">
            <SvgIcon 
              v-if="topic.icon && topic.icon.startsWith('/')" 
              :icon="topic.icon" 
              :class="[
                'mobile-icon',
                { 
                  'icon-active': currentMenuCaption === index,
                  'icon-inactive': currentMenuCaption !== index
                }
              ]"
            />
            <v-icon 
              v-else 
              :class="[
                'mobile-icon',
                { 
                  'icon-active': currentMenuCaption === index,
                  'icon-inactive': currentMenuCaption !== index
                }
              ]"
            >
              {{ topic.icon }}
            </v-icon>
            <span 
              v-if="currentMenuCaption === index" 
              class="mobile-text-expanded"
              :title="topic.title"
            >
              {{ topic.title }}
            </span>
          </div>
        </template>
        
        <!-- Desktop: Show both text and icon -->
        <template v-else>
          <span>{{ topic.title }}</span>
          <SvgIcon 
            v-if="topic.icon && topic.icon.startsWith('/')" 
            :icon="topic.icon" 
          />
          <v-icon v-else>{{ topic.icon }}</v-icon>
        </template>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon.vue';

export default {
  components: { SvgIcon },
  data: () => {
    return {
      selectedTopic: {},
      topics: {},
      subMenuActive: false,
      currentMenuCaption: "",
      mdAndUp: false,
    };
  },
  methods: {
    updateSupport: function () {
      this.subMenuActive = false;
    },
    getDefaultSlug(topic) {
      return topic.subTopics != null ? Object.keys(topic.subTopics)[0] : "";
    },
    handTopicClick(topic) {
      this.selectedTopic = topic;
      
      // Only show sub-menu if topic has more than one sub-topic and it's not "Home"
      if (topic.title !== "Home" && topic.subTopics) {
        const subTopicsCount = Object.keys(topic.subTopics).length;
        this.subMenuActive = subTopicsCount > 1;
      } else {
        this.subMenuActive = false;
      }
    },
  },

  computed: {
    isMobile() {
      // Detect mobile devices (phones and small tablets)
      try {
        const bp = this.$vuetify && this.$vuetify.breakpoint ? this.$vuetify.breakpoint : {};
        return !!bp.smAndDown;
      } catch (e) {
        return true; // Safe fallback
      }
    },
    shouldFixBottom() {
      // Fix bottom nav on phones (smAndDown) and iPad (md with touch)
      try {
        const bp = this.$vuetify && this.$vuetify.breakpoint ? this.$vuetify.breakpoint : {};
        const isPhone = !!bp.smAndDown;
        // Detect iPad (including iPadOS 13+ which reports as Mac)
        const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
        const isOldIPad = /iPad/.test(ua);
        const isNewIPad = typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
        const isTouch = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        const isIPad = (isOldIPad || isNewIPad) && isTouch;
        return isPhone || (isIPad && !!bp.md);
      } catch (e) {
        // Safe fallback for any env errors
        return this.$vuetify.breakpoint ? this.$vuetify.breakpoint.smAndDown : true;
      }
    },
    activeColor() {
      return this.$route.name === "support"
        ? this.$vuetify.theme.themes.light.secondary
        : this.$subTitle();
    },
    menuCaption() {
      return this.$route.name === "slug" ? this.$parentTopic().slug : "support";
    },
    buttonStyles() {
      return {
        '--button-main-color': this.$vuetify.theme.themes.light.buttonMain,
        '--button-text-color': this.$vuetify.theme.themes.light.buttonText,
        '--button-main-hover-color': this.$vuetify.theme.themes.light.buttonMainHover,
        '--button-main-active-color': this.$vuetify.theme.themes.light.buttonMainActive,
        '--button-text-active-color': this.$vuetify.theme.themes.light.buttonTextActive,
        '--secondary-color': this.$vuetify.theme.themes.light.secondary,
      };
    },
  },

  watch: {
    selectedTopic: function (currentTopic) {
      // Hide sub-tabs if there's only one or no sub-topics
      if (currentTopic && currentTopic.subTopics) {
        const subTopicsCount = Object.keys(currentTopic.subTopics).length;
        this.subMenuActive = subTopicsCount > 1;
      } else {
        this.subMenuActive = false;
      }
    },
    subMenuActive: function (isActive) {
      $nuxt.$emit("menu-height-changed", isActive ? "2" : "1");
    },
  },

  created() {
    this.mdAndUp = this.$vuetify.breakpoint.mdAndUp;
    this.topics = this.$getTopics();
    if (this.$route.name === "slug") {
      const parentSlug = this.$parentTopic().slug.toLowerCase();
      this.selectedTopic = this.topics[parentSlug];
      this.currentMenuCaption = this.$parentTopic().slug;
      
      // Set initial sub-menu state based on the selected topic
      if (this.selectedTopic && this.selectedTopic.subTopics) {
        const subTopicsCount = Object.keys(this.selectedTopic.subTopics).length;
        this.subMenuActive = subTopicsCount > 1;
      } else {
        this.subMenuActive = false;
      }
    } else {
      this.currentMenuCaption = "support";
    }
  },
};
</script>

<style scoped lang="scss">
.navi {
  position: relative;
  width: 100%;
  z-index: 1000;
  // Respect safe area on iOS devices with home indicator
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}


.sub-menu {
  position: fixed;
  bottom: 8dvh;
  width: 100%;
}

.v-btn.button-default {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  
  transition: all 0.3s ease;
  font-weight: 400 !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  word-wrap: wrap;
  
  &.button-main-topic {
    height: auto !important;
    min-height: 56px !important;
    font-size: 0.8rem !important;
    display: flex !important;
    flex-direction: column !important;
    border-left: 2px solid var(--secondary-color);
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    background: var(--button-main-color);
    color: var(--button-text-color);
    
    &:hover {
      background: var(--button-main-hover-color) !important;
      transform: translateY(-2px);  
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      color: var(--button-text-color);
    }
    
    &.v-btn--active {
      background: var(--button-main-active-color) !important;
      font-weight: 700 !important;
      color: var(--button-text-active-color) !important;
    }
  }
  &.button-main-topic-mobile{
    height: auto !important;
    min-height: 56px !important;
    font-size: 0.7rem !important;
    display: flex !important;
    flex-direction: column !important;
    border-left: 2px solid var(--secondary-color);
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    background: var(--button-main-color);
    color: var(--button-text-color);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    padding: 8px 4px !important;
    
    // More balanced width for inactive buttons
    min-width: 60px !important;
    flex: 1;
    
    &:hover {
      background: var(--button-main-hover-color) !important;
      transform: translateY(-2px);  
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      color: var(--button-text-color);
    }
    
    &.v-btn--active, &.active-tab {
      background: var(--button-main-active-color) !important;
      font-weight: 700 !important;
      color: var(--button-text-active-color) !important;
      flex: 2.5;
      min-width: 120px !important;
      padding: 8px 16px !important;
    }
    
    .mobile-tab-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .mobile-icon {
      transition: all 0.3s ease;
      color: var(--button-text-color) !important;
      
      &.icon-inactive {
        font-size: 20px !important;
        opacity: 0.8;
      }
      
      &.icon-active {
        font-size: 18px !important;
        transform: translateY(-2px);
        opacity: 1;
        color: var(--button-text-active-color) !important;
      }
    }
    
    .mobile-text-expanded {
      font-size: 0.75rem !important;
      font-weight: 600;
      margin-top: 2px;
      opacity: 0;
      transform: translateY(10px);
      animation: slideInText 0.3s ease-out forwards;
      animation-delay: 0.1s;
      color: var(--button-text-active-color) !important;
      line-height: 1.2;
      text-align: center;
    }
  }
  
  .v-icon {
    color: var(--button-text-color) !important;
  }
  
  span {
    color: var(--button-text-color) !important;
    font-weight: inherit;
  }
}

// Simple slide-in animation for mobile text
@keyframes slideInText {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
