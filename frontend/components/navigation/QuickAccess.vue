<template>
  <div class="quick-access-container" v-if="contentSections.length > 0">
    <!-- Header -->
    <div class="quick-access-header">
      <h3 class="section-title">
        <v-icon left color="accent">mdi-compass-outline</v-icon>
        Quick Access
      </h3>
    </div>

    <!-- Quick Access Buttons -->
    <div class="access-buttons">
      <v-btn 
        v-for="section in contentSections" 
        :key="section.id"
        class="access-btn" 
        color="var(--v-background-base)" 
        large 
        block
        @click="scrollToSection(section.id)"
      >
        <v-icon left :color="section.iconColor">{{ section.icon }}</v-icon>
        {{ section.title }}
      </v-btn>
    </div>

    <!-- Additional Cards Quick Access -->
    <div v-if="cards && cards.length > 0" class="cards-section">
      <h4 class="cards-title">
        <v-icon left color="primary">mdi-card-text-outline</v-icon>
        Resources
      </h4>
      
      <div class="cards-buttons">
        <v-btn 
          v-for="(card, index) in cards" 
          :key="'card-' + index"
          class="card-btn" 
          :color="getCardBtnColor(card.backgroundColor)" 
          outlined
          block
          @click="scrollToCards"
        >
          <v-icon left :color="card.iconColor">{{ card.icon }}</v-icon>
          {{ card.title }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuickAccess",
  
  props: {
    contentSections: {
      type: Array,
      default: () => []
    },
    cards: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    scrollToSection(sectionId) {
      // Emit event to parent to expand the specific section
      this.$nuxt.$emit('scroll-to-content-section', sectionId);
      
      // Scroll to the section in the content pane
      this.$nextTick(() => {
        setTimeout(() => {
          const element = document.querySelector(`[data-section-id="${sectionId}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      });
    },

    scrollToCards() {
      // Scroll to the cards section
      this.$nextTick(() => {
        const element = document.querySelector('.grid.md\\:grid-cols-2');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },

    getBtnColor(iconColor) {
      // Convert CSS variable colors to Vuetify color names
      if (iconColor && iconColor.includes('primary')) return 'primary';
      if (iconColor && iconColor.includes('success')) return 'success';
      if (iconColor && iconColor.includes('warning')) return 'warning';
      if (iconColor && iconColor.includes('error')) return 'error';
      if (iconColor && iconColor.includes('accent')) return 'accent';
      return 'primary'; // default
    },

    getCardBtnColor(backgroundColor) {
      // Convert CSS variable colors to Vuetify color names for outlined buttons
      if (backgroundColor && backgroundColor.includes('success')) return 'success';
      if (backgroundColor && backgroundColor.includes('primary')) return 'primary';
      if (backgroundColor && backgroundColor.includes('warning')) return 'warning';
      if (backgroundColor && backgroundColor.includes('error')) return 'error';
      if (backgroundColor && backgroundColor.includes('accent')) return 'accent';
      return 'primary'; // default
    }
  }
};
</script>

<style scoped lang="scss">
.quick-access-container {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.quick-access-header {
  margin-bottom: 20px;
}

.section-title {
  color: rgba(255, 255, 255, 0.95);
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
  margin-bottom: 20px;
  
  .access-btn {
    height: 50px;
    font-size: 0.95rem;
    font-weight: 500;
    text-transform: none;
    justify-content: flex-start;
    padding-left: 20px;
    
    &:hover {
      transform: translateX(4px);
      transition: transform 0.2s ease;
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
    height: 45px;
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

// Responsive design
@media (max-width: 768px) {
  .quick-access-container {
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .access-buttons .access-btn {
    height: 45px;
    font-size: 0.9rem;
  }
  
  .cards-buttons .card-btn {
    height: 40px;
    font-size: 0.85rem;
  }
}

// Custom button styles
.v-btn {
  text-transform: none !important;
  font-weight: 500 !important;
}
</style>
