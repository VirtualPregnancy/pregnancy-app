<template>
  <div class="pa-4">
    <h1 class="pt-2 main-heading">
      <v-icon left color="primary">mdi-heart-outline</v-icon>
      Pregnancy Support Services
    </h1>
    
    <div class="about-panel">
      <!-- Introduction Section -->
      <div class="intro-section">
        <p class="intro-text">
          This application provides comprehensive information about support services available 
          for pregnant people and their whānau throughout Aotearoa New Zealand.
        </p>
      </div>

      <!-- Quick Access Navigation -->
      <div class="quick-access">
        <h3 class="section-title">
          <v-icon left color="accent">mdi-compass-outline</v-icon>
          Quick Access
        </h3>
        
        <div class="access-buttons">
          <v-btn 
            class="access-btn" 
            color="success" 
            large 
            block
            @click="scrollToSection('general')"
          >
            <v-icon left>mdi-account-group</v-icon>
            General Pregnancy Services
          </v-btn>
          
          <v-btn 
            class="access-btn" 
            color="warning" 
            large 
            block
            @click="scrollToSection('specialist')"
          >
            <v-icon left>mdi-medical-bag</v-icon>
            Specialist Support Services
          </v-btn>
          
          <v-btn 
            class="access-btn" 
            color="accent" 
            large 
            block
            @click="scrollToSection('resources')"
          >
            <v-icon left>mdi-book-open-variant</v-icon>
            Contacts & Resources
          </v-btn>
        </div>
      </div>

    
         

      <!-- Feedback Section -->
      <div class="feedback-section">
        <v-card class="feedback-card" elevation="2">
          <v-card-title>
            <v-icon left color="primary">mdi-comment-text-outline</v-icon>
            Help Us Improve
          </v-card-title>
          <v-card-text>
            <p class="feedback-text">
              Your feedback helps us improve this resource for all pregnant people and their whānau.
            </p>
            <v-btn 
              color="primary" 
              outlined 
              href="https://www.auckland.ac.nz/en/abi.html"
              target="_blank"
              class="feedback-btn"
            >
              <v-icon left>mdi-open-in-new</v-icon>
              Give Feedback
            </v-btn>
          </v-card-text>
        </v-card>
      </div>

      <!-- Attribution -->
      <div class="attribution">
        <div class="attribution-content">
          <div class="text-h6 text--primary mb-2">Developed by</div>
          <div class="text--secondary">
            Auckland Bioengineering Institute<br>
            University of Auckland<br>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutUs",

  methods: {
    scrollToSection(sectionId) {
      // Emit event to parent page to expand the specific section
      this.$nuxt.$emit('scroll-to-section', sectionId);
      
      // Optional: Add smooth scrolling to the section
      this.$nextTick(() => {
        const element = document.querySelector(`.service-section:nth-child(${this.getSectionIndex(sectionId)})`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },

    getSectionIndex(sectionId) {
      const sectionMap = {
        'general': 1,
        'specialist': 2,
        'resources': 3
      };
      return sectionMap[sectionId] || 1;
    }
  }
};
</script>

<style scoped lang="scss">
.main-heading {
  color: var(--v-primary-base);
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.about-panel {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.intro-section {
  text-align: center;
  margin-bottom: 20px;
  
  .intro-text {
    font-size: 1.1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.85);
    max-width: 800px;
    margin: 0 auto;
  }
}

.section-title {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.quick-access {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.access-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  .access-btn {
    height: 60px;
    font-size: 1rem;
    font-weight: 500;
    text-transform: none;
  }
}

.service-overview {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.overview-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease, background-color 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.12);
  }
  
  .card-icon {
    margin-bottom: 15px;
  }
  
  h4 {
    color: rgba(255, 255, 255, 0.95);
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
    font-size: 0.95rem;
  }
}

.contact-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 4px solid var(--v-error-base);
}

.emergency-contacts {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
  
  &.urgent {
    border-left: 3px solid var(--v-error-base);
  }
  
  .contact-details {
    flex: 1;
    
    strong {
      color: rgba(255, 255, 255, 0.95);
      font-size: 1rem;
      display: block;
      margin-bottom: 4px;
    }
    
    small {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.85rem;
    }
  }
}

.feedback-section {
  .feedback-card {
    background: rgba(255, 255, 255, 0.08) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    .v-card__title {
      color: rgba(255, 255, 255, 0.95);
      font-size: 1.2rem;
    }
    
    .feedback-text {
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.6;
      margin-bottom: 15px;
    }
    
    .feedback-btn {
      font-weight: 500;
      text-transform: none;
    }
  }
}

.attribution {
  text-align: center;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  .attribution-content {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    line-height: 1.5;
    
    .text-h6 {
      color: rgba(255, 255, 255, 0.95) !important;
      font-weight: 600;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .main-heading {
    font-size: 1.6rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .about-panel {
    gap: 20px;
  }
  
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .access-buttons {
    .access-btn {
      height: 50px;
      font-size: 0.9rem;
    }
  }
  
  .contact-item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}

// Custom button styles using new color scheme
.v-btn {
  text-transform: none !important;
  font-weight: 500 !important;
}

.v-btn.theme--dark.v-btn--has-bg {
  &.success {
    background-color: var(--v-success-base) !important;
  }
  
  &.warning {  
    background-color: var(--v-warning-base) !important;
  }
  
  &.accent {
    background-color: var(--v-accent-base) !important;
  }
}
</style>
