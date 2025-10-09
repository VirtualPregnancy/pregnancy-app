<template>
  <div class="left-pane h-full" :class="{ 'collapsed': isCollapsed }">
    <!-- Global menu now floats in layout-->

  
    <div v-if="$route.name == 'slug'">
       <!-- Mobile sticky header -->
       <div v-if="!mdAndUp" class="mobile-sticky-header">
         <div class="mobile-header-content">
          <div class="mobile-title">{{ currentTopicTitle }}</div>
           <div class="mobile-controls">
             <v-btn
               icon
               color="primary"
               :to="{ path: '/' }"
               title="Home"
               class="mobile-home-btn"
             >
               <v-icon>mdi-home</v-icon>
             </v-btn>
            
           </div>
          <div>
            <v-btn icon @click="toggleMobileSubmenu">
              <v-icon :color="isMobileSubmenuCollapsed ? 'black': 'blue'">{{ isMobileSubmenuCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
            </v-btn>
          </div>
           
          
         </div>
       </div>
       
       <!-- Desktop header -->
       <div v-if="mdAndUp" class="left-pane-header flex justify-space-between items-center ml-4 mt-8 mr-4">
        <div class="title font-weight-bold font-size-20" v-if="!isCollapsed">
          {{ currentTopicTitle }}
        </div>
        <button class="hamburger-menu" @click="toggleSidebar">
          <v-icon>{{ isCollapsed ?  'mdi-menu':"mdi-menu-open" }}</v-icon>
        </button>
       </div>
      <div class="pa-4 mb-4" :class="currentBg" tile :style="panelHeightStyle" v-if="!isCollapsed">

        <!-- Desktop submenu -->
        <SubMenu 
          :subtopics="currentTopicSubtopics"
          :parent-slug="currentParentSlug"
          :topic-title="currentTopicTitle"
          :is-mobile-collapsed="false"
          :is-mobile="false"
          v-if="mdAndUp"
        />
        
        <!-- Mobile floating submenu -->
        <div v-if="!mdAndUp && !isMobileSubmenuCollapsed" class="mobile-floating-submenu">
          <SubMenu 
            :subtopics="currentTopicSubtopics"
            :parent-slug="currentParentSlug"
            :topic-title="currentTopicTitle"
            :is-mobile-collapsed="false"
            :is-mobile="true"
          />
        </div>
        
        <!-- Anchor for mobile scroll target -->
        <div id="leftpane-bottom" class="scroll-anchor"></div>
      </div>

   
    </div>
    
  </div>
</template>

<script>
import SubMenu from './SubMenu.vue';

  export default {
  name: "LeftPane",
  
  components: {
    SubMenu
  },

  props: {
    panelHeight: {
      type: Number,
    },
  },

  computed: {
    currentBg() {
      return this.$category() ? "bg-" + this.$category() : "bg-success";
    },
    panelHeightStyle() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return { "min-height": this.panelHeight - 2 + "px" };
      } else return { height: "auto" };
    },
    
    
    
    // Vuetify breakpoint helper
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },

    // Get current topic's subtopics
    currentTopicSubtopics() {
      if (this.$route.name !== 'slug') return {};
      
      const parentTopic = this.$parentTopic();
      if (!parentTopic) return {};
      
      const topics = this.$getTopics();
      const topic = topics[parentTopic.slug.toLowerCase()];
      return topic?.subTopics || {};
    },

    // Get current parent slug
    currentParentSlug() {
      return this.$route.name === 'slug' ? this.$parentTopic()?.slug.toLowerCase() : '';
    },

    // Get current topic title
    currentTopicTitle() {
      if (this.$route.name !== 'slug') return '';
      
      const parentTopic = this.$parentTopic();
      if (!parentTopic) return '';
      
      const topics = this.$getTopics();
      const topic = topics[parentTopic.slug.toLowerCase()];
      return topic?.title || '';
    },
  },

  data() {
    return {
      isCollapsed: false,
      isMobileSubmenuCollapsed: true
    }
  },

  mounted() {
    // Listen to route changes to auto-close mobile submenu
    this.$router.afterEach(() => {
      if (!this.mdAndUp) {
        this.isMobileSubmenuCollapsed = true;
      }
    });
  },

  beforeDestroy() {
    // Clean up route listener if needed
  },

  methods: {
    // Toggle sidebar collapse/expand state
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
      // Emit event to parent layout to handle responsive changes
      this.$emit('sidebar-toggle', this.isCollapsed);
    },
    
    // Toggle mobile submenu collapse/expand state
    toggleMobileSubmenu() {
      this.isMobileSubmenuCollapsed = !this.isMobileSubmenuCollapsed;
    },
    
    // Forward pregnancy condition updates to parent components
    handleConditionsUpdate(data) {
      //console.log('[LeftPane] Forwarding conditions update:', data);
      this.$emit('conditions-updated', data);
    },
    

  },
};
</script>

