<template>
  <div :class="mdAndUp ? 'interactive-pane-l' : 'interactive-pane-s'">
    <div class="interactive-container">
      <!-- Content Header -->
      <div class="content-header">
        <h2 class="page-title">{{ pageTitle }}</h2>
        <p class="page-description">{{ pageDescription }}</p>
      </div>

      <!-- Interactive Navigation Tabs -->
      <div class="section-tabs">
        <div 
          v-for="section in contentSections" 
          :key="section.id"
          class="tab-item"
          :class="{ 'active': activeSection === section.id }"
          @click="setActiveSection(section.id)"
        >
          <v-icon :color="section.iconColor" class="tab-icon">{{ section.icon }}</v-icon>
          <span class="tab-title">{{ section.title }}</span>
        </div>
      </div>

      <!-- Interactive Content Area -->
      <div class="interactive-content">
        <transition name="slide-fade" mode="out-in">
          <div 
            v-if="currentSection" 
            :key="activeSection"
            class="section-content"
          >
            <!-- Section Header with Animation -->
            <div class="section-header-interactive">
              <div class="header-icon">
                <v-icon :color="currentSection.iconColor" size="48">{{ currentSection.icon }}</v-icon>
              </div>
              <div class="header-content">
                <h3>{{ currentSection.title }}</h3>
                <div v-if="renderConfig.showAnimations" class="animated-underline"></div>
              </div>
            </div>

            <!-- Interactive Items Grid -->
            <div class="items-grid">
              <div 
                v-for="(item, index) in currentSection.items" 
                :key="item.id"
                class="interactive-item"
                :class="{ 'expanded': expandedItems[item.id] }"
                :style="{ animationDelay: `${index * 150}ms` }"
                @click="toggleItem(item.id)"
              >
                <div class="item-card">
                  <div class="card-header">
                    <div class="icon-container">
                      <v-icon :color="item.iconColor" size="28">{{ item.icon }}</v-icon>
                    </div>
                    <h4>{{ item.title }}</h4>
                    <v-icon 
                      class="expand-icon" 
                      :class="{ 'rotated': expandedItems[item.id] }"
                    >
                      mdi-chevron-down
                    </v-icon>
                  </div>
                  
                  <div class="card-preview">
                    <p>{{ item.description }}</p>
                  </div>

                  <v-expand-transition>
                    <div v-show="expandedItems[item.id]" class="card-details">
                      <div v-if="renderConfig.showDiagrams && item.diagram" class="diagram-container">
                        <div class="diagram-placeholder">
                          <v-icon size="64" color="accent">mdi-image</v-icon>
                          <p>{{ item.diagram || 'Interactive Diagram' }}</p>
                        </div>
                      </div>
                      
                      <div v-if="item.list" class="interactive-list">
                        <div 
                          v-for="(listItem, idx) in item.list" 
                          :key="idx"
                          class="list-item-interactive"
                          :style="{ animationDelay: `${idx * 100}ms` }"
                          @mouseenter="highlightItem(idx)"
                          @mouseleave="unhighlightItem(idx)"
                        >
                          <div class="item-marker">
                            <div class="marker-dot"></div>
                            <div class="marker-line"></div>
                          </div>
                          <div class="item-content">
                            <span>{{ listItem }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Interactive Elements -->
                      <div v-if="renderConfig.enableInteraction" class="interaction-controls">
                        <v-btn 
                          small 
                          color="primary" 
                          outlined
                          @click.stop="showDetails(item)"
                        >
                          <v-icon left small>mdi-magnify</v-icon>
                          Learn More
                        </v-btn>
                        <v-btn 
                          small 
                          color="accent" 
                          outlined
                          @click.stop="bookmarkItem(item)"
                        >
                          <v-icon left small>mdi-bookmark</v-icon>
                          Bookmark
                        </v-btn>
                      </div>
                    </div>
                  </v-expand-transition>
                </div>
              </div>
            </div>

            <!-- Progress Indicator -->
            <div class="section-progress">
              <div class="progress-dots">
                <div 
                  v-for="(section, index) in contentSections" 
                  :key="section.id"
                  class="progress-dot"
                  :class="{ 
                    'active': section.id === activeSection, 
                    'completed': completedSections.includes(section.id) 
                  }"
                  @click="setActiveSection(section.id)"
                ></div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Floating Action Button for Quick Actions -->
      <div class="floating-actions">
        <v-btn 
          fab 
          small 
          color="primary" 
          @click="showOverview"
          class="action-btn"
        >
          <v-icon>mdi-view-dashboard</v-icon>
        </v-btn>
        <v-btn 
          fab 
          small 
          color="secondary" 
          @click="resetProgress"
          class="action-btn"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InteractiveContentPane',
  
  props: {
    pageTitle: {
      type: String,
      default: 'Interactive Content'
    },
    pageDescription: {
      type: String,
      default: 'Interactive learning experience'
    },
    contentSections: {
      type: Array,
      default: () => []
    },
    renderConfig: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      activeSection: null,
      expandedItems: {},
      completedSections: [],
      highlightedItem: null
    }
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },

    currentSection() {
      return this.contentSections.find(section => section.id === this.activeSection);
    }
  },

  mounted() {
    // Set first section as active by default
    if (this.contentSections.length > 0) {
      this.activeSection = this.contentSections[0].id;
    }
  },

  methods: {
    setActiveSection(sectionId) {
      this.activeSection = sectionId;
      // Reset expanded items when switching sections
      this.expandedItems = {};
    },

    toggleItem(itemId) {
      this.$set(this.expandedItems, itemId, !this.expandedItems[itemId]);
    },

    highlightItem(index) {
      this.highlightedItem = index;
    },

    unhighlightItem(index) {
      if (this.highlightedItem === index) {
        this.highlightedItem = null;
      }
    },

    showDetails(item) {
      // Emit event for parent to handle
      this.$emit('show-details', item);
    },

    bookmarkItem(item) {
      // Emit event for parent to handle
      this.$emit('bookmark-item', item);
    },

    showOverview() {
      // Show overview of all sections
      this.$emit('show-overview');
    },

    resetProgress() {
      this.completedSections = [];
      this.expandedItems = {};
    }
  }
}
</script>

