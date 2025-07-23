<template>
  <div class="model-control">
    <!-- Main Model Controls -->
    <div class="control-section">
      <h4 class="control-title">Vessel Models</h4>
      <div class="control-group">
        <v-btn @click="$emit('reload-arterial')" color="error" block class="mb-2">
          <v-icon left>mdi-arterial</v-icon>
          Arterial Tree
        </v-btn>
        <v-btn @click="$emit('load-venous')" color="primary" block class="mb-2">
          <v-icon left>mdi-heart-pulse</v-icon>
          Venous Tree
        </v-btn>
      </div>
    </div>

    <!-- Alternative Rendering -->
    <div class="control-section">
      <h4 class="control-title">High Quality</h4>
      <div class="control-group">
        <v-btn @click="$emit('load-arterial-cylinders')" color="error" outlined small class="mb-1 mr-1">
          <v-icon left small>mdi-tube</v-icon>
          Arterial (HQ)
        </v-btn>
        <v-btn @click="$emit('load-venous-cylinders')" color="primary" outlined small class="mb-1">
          <v-icon left small>mdi-tube</v-icon>
          Venous (HQ)
        </v-btn>
      </div>
      <div class="rendering-info">
        <small class="info-text">
          High quality mode uses more radial segments for better visual detail
        </small>
      </div>
    </div>

    <!-- Performance Controls -->
    <div class="control-section">
      <h4 class="control-title">Performance</h4>
      <div class="control-group">
        <v-btn @click="$emit('cycle-performance')" color="accent" small block>
          <v-icon left>mdi-speedometer</v-icon>
          {{ getPerformanceLabel(currentPerformanceMode) }}
        </v-btn>
      </div>
    </div>

    <!-- Model Information -->
    <div class="control-section">
      <h4 class="control-title">Model Info</h4>
      <div class="status-info">
        <div class="status-row">
          <span class="status-label">Current:</span>
          <span class="status-value">{{ modelName }}</span>
        </div>
        <div class="status-row">
          <span class="status-label">Rendering:</span>
          <span class="status-value">{{ renderingType }}</span>
        </div>
      </div>
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
    }
  },

  methods: {
    getPerformanceLabel(mode) {
      const labels = {
        'high': 'High Performance',
        'medium': 'Medium Performance',
        'low': 'Low Performance',
        'auto': 'Auto Adjust'
      };
      return labels[mode] || 'Unknown';
    }
  },

  // Events emitted to parent component:
  // - 'reload-arterial': reload arterial tree model (default 3D)
  // - 'load-venous': load venous tree model (default 3D)
  // - 'load-arterial-cylinders': load arterial tree with high-quality cylinders
  // - 'load-venous-cylinders': load venous tree with high-quality cylinders
  // - 'cycle-performance': cycle through performance modes

  beforeDestroy() {
    // Component cleanup if needed
  }
}
</script>

<style scoped lang="scss">
.model-control {
  width: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.control-section {
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.control-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.95);
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-group {
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.rendering-info {
  padding: 8px 12px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 6px;
  border-left: 3px solid #ffc107;
  margin-top: 8px;
  
  .info-text {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
    font-style: italic;
    font-size: 12px;
  }
}

.status-info {
  padding: 12px;
  background: rgba(0, 150, 255, 0.1);
  border-radius: 8px;
  border-left: 4px solid #0096ff;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.status-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 500;
  min-width: 70px;
  text-align: left;
}

.status-value {
  color: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  font-weight: 600;
  text-align: right;
  flex: 1;
  margin-left: 8px;
  word-break: break-word;
}

// Custom button styles
.v-btn {
  text-transform: none !important;
  font-weight: 500 !important;
}

.v-btn--block {
  margin: 0 !important;
}
</style>
  
