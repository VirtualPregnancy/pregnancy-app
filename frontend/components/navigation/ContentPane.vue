<template>
  <div :class="mdAndUp ? 'content-pane-l' : 'content-pane-s'">
    <div class="content-container">
      <!-- Content Header -->
      <div class="content-header">
        <h2 class="page-title">{{ pageTitle }}</h2>
        <p class="page-description">{{ pageDescription }}</p>
      </div>

      <!-- Custom Content Slot (before sections) -->
      <slot name="before-sections" :pageData="{ pageTitle, pageDescription, contentSections }"></slot>

      <!-- Content Sections -->
      <div class="content-sections">
        <div 
          v-for="section in contentSections" 
          :key="section.id"
          class="content-section"
        >
          <!-- Custom Section Header Slot -->
          <slot 
            name="section-header" 
            :section="section" 
            :toggle="() => toggleSection(section.id)"
            :expanded="expandedSections[section.id]"
          >
            <!-- Default section header -->
            <div class="section-header" @click="toggleSection(section.id)">
              <v-icon left :color="section.iconColor">{{ section.icon }}</v-icon>
              <h3>{{ section.title }}</h3>
              <v-icon class="expand-icon" :class="{ 'rotated': expandedSections[section.id] }">
                mdi-chevron-down
              </v-icon>
            </div>
          </slot>

          <v-expand-transition>
            <div v-show="expandedSections[section.id] === true" class="section-content">
              <!-- Custom Section Content Slot -->
              <slot 
                name="section-content" 
                :section="section"
                :expanded="expandedSections[section.id]"
              >
                <!-- Default section content -->
                <div 
                  v-for="item in section.items" 
                  :key="item.id"
                  class="content-item"
                >
                  <!-- Custom Item Slot -->
                  <slot 
                    name="content-item" 
                    :item="item"
                    :section="section"
                  >
                    <!-- Default item content -->
                    <h4>
                      <v-icon left small :color="item.iconColor">{{ item.icon }}</v-icon>
                      {{ item.title }}
                    </h4>
                    <p>{{ item.description }}</p>
                    
                    <!-- Custom List Slot -->
                    <slot name="item-list" :item="item">
                      <ul v-if="item.list" class="content-list">
                        <li v-for="listItem in item.list" :key="listItem">
                          <!-- Custom List Item Slot -->
                          <slot name="list-item" :listItem="listItem" :item="item">
                            {{ listItem }}
                          </slot>
                        </li>
                      </ul>
                    </slot>

                    <!-- Custom Interactive Elements -->
                    <div v-if="item.interactive" class="interactive-elements">
                      <slot name="interactive-content" :item="item" :section="section">
                        <!-- Default interactive placeholder -->
                        <div class="interactive-placeholder">
                          <v-icon color="accent" size="32">mdi-puzzle</v-icon>
                          <p>Interactive content available</p>
                        </div>
                      </slot>
                    </div>
                  </slot>
                </div>
              </slot>
            </div>
          </v-expand-transition>
        </div>
      </div>

      <!-- Custom Content Slot (after sections) -->
      <slot name="after-sections" :pageData="{ pageTitle, pageDescription, contentSections }"></slot>

      <!-- Additional Resources -->
      <div class="additional-resources">
        <h3>Additional Resources</h3>
        <div class="resource-cards">
          <v-card class="resource-card" elevation="2">
            <v-card-title class="pb-2">
              <v-icon left color="primary">mdi-book-open</v-icon>
              Learn More
            </v-card-title>
            <v-card-subtitle>Educational resources</v-card-subtitle>
            <v-card-text>
              <p>Explore detailed information about pregnancy care and development.</p>
            </v-card-text>
          </v-card>
          <v-card class="resource-card" elevation="2">
            <v-card-title class="pb-2">
              <v-icon left color="success">mdi-phone</v-icon>
              Get Support
            </v-card-title>
            <v-card-subtitle>Contact information</v-card-subtitle>
            <v-card-text>
              <p>Connect with healthcare providers and support services.</p>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentPane',
  
  props: {
    pageTitle: {
      type: String,
      default: 'Page Title'
    },
    pageDescription: {
      type: String,
      default: 'Page description goes here'
    },
    contentSections: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      expandedSections: {}
    }
  },

  mounted() {
    // Expand first section by default
    if (this.contentSections.length > 0) {
      this.$set(this.expandedSections, this.contentSections[0].id, true);
      console.log('Initial expanded sections:', this.expandedSections);
    }
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    }
  },

  methods: {
    toggleSection(sectionId) {
      const currentState = this.expandedSections[sectionId] || false;
      this.$set(this.expandedSections, sectionId, !currentState);
      console.log('Toggling section:', sectionId, 'Current state:', currentState, 'New state:', !currentState);
      console.log('All expanded sections:', this.expandedSections);
    }
  }
}
</script>

<style scoped lang="scss">
.content-pane-l {
  margin-left: 32vw;
  width: calc(100% - 32vw);
  height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(209, 199, 181, 0.05) 0%, rgba(108, 144, 185, 0.03) 100%);
}

.content-pane-s {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(209, 199, 181, 0.05) 0%, rgba(108, 144, 185, 0.03) 100%);
  margin-bottom: 30px;
}

