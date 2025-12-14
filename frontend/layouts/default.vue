<template>
  <v-app ref="base_background" class="root" style="background-color: var(--v-backgroundAlt-base);">
    <!-- Main Container: Upper and Lower sections -->
    <div class="main-container">
      
      <!-- Upper Section: LeftPane + ContentPane -->
      <div class="upper-section" :class="{ 'fullscreen-mode': isFullscreenMode }">
        
        <!-- Left Panel -->
        <div class="left-panel" ref="leftPanel" :class="{ 
          'collapsed': isSidebarCollapsed,
          'fullscreen-hidden': isFullscreenMode
        }">
         
            <left-pane 
              :panel-height="panelHeight"
              @conditions-updated="handleConditionsUpdate"
              @sidebar-toggle="handleSidebarToggle"
            />
        </div>
        
        <!-- Content Panel -->
        <div class="content-panel" :class="{ 
          'expanded': isSidebarCollapsed && !isFullscreenMode,
          'fullscreen-mode': isFullscreenMode
        }">
          <Nuxt />
        </div>
      </div>
      
      <!-- Lower Section: Navigation -->
      <div class="lower-section" :class="{ 'fullscreen-hidden': isFullscreenMode }">
        <navigation />
      </div>
      
    </div>

    <!-- Global Loading Overlay to block interactions until ready -->
    <LoadingOverlay :visible="isAppLoading" />
    
    <!-- Weight Converter Floating Button -->
    <WeightConverter />
  </v-app>
</template>

<script>
import Navigation from '@/components/navigation/Navigation.vue';
import LoadingOverlay from '@/components/common/LoadingOverlay.vue';
import Header from '@/components/navigation/Header.vue';
import Menu from '@/components/landing/Menu.vue';
import WeightConverter from '@/components/common/WeightConverter.vue';

export default {
  name: "DefaultLayout",
  components: {
    Navigation,
    Menu,
    WeightConverter,
    LoadingOverlay,
    Header
  },

  data: () => {
    return {
      multiplier: 1,
      panelHeight: 0,
      isAppLoading: false,
      isSidebarCollapsed: false,
      isFullscreenMode: false,
    };
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    }
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

    // Handle route changes to scroll smartly
    const self = this;
    this.handleRouteChange = function() {
      self.$nextTick(() => {
        const hash = self.$route && self.$route.hash;
        
        if (!self.mdAndUp && hash) {
          // Mobile: handle hash-based scrolling
          if (hash === '#leftpane-bottom') {
            self.scrollToLeftPaneBottom();
            return;
          }
          // Legacy support for content-start (can be removed later)
          if (hash === '#content-start') {
            self.scrollToContentStart();
            return;
          }
        }

        // Default behavior: scroll to top for all page changes
        self.scrollToTop();
        
        // Enhanced mobile scroll to top with multiple attempts
        if (!self.mdAndUp) {
          // Immediate scroll
          setTimeout(() => self.scrollToTop(), 50);
          // Secondary scroll for delayed renders
          setTimeout(() => self.scrollToTop(), 200);
          // Final scroll to ensure we're at top
          setTimeout(() => self.scrollToTop(), 500);
        }
      });
    };

    document.addEventListener("fullscreenchange", this.handleFullscreen);
    document.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("resize", this.handleResize);
    // no-op

    // Listen to route changes
    this.$router.afterEach(this.handleRouteChange);

    // Listen to global loading state emitted from RightPane/Model
    this.$nuxt.$on('global-loading', this.handleGlobalLoading);
    
    // Listen to fullscreen toggle events from RightPane
    this.$nuxt.$on('fullscreen-toggle', this.handleFullscreenToggle);
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
    // Enhanced scroll to top helper method
    scrollToTop() {
      if (!this.mdAndUp) {
        // Mobile: comprehensive scroll to top
        const upperSection = document.querySelector('.upper-section');
        const contentPanel = document.querySelector('.content-panel');
        const body = document.body;
        const html = document.documentElement;
        
        // Reset all possible scroll containers
        if (upperSection) {
          upperSection.scrollTop = 0;
          upperSection.scrollTo({ top: 0, behavior: 'auto' });
        }
        if (contentPanel) {
          contentPanel.scrollTop = 0;
          contentPanel.scrollTo({ top: 0, behavior: 'auto' });
        }
        
        // Reset body and html scroll
        body.scrollTop = 0;
        html.scrollTop = 0;
        
        // Fallback to window scroll
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        // Desktop: scroll content panel
        const targetContainer = document.querySelector('.content-panel');
        if (targetContainer) {
          targetContainer.scrollTop = 0;
          targetContainer.scrollTo({ top: 0, behavior: 'auto' });
        }
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    },

    // Scroll to leftpane bottom on mobile
    scrollToLeftPaneBottom() {
      if (!this.mdAndUp) {
        const leftPanel = this.$refs.leftPanel;
        const upperSection = document.querySelector('.upper-section');
        
        if (leftPanel && upperSection) {
          // Calculate scroll position to show leftpane bottom
          const leftPanelHeight = leftPanel.offsetHeight;
          upperSection.scrollTo({ 
            top: leftPanelHeight - 100, // Leave some margin
            behavior: 'smooth' 
          });
        }
      }
    },

    // Legacy method for content-start anchor
    scrollToContentStart() {
      const anchor = document.getElementById('content-start');
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
    },
    
    // Handle sidebar toggle from LeftPane
    handleSidebarToggle(isCollapsed) {
      this.isSidebarCollapsed = isCollapsed;
      
      // Check if we're on the model page (slug route) and reset model to default
      if (this.$route.name === 'slug') {
        this.resetModelToDefault();
      }
    },
    
    // Handle fullscreen toggle from RightPane
    handleFullscreenToggle(isFullscreen) {
      this.isFullscreenMode = isFullscreen;
    },
    
    // Reset model to default position when sidebar is toggled
    resetModelToDefault() {
      // Emit global event to trigger model reset
      this.$nuxt.$emit('reset-model-to-default');
      console.log('Reset model to default -called from layout');
    }
  },

  beforeDestroy() {
    this.$nuxt.$off("menu-height-changed");
    
    // Clean up event listeners
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("fullscreenchange", this.handleFullscreen);
    document.removeEventListener("keydown", this.handleKeydown);
    // no-op

    // Remove route change listener
    if (this.handleRouteChange) {
      this.$router.afterEach(this.handleRouteChange);
    }

    // Remove global loading listener
    this.$nuxt.$off('global-loading', this.handleGlobalLoading);
    
    // Remove fullscreen toggle listener
    this.$nuxt.$off('fullscreen-toggle', this.handleFullscreenToggle);
  },
};
</script>

