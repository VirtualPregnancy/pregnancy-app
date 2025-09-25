<template>
  <v-app ref="base_background" class="root" style="background-color: var(--v-backgroundAlt-base);">
    <!-- Global floating controls (top-left, above all pages) -->
    <div class="fixed top-2 left-2 z-50">
      <template v-if="mdAndUp">
        <!-- Desktop screens: show Home only -->
        <v-btn fab small color="primary" :to="{ path: '/' }" title="Home">
          <v-icon >mdi-home</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <!-- Mobile/Tablet: show Menu -->
        <Menu :show-back-to-landing="true" />
      </template>
    </div>
    <!-- Main Container: Upper and Lower sections -->
    <div class="main-container">
      
      <!-- Upper Section: LeftPane + ContentPane -->
      <div class="upper-section">
        
        <!-- Left Panel -->
        <div class="left-panel" ref="leftPanel">
          <v-card
            outlined
            tile
            class="pa-0 overflow-y-auto h-full"
            :class="mdAndUp ? 'panel-height' + multiplier : ''"
          >
            <left-pane 
              :panel-height="panelHeight"
              @conditions-updated="handleConditionsUpdate"
            />
          </v-card>
        </div>
        
        <!-- Content Panel -->
        <div class="content-panel">
          <Nuxt />
        </div>
        
      </div>
      
      <!-- Lower Section: Navigation -->
      <div class="lower-section">
        <navigation />
      </div>
      
    </div>

    <!-- Global Loading Overlay to block interactions until ready -->
    <LoadingOverlay :visible="isAppLoading" />
  </v-app>
</template>

<script>
import Navigation from '@/components/navigation/Navigation.vue';
import Menu from '@/components/landing/Menu.vue';
import LoadingOverlay from '@/components/common/LoadingOverlay.vue';

export default {
  name: "DefaultLayout",
  components: {
    Navigation,
    Menu,
    LoadingOverlay
  },

  data: () => {
    return {
      multiplier: 1,
      panelHeight: 0,
      isAppLoading: false,

    };
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },

  mounted() {
    const base_background = this.$refs.base_background.$el;
    const Copper = this.$Copper();

    // Set initial panel height (flexbox handles actual sizing)
    this.panelHeight = window.innerHeight - 56; // viewport height minus nav height

    // Store references for cleanup
    this.handleResize = () => {
      this.panelHeight = window.innerHeight - 56;
    };

    this.handleFullscreen = () => {
      setTimeout(() => {
        this.panelHeight = window.innerHeight - 56;
      }, 200);
    };

    this.handleKeydown = (e) => {
      if (e.code === "KeyF") {
        Copper.fullScreenListenner(base_background);
      }
    };

    // Handle route changes to scroll to top
    this.handleRouteChange = () => {
      this.$nextTick(() => {
        this.scrollToTop();
        
        // Additional mobile scroll fix with delay
        if (!this.mdAndUp) {
          setTimeout(() => this.scrollToTop(), 100);
        }
      });
    };

    document.addEventListener("fullscreenchange", this.handleFullscreen);
    document.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("resize", this.handleResize);

    // Listen to route changes
    this.$router.afterEach(this.handleRouteChange);

    // Listen to global loading state emitted from RightPane/Model
    this.$nuxt.$on('global-loading', this.handleGlobalLoading);
  },

  updated() {
    // Panel height is now managed by CSS flexbox
  },

  created() {
    this.$nuxt.$on("menu-height-changed", (multiplier) => {
      this.multiplier = multiplier;
    });
  },

  methods: {
    // Scroll to top helper method
    scrollToTop() {
      const targetContainer = !this.mdAndUp 
        ? document.querySelector('.upper-section')
        : document.querySelector('.content-panel');
      
      if (targetContainer) {
        targetContainer.scrollTop = 0;
        targetContainer.scrollTo(0, 0);
      }
      
      // Fallback to window scroll
      window.scrollTo(0, 0);
    },
    
    // Handle pregnancy condition updates from the tool
    handleConditionsUpdate(data) {
      // Emit global event for RightPane and other components to listen
      this.$nuxt.$emit('conditions-updated', data);
      
      // Store condition data for potential future use
      this.lastConditionData = data;
    },
    
    // Toggle global loading overlay state
    handleGlobalLoading(isLoading) {
      this.isAppLoading = !!isLoading;
    }
  },

  beforeDestroy() {
    this.$nuxt.$off("menu-height-changed");
    
    // Clean up event listeners
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("fullscreenchange", this.handleFullscreen);
    document.removeEventListener("keydown", this.handleKeydown);

    // Remove route change listener
    if (this.handleRouteChange) {
      this.$router.afterEach(this.handleRouteChange);
    }

    // Remove global loading listener
    this.$nuxt.$off('global-loading', this.handleGlobalLoading);
  },
};
</script>

<style scoped lang="scss">
.root {
  overflow-y: hidden;
  user-select: none;
}

// Main container: full height with flex layout
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

// Upper section: takes remaining space, horizontal split on desktop, vertical on mobile
.upper-section {
  flex: 1;
  display: flex;
  min-height: 0;
  height: 100%;
  
  @media (max-width: 960px) {
    flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
  }
}

// Left panel: fixed width on desktop, full width on mobile
.left-panel {
  width: 30vw;
  min-width: 409px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  background-color: var(--v-background-base);
  
  @media (max-width: 960px) {
    width: 100vw;
    min-width: unset;
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    flex-shrink: 0;
  }
}

// Content panel: takes remaining space
.content-panel {
  flex: 1;
  overflow-y: scroll;
  
  @media (max-width: 960px) {
    width: 100vw;
    min-height: 100vh;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
  }
}

// Lower section: navigation bar
.lower-section {
  height: 56px;
  flex-shrink: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  background-color: var(--v-background-base);
}

// Panel height calculations (adjusted for new layout)
.panel-height1 {
  height: 100%;
}
.panel-height2 {
  height: 100%;
}

/* Loading overlay styles moved to LoadingOverlay.vue */
</style>
