<template>
  <div :class="mdAndUp ? 'timeline-pane-l' : 'timeline-pane-s'">
    <div class="timeline-container">
      <!-- Content Header -->
      <div class="content-header">
        <h2 class="page-title">{{ pageTitle }}</h2>
        <p class="page-description">{{ pageDescription }}</p>
      </div>

      <!-- Timeline Progress Bar (if enabled) -->
      <div v-if="renderConfig.enableProgress" class="timeline-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
        <div class="progress-labels">
          <span>First Trimester</span>
          <span>Second Trimester</span>
          <span>Third Trimester</span>
        </div>
      </div>

      <!-- Timeline Content -->
      <div class="timeline-content">
        <div 
          v-for="(section, index) in contentSections" 
          :key="section.id"
          class="timeline-section"
          :class="{ 'active': activeSection === section.id }"
        >
          <!-- Timeline Node -->
          <div class="timeline-node" @click="setActiveSection(section.id)">
            <div class="node-circle">
              <v-icon :color="section.iconColor" size="24">{{ section.icon }}</v-icon>
            </div>
            <div class="node-content">
              <h3>{{ section.title }}</h3>
              <div v-if="renderConfig.showWeekNumbers" class="week-info">
                {{ getWeekRange(section) }}
              </div>
            </div>
          </div>

          <!-- Timeline Line -->
          <div v-if="index < contentSections.length - 1" class="timeline-line"></div>

          <!-- Section Content -->
          <v-expand-transition>
            <div v-show="activeSection === section.id" class="section-details">
              <div class="details-content">
                <div 
                  v-for="item in section.items" 
                  :key="item.id"
                  class="timeline-item"
                >
                  <div class="item-header">
                    <v-icon left small :color="item.iconColor">{{ item.icon }}</v-icon>
                    <h4>{{ item.title }}</h4>
                  </div>
                  <p class="item-description">{{ item.description }}</p>
                  <div v-if="item.list" class="item-list">
                    <div 
                      v-for="(listItem, idx) in item.list" 
                      :key="idx"
                      class="list-item"
                      :style="{ animationDelay: `${idx * 100}ms` }"
                    >
                      <v-icon small color="accent">mdi-check-circle</v-icon>
                      <span>{{ listItem }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-expand-transition>
        </div>
      </div>

      <!-- Navigation Controls -->
      <div class="timeline-controls">
        <v-btn 
          @click="previousSection" 
          :disabled="currentSectionIndex === 0"
          color="secondary"
          outlined
        >
          <v-icon left>mdi-chevron-left</v-icon>
          Previous
        </v-btn>
        <v-btn 
          @click="nextSection" 
          :disabled="currentSectionIndex === contentSections.length - 1"
          color="primary"
        >
          Next
          <v-icon right>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimelineContentPane',
  
  props: {
    pageTitle: {
      type: String,
      default: 'Timeline'
    },
    pageDescription: {
      type: String,
      default: 'Timeline description'
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
      activeSection: null
    }
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },

    currentSectionIndex() {
      return this.contentSections.findIndex(section => section.id === this.activeSection);
    },

    progressPercentage() {
      if (!this.activeSection || this.contentSections.length === 0) return 0;
      return ((this.currentSectionIndex + 1) / this.contentSections.length) * 100;
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
    },

    previousSection() {
      const currentIndex = this.currentSectionIndex;
      if (currentIndex > 0) {
        this.activeSection = this.contentSections[currentIndex - 1].id;
      }
    },

    nextSection() {
      const currentIndex = this.currentSectionIndex;
      if (currentIndex < this.contentSections.length - 1) {
        this.activeSection = this.contentSections[currentIndex + 1].id;
      }
    },

    getWeekRange(section) {
      // Extract week numbers from section title or provide defaults
      const weekRanges = {
        'first-trimester': '0-12 weeks',
        'second-trimester': '13-27 weeks',
        'third-trimester': '28-40 weeks'
      };
      return weekRanges[section.id] || '';
    }
  }
}
</script>