<style lang="scss" src="@/assets/sass/components/left-panel.scss"></style>

<style scoped>
.scroll-anchor {
  height: 1px;
  visibility: hidden;
}

/* Collapsed sidebar styles */
.left-pane.collapsed {
  width: 50px !important;
  min-width: 50px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  
  @media (max-width: 960px) {
    width: 100vw !important;
    min-width: unset !important;
    display: block;
    flex-direction: unset;
    align-items: unset;
    padding: 0;
  }
}

.left-pane.collapsed .left-pane-header {
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left-pane.collapsed .hamburger-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: var(--v-primary-base);
  color: white;
  border: 1px solid var(--v-background-base);
  transition: all 0.3s ease;
}

.left-pane.collapsed .hamburger-menu:hover {
  background-color: var(--v-primary-lighten5);
  border-color: var(--v-primary-base);
}

.left-pane.collapsed .hamburger-menu .v-icon {
  color: var(--v-text-primary);
  font-size: 28px;
}

/* Mobile specific styles */
@media (max-width: 960px) {
  .left-pane.collapsed {
    width: 100vw !important;
    min-width: unset !important;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    background-color: var(--v-primary-base);
    min-height: 100vh;
  }
  
  .left-pane.collapsed .left-pane-header {
    justify-content: center;
    margin: 0;
    padding: 1rem 0;
    width: 60px;
    height: auto;
    display: flex;
    align-items: flex-start;
    background-color: var(--v-primary-base);
    min-height: 100vh;
  }
  
  .left-pane.collapsed .hamburger-menu {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px;
    margin: 0 auto;
    
  }
  
  .left-pane.collapsed .hamburger-menu:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .left-pane.collapsed .hamburger-menu .v-icon {
    font-size: 24px;
    color: white;
  }
  
  /* Mobile sticky header */
  .mobile-sticky-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: var(--v-background-base);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* Ensure seamless connection with submenu */
    border-bottom: none;
  }
  
  .mobile-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.1rem 0.5rem;
    /* Ensure consistent spacing with submenu */
    min-height: 60px;
  }
  
  .mobile-title {
    font-weight: bold;
    font-size: 1.1rem;
    color: var(--v-text-primary);
    flex: 1;
    margin-right: 1rem;
  }
  
  /* Mobile controls */
  .mobile-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .mobile-submenu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: none;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  
  .mobile-submenu-toggle .v-icon {
    font-size: 20px;
  }
  
  /* Mobile floating submenu */
  .mobile-floating-submenu {
    position: fixed;
    top: 60px; /* Exactly below the sticky header */
    left: 0;
    right: 0;
    z-index: 999;
    background-color: var(--v-background-base);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    max-height: 60vh;
    overflow-y: auto;
    /* Create seamless connection with header */
    border-top: none;
    margin-top: 0;
    /* Unified shadow for the entire header+submenu block */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}
</style>
