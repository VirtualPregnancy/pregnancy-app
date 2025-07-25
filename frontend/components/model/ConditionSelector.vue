<template>
  <div class="condition-control">
    <!-- Collapse Toggle Button -->
    <div class="collapse-header" @click="toggleCollapse">
      <h3 class="panel-title">
        <v-icon left>mdi-medical-bag</v-icon>
        {{ textContent.panelTitle }}
      </h3>
      <v-btn icon small class="collapse-btn">
        <v-icon>{{ isCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
      </v-btn>
    </div>

    <!-- Collapsible Content -->
    <div v-show="!isCollapsed" class="panel-content">
      <!-- Condition Selector -->
      <div class="control-section">
        <h4 class="control-title">{{ textContent.controlTitles.selectConditions }}</h4>
        <div class="control-group">
          <v-select
            v-model="selectedConditions"
            :items="pregnancyConditions"
            item-text="label"
            item-value="key"
            label="Current Conditions"
            multiple
            outlined
            dense
            dark
            clearable
            @change="updateVisualization"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip
                v-if="index < 2"
                :key="item.key"
                :color="item.severity"
                dark
                small
                close
                @click:close="removeCondition(item.key)"
              >
                {{ item.abbreviation }}
              </v-chip>
              <span
                v-if="index === 2"
                class="grey--text caption"
              >
                (+{{ selectedConditions.length - 2 }} others)
              </span>
            </template>
          </v-select>
        </div>
      </div>

      <!-- Selected Conditions Display (Simple) -->
      <div v-if="selectedConditions.length > 0" class="control-section">
        <h4 class="control-title">Selected Conditions</h4>
        <div class="selected-conditions">
          <v-chip 
            v-for="condition in getSelectedConditionDetails()" 
            :key="condition.key"
            :color="condition.severity" 
            dark 
            small 
            class="mr-2 mb-1"
          >
            {{ condition.abbreviation }}
          </v-chip>
        </div>
      </div>

      <!-- Visualization Controls -->
      <div class="control-section">
        <h4 class="control-title">Model Visualization</h4>
        <div class="control-group">
          <v-btn 
            @click="triggerVisualization" 
            :disabled="selectedConditions.length === 0"
            color="secondary" 
            block 
            class="mb-2"
          >
            <v-icon left>mdi-eye</v-icon>
            Visualize Changes
          </v-btn>
          <v-btn 
            @click="resetToNormal" 
            color="success" 
            block 
            class="mb-2"
          >
            <v-icon left>mdi-restore</v-icon>
            Normal Placenta
          </v-btn>
        </div>
      </div>

      <!-- Status Information -->
      <div class="control-section">
        <h4 class="control-title">Status</h4>
        <div class="status-info">
          <div class="status-row">
            <span class="status-label">Active Conditions:</span>
            <span class="status-value">{{ selectedConditions.length }}</span>
          </div>
          <div class="status-row">
            <span class="status-label">Model State:</span>
            <span class="status-value">{{ visualizationStatus }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConditionSelector',
  
  data() {
    return {
      isCollapsed: true,
      selectedConditions: [],
      visualizationStatus: 'Normal',
      
      // Text content data
      textContent: {
        panelTitle: 'Pregnancy Conditions',
        controlTitles: {
          selectConditions: 'Select Conditions',
          selectedConditions: 'Selected Conditions',
          modelVisualization: 'Model Visualization',
          status: 'Status'
        },
        labels: {
          currentConditions: 'Current Conditions',
          visualizeChanges: 'Visualize Changes',
          normalPlacenta: 'Normal Placenta'
        },
        statusLabels: {
          activeConditions: 'Active Conditions:',
          modelState: 'Model State:'
        }
      },
      
      pregnancyConditions: [
        {
          key: 'sga',
          label: 'Small for Gestational Age (SGA)',
          abbreviation: 'SGA',
          severity: 'warning',
          placentalEffect: 'Smaller placental size with increased resistance patterns',
        },
        {
          key: 'fgr',
          label: 'Fetal Growth Restriction (FGR)',
          abbreviation: 'FGR',
          severity: 'error',
          placentalEffect: 'Reduced placental perfusion and increased resistance indices',
        },
        {
          key: 'pe',
          label: 'Preeclampsia (PE)',
          abbreviation: 'PE',
          severity: 'error',
          placentalEffect: 'Increased uterine artery resistance and notching',
        },
        {
          key: 'sga_pe',
          label: 'Small Baby with Preeclampsia',
          abbreviation: 'SGA+PE',
          severity: 'error',
          placentalEffect: 'Combined effects: smaller placenta with severely compromised blood flow',
        },
        {
          key: 'gdm',
          label: 'Gestational Diabetes Mellitus (GDM)',
          abbreviation: 'GDM',
          severity: 'info',
          placentalEffect: 'Larger placental size but typically normal vascular patterns',
        },
        {
          key: 'iugr',
          label: 'Intrauterine Growth Restriction (IUGR)',
          abbreviation: 'IUGR',
          severity: 'error',
          placentalEffect: 'Compromised placental function with abnormal Doppler patterns',
        },
        {
          key: 'normal',
          label: 'Normal Pregnancy',
          abbreviation: 'Normal',
          severity: 'success',
          placentalEffect: 'Normal placental size and vascular patterns expected',
        }
      ]
    }
  },

  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      
      // Emit panel state events for parent component to handle layout adjustments
      if (this.isCollapsed) {
        this.$emit('panel-collapsed');
      } else {
        this.$emit('panel-expanded');
      }
    },

    updateVisualization() {
      if (this.selectedConditions.length > 0) {
        const conditionNames = this.getSelectedConditionDetails()
          .map(c => c.abbreviation)
          .join(', ');
        this.visualizationStatus = conditionNames;
      } else {
        this.visualizationStatus = 'Normal';
      }

      // Emit event for parent components
      this.$emit('conditions-changed', {
        selectedConditions: this.selectedConditions,
        conditionDetails: this.getSelectedConditionDetails(),
        combinedEffect: this.getCombinedEffectDescription()
      });
    },

    removeCondition(conditionKey) {
      this.selectedConditions = this.selectedConditions.filter(key => key !== conditionKey);
      this.updateVisualization();
    },

    getSelectedConditionDetails() {
      return this.selectedConditions.map(key => 
        this.pregnancyConditions.find(condition => condition.key === key)
      ).filter(Boolean);
    },

    getCombinedEffectSeverity() {
      const selectedDetails = this.getSelectedConditionDetails();
      const hasError = selectedDetails.some(c => c.severity === 'error');
      const hasWarning = selectedDetails.some(c => c.severity === 'warning');
      
      if (hasError) return 'error';
      if (hasWarning) return 'warning';
      return 'info';
    },

    getCombinedEffectDescription() {
      const selectedDetails = this.getSelectedConditionDetails();
      
      if (selectedDetails.length === 0) return '';
      
      if (selectedDetails.length === 1) {
        return selectedDetails[0].placentalEffect;
      }
      
      // Analyze combined effects
      const hasGrowthRestriction = selectedDetails.some(c => 
        ['sga', 'fgr', 'iugr'].includes(c.key)
      );
      const hasPreeclampsia = selectedDetails.some(c => 
        ['pe', 'sga_pe'].includes(c.key)
      );
      const hasDiabetes = selectedDetails.some(c => c.key === 'gdm');
      
      if (hasGrowthRestriction && hasPreeclampsia) {
        return 'Severe placental compromise with markedly increased resistance and reduced size';
      } else if (hasGrowthRestriction && hasDiabetes) {
        return 'Conflicting effects: diabetes may increase size while growth restriction reduces it';
      } else if (hasPreeclampsia) {
        return 'Significant vascular compromise with increased resistance patterns';
      } else if (hasGrowthRestriction) {
        return 'Reduced placental function with compromised blood flow patterns';
      } else {
        return 'Multiple conditions present - effects may vary based on severity and timing';
      }
    },

    triggerVisualization() {
      const conditionData = {
        selectedConditions: this.selectedConditions,
        conditionDetails: this.getSelectedConditionDetails(),
        combinedEffect: this.getCombinedEffectDescription(),
      };
      
      this.$emit('trigger-visualization', conditionData);
      console.log('[ConditionSelector] Visualization triggered:', conditionData);
    },

    resetToNormal() {
      this.selectedConditions = [];
      this.visualizationStatus = 'Normal';
      this.updateVisualization();
      this.$emit('reset-to-normal');
    }
  }
}
</script>

<style scoped lang="scss">
.condition-control {
  position: relative;
  width: 100%;
  background: rgba(49, 54, 87, 0.9);
  border-radius: 12px;
  color: #D1C7B5;
  box-shadow: 0 4px 20px rgba(31, 102, 131, 0.3);
  border: 2px solid #1F6683;
  overflow: hidden;
  margin-bottom: 16px;
}

.collapse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

.panel-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #D1C7B5;
  display: flex;
  align-items: center;
}

.collapse-btn {
  transition: transform 0.2s ease;
}

.panel-content {
  padding: 20px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.control-section {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.control-title {
  color: #6C90B9;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-group {
  margin-bottom: 8px;
}

.selected-conditions {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.status-info {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.status-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-value {
  color: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  font-weight: 600;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}

// Custom button styles
.v-btn {
  text-transform: none !important;
  font-weight: 500 !important;
}

// Custom select styles for dark theme
::v-deep .v-select {
  .v-input__control .v-input__slot {
    background: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
  }
  
  .v-label {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  
  .v-input__icon {
    color: rgba(255, 255, 255, 0.7) !important;
  }
}

::v-deep .v-chip {
  margin: 2px !important;
}
</style>