<style scoped lang="scss">
.timeline-pane-l {
  margin-left: 32vw;
  width: calc(100% - 32vw);
  height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(209, 199, 181, 0.05) 0%, rgba(108, 144, 185, 0.03) 100%);
}

.timeline-pane-s {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(209, 199, 181, 0.05) 0%, rgba(108, 144, 185, 0.03) 100%);
  margin-bottom: 30px;
}

.timeline-container {
  padding: 30px;
  max-width: 900px;
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

.timeline-progress {
  margin-bottom: 40px;
  
  .progress-bar {
    height: 8px;
    background: rgba(31, 102, 131, 0.2);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #DD3C51 0%, #6C90B9 100%);
      transition: width 0.5s ease;
      border-radius: 4px;
    }
  }
  
  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #1F6683;
    font-weight: 500;
  }
}

.timeline-content {
  position: relative;
}

.timeline-section {
  position: relative;
  margin-bottom: 30px;
  
  &.active .node-circle {
    background: linear-gradient(135deg, #DD3C51 0%, #6C90B9 100%);
    box-shadow: 0 0 20px rgba(221, 60, 81, 0.3);
    transform: scale(1.1);
  }
  
  &.active .node-content h3 {
    color: #DD3C51;
  }
}

.timeline-node {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(49, 54, 87, 0.05);
  
  &:hover {
    background: rgba(49, 54, 87, 0.1);
    transform: translateX(5px);
  }
  
  .node-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(31, 102, 131, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    transition: all 0.3s ease;
    border: 3px solid rgba(108, 144, 185, 0.3);
  }
  
  .node-content {
    flex: 1;
    
    h3 {
      margin: 0 0 8px 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #313657;
      transition: color 0.3s ease;
    }
    
    .week-info {
      color: #6C90B9;
      font-size: 0.9rem;
      font-weight: 500;
    }
  }
}

.timeline-line {
  position: absolute;
  left: 50px;
  width: 3px;
  height: 30px;
  background: linear-gradient(180deg, rgba(108, 144, 185, 0.3) 0%, rgba(221, 60, 81, 0.2) 100%);
  margin-top: -30px;
  z-index: -1;
}

.section-details {
  margin-left: 80px;
  margin-top: 20px;
  
  .details-content {
    background: rgba(49, 54, 87, 0.9);
    border-radius: 12px;
    border: 2px solid #1F6683;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(31, 102, 131, 0.2);
  }
}

.timeline-item {
  padding: 25px;
  border-bottom: 1px solid rgba(108, 144, 185, 0.2);
  
  &:last-child {
    border-bottom: none;
  }
  
  .item-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    h4 {
      margin: 0;
      margin-left: 10px;
      color: #D1C7B5;
      font-size: 1.2rem;
      font-weight: 700;
    }
  }
  
  .item-description {
    color: #D1C7B5;
    line-height: 1.7;
    margin-bottom: 20px;
    opacity: 0.95;
  }
  
  .item-list {
    display: grid;
    gap: 12px;
  }
  
  .list-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background: rgba(209, 199, 181, 0.1);
    border-radius: 6px;
    border-left: 3px solid #DD3C51;
    animation: slideInLeft 0.5s ease forwards;
    opacity: 0;
    transform: translateX(-20px);
    
    .v-icon {
      margin-right: 12px;
    }
    
    span {
      color: #D1C7B5;
      font-weight: 400;
      line-height: 1.5;
    }
  }
}

.timeline-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid rgba(31, 102, 131, 0.2);
}

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Responsive design
@media (max-width: 768px) {
  .timeline-container {
    padding: 20px;
  }
  
  .content-header .page-title {
    font-size: 1.8rem;
  }
  
  .timeline-node {
    padding: 15px;
    
    .node-circle {
      width: 50px;
      height: 50px;
    }
    
    .node-content h3 {
      font-size: 1.1rem;
    }
  }
  
  .section-details {
    margin-left: 0;
  }
  
  .timeline-line {
    display: none;
  }
  
  .timeline-controls {
    flex-direction: column;
    gap: 15px;
  }
}
</style>