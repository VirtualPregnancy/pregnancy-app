<template>
  <div class="quick-access-container" v-if="Object.keys(subtopics).length > 1">
    <div class="quick-access-header">
      <h3 class="section-title">
        <v-icon left color="accent">mdi-compass-outline</v-icon>
        {{ topicTitle + ' Menu' || 'Quick Access' }}
      </h3>
    </div>

    <div class="access-buttons">
      <v-btn 
        v-for="(subtopic, key) in subtopics" 
        :key="key"
        class="access-btn" 
        :class="{ 'active-btn': isCurrentPage(key) }"
        large 
        block
        :to="{ name: 'slug', params: { slug: `${parentSlug}-${key}` }}"
      >
        <v-icon left>{{ subtopic. icon }}</v-icon>
        <span class="btn-text">{{ subtopic.heading }}</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuickAccess",
  
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
    }
  }
};
</script>

<style scoped lang="scss">
.quick-access-container {
  padding: 15px;
  background: var(--v-subSuccess-base);
  border-radius: 8px;
  border: 1px solid var(--v-secondary-base);
  margin-bottom: 10px;
}

.quick-access-header {
  margin-bottom: 20px;
}

.section-title {
  color: black;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.access-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 10px;
  padding: 0.5rem;
  
  .access-btn {
    min-height: 50px;
    height: auto !important;
    font-weight: 500;
    background-color: var(--v-buttonMain-base);
    color: var(--v-buttonText-base);
    text-transform: none;
    justify-content: flex-start;
    text-align: left;
    padding: 12px 16px !important;
    
    
    ::v-deep .v-btn__content {
      width: 100%;
      height: auto !important;
      white-space: normal !important;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: nowrap;
      gap: 8px;
      padding: 4px 0;
    }
    
    
    ::v-deep .v-icon {
      margin-right: 0 !important;
      margin-left: 0 !important;
      flex-shrink: 0;
      align-self: flex-start;
      margin-top: 2px;
    }
    
    .btn-text {
      white-space: normal !important;
      word-break: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
      width: 100%;
      line-height: 1.4;
      flex: 1;
      display: block;
      text-align: left;
      font-size: 0.95rem;
      
     
      word-wrap: break-word;
      -webkit-hyphens: auto;
      -moz-hyphens: auto;
      -ms-hyphens: auto;
    }
    
    &:hover {
        transform: translateX(4px);
        transition: transform 0.2s ease;
        background-color: var(--v-buttonMainHover-base);
        color: var(--v-buttonTextHover-base);
    }
    
    &.active-btn {
        background-color: var(--v-buttonMainActive-base);
        color: var(--v-buttonTextActive-base);
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        scale: 1.02;

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