<template>
  <div class="quick-access-container" v-if="Object.keys(subtopics).length > 1">
    <div class="quick-access-header">
      <h3 class="section-title">
        <v-icon left color="accent">mdi-compass-outline</v-icon>
        What's in this section?
      </h3>
    </div>

    <nav class="nav-menu">
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
    }
  },

  computed: {
    currentSlug() {
      return this.$route.params.slug;
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
    }
  }
};
</script>

<style scoped lang="scss">
.quick-access-container {
  padding: 0;
  background: transparent;
  border: none;
  margin-bottom: 0;
}

.quick-access-header {
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
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .access-buttons .access-btn {
    min-height: 45px;
    padding: 10px 12px !important;
    
    ::v-deep .v-btn__content {
      gap: 6px;
    }
    
    .btn-text {
      line-height: 1.3;
      font-size: 0.9rem;
    }
  }
  
  .cards-buttons .card-btn {
    height: 40px;
    font-size: 0.85rem;
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
