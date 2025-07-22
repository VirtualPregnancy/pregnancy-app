<template>
  <div class="model-control">
    <!-- Model loading controls -->
    <div class="control-section">
      <h4 class="control-title">Model Controls</h4>
      <div class="control-group">
        <v-btn @click="$emit('reload-arterial')" color="primary" small class="ma-1">
          Load Arterial
        </v-btn>
        <v-btn @click="$emit('load-venous')" color="blue" small class="ma-1">
          Load Venous
        </v-btn>
      </div>
    </div>

    <!-- Rendering controls -->
    <div class="control-section">
      <h4 class="control-title">Rendering</h4>
      <div class="control-group">
        <v-btn @click="$emit('toggle-render-mode')" color="secondary" small class="ma-1">
          {{ useTubeRendering ? 'Switch to Lines' : 'Switch to Tubes' }}
        </v-btn>
      </div>
      <div class="control-group">
        <v-btn @click="$emit('cycle-performance')" color="accent" small class="ma-1">
          Performance: {{ currentPerformanceMode.toUpperCase() }}
        </v-btn>
      </div>
    </div>

    <!-- Performance info display -->
    <div class="control-section" v-if="useTubeRendering">
      <h4 class="control-title">Performance Info</h4>
      <div class="performance-info">
        <small class="performance-text">
          LOD System: Active<br>
          Batching: Enabled<br>
          Auto-adapt: {{ currentPerformanceMode === 'auto' ? 'On' : 'Off' }}<br>
          Variable Radius: Enabled
        </small>
      </div>
    </div>

    <!-- Model status display -->
    <div class="control-section">
      <h4 class="control-title">Status</h4>
      <div class="status-info">
        <small class="status-text">{{ modelName }}</small>
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
    }
  },

  // Events emitted to parent component:
  // - 'reload-arterial': reload arterial tree model
  // - 'load-venous': load venous tree model  
  // - 'toggle-render-mode': toggle between tube and line rendering
  // - 'cycle-performance': cycle through performance modes

  beforeDestroy() {
    // Component cleanup if needed
  }
}
</script>

<style scoped lang="scss">
.model-control {
  width: 100%;
  padding: 16px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  color: white;
}

.control-section {
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.control-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 4px;
}

.control-group {
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.performance-info {
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  
  .performance-text {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.3;
  }
}

.status-info {
  padding: 8px;
  background: rgba(0, 150, 255, 0.1);
  border-radius: 4px;
  border-left: 3px solid #0096ff;
  
  .status-text {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.3;
    font-weight: 500;
  }
}
</style>
  