<style scoped lang="scss">
.root {
  overflow-y: hidden;
  user-select: none;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

// Main container: remaining height with flex layout
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
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
  
  // Fullscreen mode
  &.fullscreen-mode {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background-color: var(--v-backgroundAlt-base);
  }
}

// Left panel: fixed width on desktop, full width on mobile
.left-panel {
  width: 25vw;
  min-width: 250px;
  background-color: var(--v-backgroundAlt-base);
  transition: width 0.3s ease, min-width 0.3s ease;
  
  @media (max-width: 960px) {
    width: 100vw;
    min-width: unset;
    flex-shrink: 0;
  }
  
  // Collapsed state
  &.collapsed {
    width: 50px;
    min-width: 50px;
    
    @media (max-width: 960px) {
      width: 60px;
      min-width: 60px;
    }
  }
  
  // Hidden in fullscreen mode
  &.fullscreen-hidden {
    display: none;
  }
}

// Content panel: takes remaining space
.content-panel {
  flex: 1;
  overflow-y: auto;
  min-width: 0; // Allow flex item to shrink below content size
  transition: all 0.3s ease;
  
  @media (max-width: 960px) {
    width: 100vw;
    min-height: 100vh;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
    padding-top: 20px; /* Space for mobile sticky header */
  }
  
  // Ensure content panel is visible in fullscreen
  @media screen and (display-mode: fullscreen) {
    width: auto;
    min-width: 300px; // Minimum width to ensure visibility
  }
  
  // Expanded state when sidebar is collapsed
  &.expanded {
    // Add extra width when sidebar is collapsed
    width: calc(75vw + 25vw); // Original 75vw + the 25vw from collapsed sidebar
    max-width: calc(100vw - 50px); // Ensure it doesn't exceed viewport minus collapsed sidebar
    
    @media (max-width: 960px) {
      width: calc(100vw - 60px); // Full width minus the 60px collapsed sidebar
      max-width: calc(100vw - 60px);
    }
  }
  
  // Fullscreen mode
  &.fullscreen-mode {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: var(--v-backgroundAlt-base);
  }
}

// Lower section: navigation bar
.lower-section {
  height: 56px;
  flex-shrink: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  background-color: var(--v-background-base);
  
  // Hidden in fullscreen mode
  &.fullscreen-hidden {
    display: none;
  }
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