.content-container {
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.content-header {
  text-align: center;
  margin-bottom: 40px;
  
  .page-title {
    color: #313657;
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 15px;
    text-shadow: 0 2px 8px rgba(49, 54, 87, 0.1);
  }
  
  .page-description {
    color: #1F6683;
    font-size: 1.1rem;
    line-height: 1.7;
    max-width: 600px;
    margin: 0 auto;
    font-weight: 500;
  }
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.content-section {
  background: rgba(49, 54, 87, 0.9);
  border-radius: 12px;
  border: 2px solid #1F6683;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(31, 102, 131, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  padding: 20px 25px;
  cursor: pointer;
  background: rgba(31, 102, 131, 0.1);
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(108, 144, 185, 0.2);
  
  &:hover {
    background: rgba(31, 102, 131, 0.2);
    transform: translateY(-1px);
  }
  
  h3 {
    flex: 1;
    margin: 0 15px 0 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #D1C7B5;
    letter-spacing: -0.2px;
  }
  
  .v-icon {
    color: #6C90B9 !important;
  }
  
  .expand-icon {
    transition: transform 0.3s ease;
    color: #D1C7B5 !important;
    
    &.rotated {
      transform: rotate(180deg);
    }
  }
}

.section-content {
  padding: 0 25px 25px;
}

.content-item {
  margin-bottom: 25px;
  background: rgba(209, 199, 181, 0.05);
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #DD3C51;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  h4 {
    color: #6C90B9;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    letter-spacing: -0.1px;
    
    .v-icon {
      color: #DD3C51 !important;
    }
  }
  
  p {
    color: #D1C7B5;
    line-height: 1.7;
    margin-bottom: 15px;
    font-size: 1rem;
    opacity: 0.95;
  }
}

.content-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgba(31, 102, 131, 0.1);
  border-radius: 6px;
  padding: 15px;
  
  li {
    color: #D1C7B5;
    padding: 8px 0;
    padding-left: 25px;
    position: relative;
    line-height: 1.6;
    font-weight: 400;
    transition: color 0.2s ease;
    
    &:hover {
      color: #6C90B9;
    }
    
    &:before {
      content: '•';
      color: #DD3C51;
      position: absolute;
      left: 8px;
      font-size: 1.3rem;
      font-weight: bold;
    }
  }
}

.additional-resources {
  h3 {
    color: #313657;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    text-align: center;
  }
}

.resource-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.resource-card {
  background: linear-gradient(135deg, rgba(49, 54, 87, 0.9) 0%, rgba(31, 102, 131, 0.8) 100%) !important;
  border: 2px solid #1F6683 !important;
  box-shadow: 0 6px 25px rgba(31, 102, 131, 0.2) !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(221, 60, 81, 0.2) !important;
    border-color: #DD3C51 !important;
  }
  
  .v-card__title {
    color: #D1C7B5 !important;
    font-size: 1.1rem !important;
    font-weight: 700 !important;
    
    .v-icon {
      color: #6C90B9 !important;
    }
  }
  
  .v-card__subtitle {
    color: #6C90B9 !important;
    font-weight: 500 !important;
  }
  
  .v-card__text {
    color: #D1C7B5 !important;
    
    p {
      margin-bottom: 10px;
      line-height: 1.6;
      font-size: 0.95em;
      
      strong {
        color: #DD3C51 !important;
        font-weight: 600;
      }
    }
  }
}

// Interactive elements styles
.interactive-elements {
  margin-top: 20px;
  padding: 20px;
  background: rgba(108, 144, 185, 0.1);
  border-radius: 8px;
  border-left: 4px solid #6C90B9;
}

.interactive-placeholder {
  text-align: center;
  padding: 20px;
  
  p {
    margin-top: 10px;
    color: #6C90B9;
    font-weight: 500;
    opacity: 0.8;
  }
}

// Slot content containers
.custom-content-wrapper {
  margin: 20px 0;
  padding: 20px;
  background: rgba(31, 102, 131, 0.05);
  border-radius: 8px;
  border: 1px dashed rgba(108, 144, 185, 0.3);
}

// Enhanced list styles for slot content
.content-list {
  &.enhanced {
    background: rgba(209, 199, 181, 0.05);
    border-radius: 8px;
    padding: 20px;
    border-left: 3px solid #DD3C51;
    
    li {
      padding: 12px 0;
      border-bottom: 1px solid rgba(108, 144, 185, 0.1);
      transition: all 0.3s ease;
      
      &:last-child {
        border-bottom: none;
      }
      
      &:hover {
        background: rgba(108, 144, 185, 0.1);
        padding-left: 10px;
        border-radius: 4px;
      }
      
      &:before {
        content: '▸';
        color: #6C90B9;
        margin-right: 10px;
        font-weight: bold;
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .content-container {
    padding: 20px;
  }
  
  .content-header {
    .page-title {
      font-size: 1.8rem;
    }
    
    .page-description {
      font-size: 1rem;
    }
  }
  
  .section-header {
    padding: 15px 20px;
    
    h3 {
      font-size: 1.1rem;
    }
  }
  
  .section-content {
    padding: 0 20px 20px;
  }
  
  .resource-cards {
    grid-template-columns: 1fr;
  }
}
</style> 