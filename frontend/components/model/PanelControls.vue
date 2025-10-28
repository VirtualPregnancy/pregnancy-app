<template>
  <div class="model-control">
    <!-- Collapse Toggle Button -->


    <!-- Collapsible Content --> 
    <div>
    <!-- Main Model Controls -->
      <div class="control-section">
        <div class="control-group">
          <div class="colored-models" style="color: black">
             <span class="header-text">Colored Models by:</span>
            <v-select
              v-model="coloredModelsBy"
              @change="$emit('colored-models-by-changed', coloredModelsBy)"
              :disabled="!renderingComplete"
              :items="colorMappingOptions"
              item-text="label"
              item-value="value"
              outlined
              dense
              class="mt-2 custom-select"
            ></v-select>
          </div>
        </div>
      </div>
      <!-- Dynamic Color Bar -->
      <div class="control-section" v-if="coloredModelsBy !== 'default'">
        <div class="color-bar-container">
          <!-- Pressure Color Bar -->
          <div v-if="coloredModelsBy === 'pressure'" class="color-bar">
            <div class="color-segment pressure-low-segment"></div>
            <div class="color-segment pressure-mid-segment"></div>
            <div class="color-segment pressure-high-segment"></div>
            <div class="color-segment pressure-max-segment"></div>
            <div class="color-segment pressure-ultra-segment"></div>
          </div>

          <!-- Flux Color Bar -->
          <div v-else-if="coloredModelsBy === 'flux'" class="color-bar">
            <div class="color-segment flux-reverse-segment"></div>
            <div class="color-segment flux-low-segment"></div>
            <div class="color-segment flux-mid-segment"></div>
            <div class="color-segment flux-high-segment"></div>
            <div class="color-segment flux-max-segment"></div>
            <div class="color-segment flux-red-high-segment"></div>
          </div>

          <div class="color-labels ">
            <span v-if="coloredModelsBy === 'pressure' || coloredModelsBy === 'flux'" class="label-left"
              >Low</span
            >
            <span v-if="coloredModelsBy === 'pressure' || coloredModelsBy === 'flux'" class="label-right"
              >High</span
            >
          </div>
        </div>
      </div>

      <!-- Default Color Legend -->
      <div class="control-section" v-if="coloredModelsBy === 'default'">
        <div class="color-bar-container">
          <div class="vessel-legend">
            <div class="legend-item">
              <div class="legend-color arterial-color"></div>
              <span class="legend-text">Placental Arterial Tree (Red)</span>
            </div>
          </div>
        </div>
      </div>

      <br />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  // Keep props for backward compatibility, but also add Vuex integration
  props: {
    renderingComplete: {
      type: Boolean,
      default: false,
    },
    waveform: { type: Array, default: () => [] }, // [{t, value}]
    currentModelSize: {
      type: Number,
      default: 200,
    },
  },
  mounted() {
    this.coloredModelsBy = "pressure";
    // Initialize modelSize with prop value
    this.modelSize = this.currentModelSize;
  },

  watch: {
    currentModelSize(newSize) {
      this.modelSize = newSize;
    },
  },

  computed: {
    ...mapGetters('model', [
      'getModelSize',
      'getCurrentColorMapping',
      'isModelReady'
    ]),
    
    // Use Vuex state as fallback if props are not provided
    effectiveModelSize() {
      return this.currentModelSize || this.getModelSize;
    },
    
    effectiveColorMapping() {
      return this.getCurrentColorMapping;
    }
  },
  
  data() {
    return {
      isCollapsed: true,
      chart: null,
      playheadTimer: null,
      coloredModelsBy: "pressure",
      modelSize: 200,
      colorMappingOptions: [
        { label: "Blood pressure", value: "pressure" },
        { label: "Blood flow", value: "flux" },
        { label: "No flow/pressure", value: "default" }
      ]
    };
  },

  methods: {
    // Toggle collapse state of the control panel
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },

    getPerformanceLabel(mode) {
      const labels = {
        high: "High Performance",
        medium: "Medium Performance",
        low: "Low Performance",
        auto: "Auto Adjust",
      };
      return labels[mode] || "Unknown";
    },
  },

  beforeDestroy() {
    if (this.playheadTimer) cancelAnimationFrame(this.playheadTimer);
    if (this.chart) this.chart.dispose();
    // Component cleanup if needed
  },
};
</script>

<style scoped lang="scss">
.header-text{
  color: #000000 !important;
  font-size: 1rem !important;
  font-weight: 600;
}
.model-control {
  position: relative;
  width: 100%;
  border-radius: 8px;
  color: black;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 10px;
}

.color-bar {
  width: 100%;
  height: 15px;
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




.legend-text {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.color-bar-container {
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.pressure-low-segment {
  background: rgb(173, 204, 83);
}

.pressure-mid-segment {
  background: rgb(250, 236, 79);
}

.pressure-high-segment {
  background: rgb(242, 183, 68);
}

.pressure-max-segment {
  background: rgb(170, 68, 47);
}

.pressure-ultra-segment {
  background: rgb(140, 41, 38);
}

// Blood flow Color Segments - Updated to match vtkLoader.js FLUX_COLORS
.flux-reverse-segment {
  background: rgb(0, 51, 204); // ZERO: Blue (0)
}

.flux-low-segment {
  background: rgb(51, 153, 255); // LOW: Light Blue (0-2.5)
}

.flux-mid-segment {
  background: rgb(0, 255, 128); // BLUE_LOW: Green (2.5-5)
}

.flux-high-segment {
  background: rgb(255, 255, 0); // MEDIUM_HIGH: Yellow (5-7.5)
}

.flux-max-segment {
  background: rgb(255, 128, 0); // HIGH: Orange (7.5-10)
}

.flux-red-high-segment {
  background: rgb(255, 0, 0); // RED_HIGH: Red (>10)
}


// No flow/pressure Color Legend
.vessel-legend {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.3);

  &.arterial-color {
    background: #ff2222; // Arterial red
  }
}

.legend-text {
  font-size: 12px;
  color: #000000;
  font-weight: 500;
}

.color-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #000000;
  font-weight: 500;

}

.label-left,
.label-right {
  flex: 1;
}

.label-left {
  text-align: left;
}

.label-right {
  text-align: right;
}




// Custom select styles
.custom-select {
  .v-input__control {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-radius: 4px !important;
  }

  .v-input__slot {
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
  }

  .v-select__selection {
    color: white !important;
  }

  .v-input__append-inner {
    color: white !important;
  }

  .v-input__append-inner .v-icon {
    color: white !important;
  }

  // Ensure dropdown menu text is white
  ::v-deep .v-list-item {
    color: white !important;
  }

  ::v-deep .v-list-item__title {
    color: white !important;
  }

  ::v-deep .v-list-item__content {
    color: white !important;
  }

  &:hover .v-input__slot {
    border-color: rgba(255, 255, 255, 0.5) !important;
  }

  &.v-input--is-focused .v-input__slot {
    border-color: #1976d2 !important;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2) !important;
  }
}

</style>
  