<template>
  <v-app ref="base_background" class="root" style="background-color: var(--v-background-base);">
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
              @trigger-model-visualization="handleModelVisualization"
              @ultrasound-tool-ready="handleUltrasoundToolReady"
              @conditions-updated="handleConditionsUpdate"
              @trigger-condition-visualization="handleConditionVisualization"
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
  </v-app>
</template>

<script>
import Navigation from '@/components/navigation/Navigation.vue';

export default {
  name: "DefaultLayout",
  components: {
    Navigation
  },

  data: () => {
    return {
      multiplier: 1,
      panelHeight: 0,
      isVideo: true,
      ultrasoundToolComponent: null, // Reference to ultrasound tool component
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

    document.addEventListener("fullscreenchange", this.handleFullscreen);
    document.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("resize", this.handleResize);
  },

  updated() {
    // Panel height is now managed by CSS flexbox
  },

  created() {
    console.log(
      "%cPregnancy App %cBeta:v0.0.1",
      "padding: 3px;color:white; background:#023047",
      "padding: 3px;color:white; background:#219EBC"
    );
    this.$nuxt.$on("menu-height-changed", (multiplier) => {
      this.multiplier = multiplier;
    });
  },

  methods: {
    
    // Handle model visualization requests
    handleModelVisualization(data) {
      console.log('[DefaultLayout] Model visualization requested:', data);
      
      // Emit global event for RightPane model component to handle
      this.$nuxt.$emit('trigger-model-visualization', data);
    },
    
    // Handle ultrasound tool ready event
    handleUltrasoundToolReady(toolComponent) {
      console.log('[DefaultLayout] Ultrasound tool ready');
      this.ultrasoundToolComponent = toolComponent;
      
      // Emit global event to notify other components that the tool is ready
      this.$nuxt.$emit('ultrasound-tool-ready', toolComponent);
    },
    
    // Handle pregnancy condition updates from the tool
    handleConditionsUpdate(data) {
      console.log('[DefaultLayout] Pregnancy conditions updated:', data);
      
      // Emit global event for RightPane and other components to listen
      this.$nuxt.$emit('conditions-updated', data);
      
      // Store condition data for potential future use
      this.lastConditionData = data;
    },
    
    // Handle condition visualization requests
    handleConditionVisualization(data) {
      console.log('[DefaultLayout] Condition visualization requested:', data);
      
      // Emit global event for RightPane model component to handle
      this.$nuxt.$emit('trigger-condition-visualization', data);
    },
  },

  beforeDestroy() {
    this.$nuxt.$off("menu-height-changed");
    
    // Clean up event listeners
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("fullscreenchange", this.handleFullscreen);
    document.removeEventListener("keydown", this.handleKeydown);
  },
};
</script>

<style scoped lang="scss">
.root {
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
  }
}

// Lower section: navigation bar
.lower-section {
  height: 56px;
  flex-shrink: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

// Panel height calculations (adjusted for new layout)
.panel-height1 {
  height: 100%;
}
.panel-height2 {
  height: 100%;
}
</style>