<style scoped lang="scss">
.interactive-pane-l {
  margin-left: 32vw;
  width: calc(100% - 32vw);
  height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(209, 199, 181, 0.05) 0%, rgba(108, 144, 185, 0.03) 100%);
}

.interactive-pane-s {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(209, 199, 181, 0.05) 0%, rgba(108, 144, 185, 0.03) 100%);
  margin-bottom: 30px;
}

.interactive-container {
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
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

.section-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  background: rgba(49, 54, 87, 0.05);
  border-radius: 15px;
  padding: 10px;
  overflow-x: auto;
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  margin: 0 5px;
  
  &:hover {
    background: rgba(31, 102, 131, 0.1);
    transform: translateY(-2px);
  }
  
  &.active {
    background: linear-gradient(135deg, #DD3C51 0%, #6C90B9 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(221, 60, 81, 0.3);
    
    .tab-icon {
      color: white !important;
    }
    
    .tab-title {
      color: white;
    }
  }
  
  .tab-icon {
    margin-right: 10px;
  }
  
  .tab-title {
    font-weight: 600;
    color: #313657;
  }
}

.interactive-content {
  position: relative;
  min-height: 500px;
}

.section-content {
  animation: fadeInUp 0.5s ease;
}

.section-header-interactive {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 25px;
  background: rgba(49, 54, 87, 0.9);
  border-radius: 15px;
  border: 2px solid #1F6683;
  
  .header-icon {
    margin-right: 20px;
    padding: 15px;
    background: rgba(108, 144, 185, 0.2);
    border-radius: 50%;
  }
  
  .header-content {
    flex: 1;
    
    h3 {
      color: #D1C7B5;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    .animated-underline {
      height: 3px;
      background: linear-gradient(90deg, #DD3C51 0%, #6C90B9 100%);
      border-radius: 2px;
      animation: expandWidth 1s ease;
    }
  }
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.interactive-item {
  animation: slideInUp 0.6s ease both;
  
  &.expanded {
    grid-column: 1 / -1;
  }
}

.item-card {
  background: rgba(49, 54, 87, 0.9);
  border-radius: 15px;
  border: 2px solid rgba(31, 102, 131, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #DD3C51;
    box-shadow: 0 8px 30px rgba(221, 60, 81, 0.2);
    transform: translateY(-3px);
  }
}

.card-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: rgba(31, 102, 131, 0.1);
  
  .icon-container {
    width: 50px;
    height: 50px;
    background: rgba(108, 144, 185, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
  }
  
  h4 {
    flex: 1;
    color: #D1C7B5;
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
  }
  
  .expand-icon {
    color: #D1C7B5 !important;
    transition: transform 0.3s ease;
    
    &.rotated {
      transform: rotate(180deg);
    }
  }
}

.card-preview {
  padding: 0 20px 20px;
  
  p {
    color: #D1C7B5;
    opacity: 0.9;
    margin: 0;
    line-height: 1.6;
  }
}

.card-details {
  border-top: 1px solid rgba(108, 144, 185, 0.2);
  padding: 20px;
}

.diagram-container {
  margin-bottom: 20px;
  
  .diagram-placeholder {
    background: rgba(108, 144, 185, 0.1);
    border-radius: 10px;
    padding: 30px;
    text-align: center;
    border: 2px dashed rgba(108, 144, 185, 0.3);
    
    p {
      color: #6C90B9;
      margin-top: 10px;
      font-weight: 500;
    }
  }
}

.interactive-list {
  margin-bottom: 20px;
}

.list-item-interactive {
  display: flex;
  align-items: center;
  padding: 12px 0;
  transition: all 0.3s ease;
  border-radius: 8px;
  animation: slideInLeft 0.5s ease both;
  
  &:hover {
    background: rgba(108, 144, 185, 0.1);
    padding-left: 10px;
  }
  
  .item-marker {
    position: relative;
    margin-right: 15px;
    
    .marker-dot {
      width: 8px;
      height: 8px;
      background: #DD3C51;
      border-radius: 50%;
    }
    
    .marker-line {
      position: absolute;
      top: 8px;
      left: 50%;
      width: 1px;
      height: 20px;
      background: rgba(221, 60, 81, 0.3);
      transform: translateX(-50%);
    }
  }
  
  .item-content {
    flex: 1;
    
    span {
      color: #D1C7B5;
      line-height: 1.6;
    }
  }
}

.interaction-controls {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.section-progress {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  
  .progress-dots {
    display: flex;
    gap: 15px;
  }
  
  .progress-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(31, 102, 131, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(31, 102, 131, 0.6);
      transform: scale(1.2);
    }
    
    &.active {
      background: #DD3C51;
      transform: scale(1.3);
    }
    
    &.completed {
      background: #6C90B9;
    }
  }
}

.floating-actions {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
  
  .action-btn {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes expandWidth {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

// Transitions
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

// Responsive design
@media (max-width: 768px) {
  .interactive-container {
    padding: 20px;
  }
  
  .content-header .page-title {
    font-size: 1.8rem;
  }
  
  .section-tabs {
    flex-direction: column;
    
    .tab-item {
      justify-content: center;
      margin: 5px 0;
    }
  }
  
  .items-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .section-header-interactive {
    flex-direction: column;
    text-align: center;
    
    .header-icon {
      margin-right: 0;
      margin-bottom: 15px;
    }
  }
  
  .floating-actions {
    bottom: 20px;
    right: 20px;
  }
}
</style>