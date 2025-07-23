<template>
  <div class="control-panel" :class="{ 'collapsed': isCollapsed }">
        Control Panel
        <!-- Toggle button -->
        <v-btn 
        @click="toggleCollapse" 
        class="collapse-btn"
        fab
        small
        color="primary"
        elevation="2"
        >
        <v-icon small >{{ isCollapsed ? 'mdi-chevron-up' : 'mdi-chevron-down' }} </v-icon>
        
        </v-btn>
        

    <!-- Main controls - shown when expanded -->
    <div v-show="!isCollapsed" class="controls-content">
    <!-- Vessel Type Toggle -->
     <div class="control-row">
        <v-btn-toggle 
          v-model="currentVesselType" 
          @change="onVesselTypeChange"
          color="accent"
          dense
          mandatory
        >
        <v-btn small value="arterial" @click="onVesselTypeChange('arterial')">
            <v-icon left small>mdi-water</v-icon>
            Arterial
        </v-btn>
          <v-btn small value="venous" @click="onVesselTypeChange('venous')">
            <v-icon left small>mdi-heart-pulse</v-icon>
            Venous
          </v-btn>
        </v-btn-toggle>
     </div>
    
    

      <!-- Quality Toggle -->
      <div class="control-row">
        <v-btn-toggle 
          v-model="currentQuality" 
          @change="onQualityChange"
          color="accent"
          dense
          mandatory
        >
          <v-btn small value="standard">
            <v-icon left small>mdi-speedometer</v-icon>
            Standard
          </v-btn>
          <v-btn small value="high">
            <v-icon left small>mdi-quality-high</v-icon>
            High Quality
          </v-btn>
        </v-btn-toggle>
      </div>

      <!-- Pressure Color Bar -->
      <div v-if="pressureColorMapping" class="pressure-color-section">
        <div class="color-bar-title">
          <v-icon small class="mr-1">mdi-heart-pulse</v-icon>
          Blood Pressure Color Scale
        </div>
        <div class="color-bar-container">
          <div class="color-bar">
            <div 
              v-for="(sample, index) in pressureColorMapping.samples" 
              :key="index"
              class="color-segment"
              :style="{ backgroundColor: sample.color }"
              :title="`Pressure: ${formatPressure(sample.pressure)}`"
            ></div>
          </div>
          <div class="color-bar-labels">
            <span class="label-mid">Low → High</span>
          </div>
        </div>
       
      </div>

      <!-- Model Info -->
      <div class="info-section">
        <div class="info-item">
          <span class="info-label">Model:</span>
          <span class="info-value">{{ displayModelName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Rendering:</span>
          <span class="info-value">{{ renderingType }}</span>
        </div>
      </div>
    </div>

    <!-- Compact status when collapsed -->
    <div v-show="isCollapsed" class="compact-status">
      <span class="status-text">{{ getCompactStatus() }}</span>
      
    </div>

    
  </div>
</template>

<script>
export default {
  props: {
    // Model states passed from parent component
    useTubeRendering: {
      type: Boolean,
      default: true
    },
    currentPerformanceMode: {
      type: String,
      default: 'high'
    },
    modelName: {
      type: String,
      default: 'Loading...'
    },
    renderingType: {
      type: String,
      default: '3D Cylinders'
    },
    pressureColorMapping: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      isCollapsed: false,
      currentVesselType: 'arterial', // 'arterial' or 'venous'
      currentQuality: 'standard'     // 'standard' or 'high'
    };
  },

  computed: {
    displayModelName() {
      // Simplify the model name for display
      if (this.modelName.includes('Arterial')) {
        return 'Arterial Tree';
      } else if (this.modelName.includes('Venous')) {
        return 'Venous Tree';
      }
      return this.modelName;
    }
  },

  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },

    onVesselTypeChange(vesselType) {
      console.log('[PanelControls] Vessel type changed to:', vesselType);
      
      // Emit appropriate event based on vessel type and quality
      if (vesselType === 'arterial') {
        if (this.currentQuality === 'high') {
          this.$emit('load-arterial-cylinders');
        } else {
          this.$emit('reload-arterial');
        }
      } else if (vesselType === 'venous') {
        if (this.currentQuality === 'high') {
          this.$emit('load-venous-cylinders');
        } else {
          this.$emit('load-venous');
        }
      }
    },

    onQualityChange(quality) {
      console.log('[PanelControls] Quality changed to:', quality);
      
      // Emit appropriate event based on current vessel type and new quality
      if (this.currentVesselType === 'arterial') {
        if (quality === 'high') {
          this.$emit('load-arterial-cylinders');
        } else {
          this.$emit('reload-arterial');
        }
      } else if (this.currentVesselType === 'venous') {
        if (quality === 'high') {
          this.$emit('load-venous-cylinders');
        } else {
          this.$emit('load-venous');
        }
      }
    },

    getCompactStatus() {
      const vesselType = this.currentVesselType === 'arterial' ? 'Arterial Tree' : 'Venous Tree';
      const quality = this.currentQuality === 'high' ? 'High Quality' : 'Standard';
      return `${vesselType} | ${quality}`;
    },

    formatPressure(pressure) {
      // Format pressure values for display
      if (pressure >= 1000) {
        return (pressure / 1000).toFixed(1) + 'k';
      } else if (pressure >= 1) {
        return pressure.toFixed(1);
      } else {
        return pressure.toFixed(3);
      }
    }
  },

  // Events emitted to parent component:
  // - 'reload-arterial': load arterial tree (standard quality)
  // - 'load-venous': load venous tree (standard quality)
  // - 'load-arterial-cylinders': load arterial tree (high quality)
  // - 'load-venous-cylinders': load venous tree (high quality)

  beforeDestroy() {
    // Component cleanup if needed
  }
}
</script>

<style scoped lang="scss">
.control-panel {
  position: relative;
  width: 100%;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
 
  transition: all 0.3s ease;

  &.collapsed {
    min-height: 60px;
    text-align: center;
  }
  
}



.controls-content {
  padding: 20px;
  padding-top: 50px; // Make room for collapse button
  color: white;
}

.control-row {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;

  &:last-child {
    margin-bottom: 0;
  }
}

.pressure-color-section {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border-left: 4px solid #ff5722;
}

.color-bar-title {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.color-bar-container {
  margin-bottom: 8px;
}

.color-bar {
  width: 100%;
  height: 20px;
  border-radius: 10px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.color-segment {
  flex: 1;
  height: 100%;
}

.color-bar-labels {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  
}

.label-min, .label-max {
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.8);
}

.label-mid {
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

.color-bar-description {
  text-align: center;
  margin-top: 8px;
  
  small {
    color: rgba(255, 255, 255, 0.6);
    font-size: 10px;
    font-style: italic;
  }
}

.color-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
  justify-content: center;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.legend-text {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  border-left: 4px solid #00bcd4;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  font-weight: 600;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}

.compact-status {
  padding: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}

.status-text {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 2px;
}

// Custom button group styles
.v-btn-toggle {
  border-radius: 8px !important;
  
  .v-btn {
    text-transform: none !important;
    font-weight: 500 !important;
    min-width: 100px;
    
    &.v-btn--active {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
    }
  }
}

// Animation for collapse/expand
.control-panel {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  .controls-content {
    transition: opacity 0.2s ease;
  }
  
  &.collapsed .controls-content {
    opacity: 0;
  }
}
</style>
  
