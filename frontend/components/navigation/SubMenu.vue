<template>
  <div class="quick-access-container" v-if="Object.keys(subtopics).length > 1">

    <!-- Section title - always visible -->
    <div class="section-title-container" v-if="!isMobile">
      <h3 class="section-title">
        <v-icon left color="accent">mdi-compass-outline</v-icon>
        What's in this section?
      </h3>
    </div>

    <!-- Navigation menu - always visible on desktop, collapsible on mobile -->
    <nav class="nav-menu" :class="{ 'mobile-hidden': isMobile && isMobileCollapsed }">
      <nuxt-link 
        v-for="(subtopic, key) in subtopics" 
        :key="key"
        class="nav-item" 
        :class="{ 'nav-item--active': isCurrentPage(key) }"
        :to="navTo(key)"
      >
        <v-icon class="nav-icon" size="18">{{ subtopic.icon }}</v-icon>
        <span class="nav-text">{{ subtopic.heading }}</span>
      </nuxt-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "SubMenu",
  
  props: {
    subtopics: {
      type: Object,
      default: () => ({})
    },
    parentSlug: {
      type: String,
      default: ''
    },
    topicTitle: {
      type: String,
      default: ''
    },
    isMobileCollapsed: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {}
  },

  computed: {
    currentSlug() {
      return this.$route.params.slug;
    },
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    }
  },

  methods: {
    getSubtopicColor(category) {
      const colorMap = {
        success: 'success',
        warning: 'warning',
        error: 'error',
        primary: 'primary'
      };
      return colorMap[category] || 'primary';
    },
    
    isCurrentPage(key) {
      const expectedSlug = `${this.parentSlug}-${key}`;
      return this.currentSlug === expectedSlug;
    },

    navTo(key) {
      const base = { name: 'slug', params: { slug: `${this.parentSlug}-${key}` } };
      // On mobile, add hash to scroll to leftpane bottom
      const isMobile = !this.$vuetify.breakpoint.mdAndUp;
      return isMobile ? { ...base, hash: '#leftpane-bottom' } : base;
    },
  },

  mounted() {
    // Component mounted
  },

  beforeDestroy() {
    // Component destroyed
  }
};
</script>

<style scoped lang="scss">
.quick-access-container {
  padding: 0;
  background: transparent;
  border: none;
  margin-bottom: 0;
  position: relative;
}


// Desktop header styles
.desktop-header {
  .quick-access-header {
    margin-bottom: 16px;
    padding-left: 16px;
  }
}

.quick-access-header {
  margin-bottom: 16px;
  padding-left: 16px;
}

.section-title-container {
  margin-bottom: 16px;
  padding-left: 16px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 0;
  padding: 0;
  
  // Mobile collapse behavior
  &.mobile-hidden {
    display: none;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    color: black;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.4;
    border-radius: 6px;
    margin-bottom: 4px;
    background-color: #dbeafe;
    transition: all 0.15s ease;
    
    .nav-icon {
      margin-right: 12px;
      color: inherit;
      flex-shrink: 0;
    }
    
    .nav-text {
      flex: 1;
      white-space: normal;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    
    &:hover {
      background-color: #b1cde7;
      color: #334155;
    }
    
    &.nav-item--active {
      background-color: #cce5fb;
      color: #1e40af;
      font-weight: 500;
      
      .nav-icon {
        color: #1e40af;
      }
    }
  }
}

/* Mobile toggle styles removed in revert */

// Animation for mobile menu
@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 300px;
  }
}

.cards-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}

.cards-title {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cards-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .card-btn {
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: none;
    justify-content: flex-start;
    padding-left: 20px;
    
    &:hover {
      transform: translateX(2px);
      transition: transform 0.2s ease;
    }
  }
}


@media (max-width: 768px) {
  .quick-access-container {
    padding: 0;
    margin-bottom: 0;
  }
  
  .mobile-sticky-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--v-backgroundAlt-base);
  }
  
  .nav-menu {
    padding: 0 16px 16px 16px;
    background: var(--v-backgroundAlt-base);
    
    .nav-item {
      margin-bottom: 3px;
      font-size: 0.85rem;
      padding: 8px 12px;
    }
  }
}


::v-deep .v-btn {
  text-transform: none !important;
  font-weight: 500 !important;
  
  
  &.access-btn {
    white-space: normal !important;
    
    .v-btn__content {
      white-space: normal !important;
      height: auto !important;
    }
  }
}
</style>
