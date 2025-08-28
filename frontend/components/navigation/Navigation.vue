<template>
  <div class="navi">
    
    <v-bottom-navigation
      grow
      :fixed="$vuetify.breakpoint.smAndDown ? true : false"
      :color="activeColor"
      v-model="currentMenuCaption"
      :background-color="$vuetify.theme.themes.light.background"
    >
    <!-- :class="mdAndUp? 'button-default button-main-topic' : 'button-default button-main-topic-mobile'" -->
      <v-btn
        v-for="(topic, index) in topics"
        class="button-default button-main-topic"
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
        <span>{{ topic.title }}</span>
        <SvgIcon 
          v-if="topic.icon && topic.icon.startsWith('/')" 
          :icon="topic.icon" 
        />
        <v-icon v-else>{{ topic.icon }}</v-icon>
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
    font-size: 0.6rem !important;
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
  
  .v-icon {
    color: var(--button-text-color) !important;
  }
  
  span {
    color: var(--button-text-color) !important;
    font-weight: inherit;
  }
}
</style>
