<template>
  <div class="condition-selector">
    <!-- Header -->
      <span class="header-text">Pregnancy Complications:</span>

    <!-- Radio Group -->
    <v-card-text class="pa-2">
      <v-radio-group 
        v-model="selectedCondition" 
        @change="onConditionChange"
        class="mt-0"
      >
        <v-radio
          v-for="condition in simplifiedConditions"
          :key="condition.key"
          :value="condition.key"
        >
          <template v-slot:label>
            <div class="condition-item">
              <div class="condition-info">
                <div class="condition-title">{{ condition.label }}</div>
                <!-- <v-chip
                  :color="condition.color"
                  dark
                  small
                  class="condition-chip"
                >
                  {{ condition.abbreviation }}
                </v-chip> -->
              </div>
              <v-btn
                icon
                small
                v-if="condition.description"
                @click.stop="showDescription(condition)"
                class="info-btn"
              >
                <v-icon small>mdi-information-outline</v-icon>
              </v-btn>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </v-card-text>

    <!-- Description Dialog -->
    <v-dialog v-model="showDescriptionDialog" max-width="500">
      <v-card>
        <v-card-title class="dialog-title">
          <v-icon left color="primary">{{ selectedConditionData.icon }}</v-icon>
          {{ selectedConditionData.label }}
        </v-card-title>
        <v-card-text class="dialog-content">
          <p>{{ selectedConditionData.description }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showDescriptionDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import modelData from '~/assets/data/modelData.json'

export default {
  name: 'ConditionSelector',
  
  data() {
    return {
      defaultCondition: modelData.models[0].model,
      selectedCondition: modelData.models[0].model,
      showDescriptionDialog: false,
      selectedConditionData: {}
    }
  },
  
  computed: {
    simplifiedConditions() {
      // Only show normal, FGR, and GDM
      const allowedConditions = ['normal', 'FGR', 'GDM'];
      return modelData.models
        .filter(model => allowedConditions.includes(model.model))
        .map(model => ({
          key: model.model,
          label: model.modelName,
          abbreviation: model.model,
          description: model.Description,
          color: model.color,
          config: model.config,
          waveform: model.waveform,
          icon: this.getConditionIcon(model.model)
        }));
    }
  },

  methods: {
    getConditionIcon(conditionKey) {
      const icons = {
        'normal': 'mdi-check-circle',
        'FGR': 'mdi-alert-circle',
        'GDM': 'mdi-medical-bag'
      };
      return icons[conditionKey] || 'mdi-information';
    },

    onConditionChange() {
      this.emitChange();
    },

    showDescription(condition) {
      this.selectedConditionData = condition;
      this.showDescriptionDialog = true;
    },

    getSelectedCondition() {
      return this.simplifiedConditions.find(c => c.key === this.selectedCondition) || {};
    },

    emitChange() {
      this.$emit('conditions-changed', {
        conditionData: this.getSelectedCondition()
      });
    }
  }
}
</script>

<style scoped>
.condition-selector {
  background-color: transparent !important;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding:8px;
  border-radius: 8px;
}

/* Header Styles */
.header-title {
  background-color: transparent;
  padding: 0px 5px;
}

.header-text {
  color: #000000 !important;
  font-size: 1rem !important;
  font-weight: 600;
}

/* Radio Group Styles */
.v-radio >>> .v-label {
  width: 100%;
  flex: 1;
}

.v-radio >>> .v-input--selection-controls__input {
  margin-right: 5px !important;
  flex-shrink: 0;
}

.v-radio {
  width: 100% !important;
  margin-bottom: 2px !important;
}

/* Black radio button circles */
.v-radio >>> .v-input--selection-controls__input .v-input--selection-controls__ripple {
  color: black !important;
}

.v-radio >>> .v-input--selection-controls__input .v-icon {
  color: black !important;
}

.v-radio >>> .v-input--selection-controls__input input:checked + .v-input--selection-controls__ripple:before {
  background-color: black !important;
}

/* Condition Item Styles */
.condition-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: transparent;
  transition: all 0.2s ease;
}

.condition-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.2);
}

.condition-info {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.condition-title {
  color: #000000 !important;
  font-size: 0.9rem !important;
  font-weight: 500 !important;
}

.condition-chip {
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  min-width: 40px;
  justify-content: center;
}

.info-btn {
  background-color: rgba(0, 0, 0, 0.1) !important;
  color: black !important;
}

.info-btn:hover {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

/* Dialog Styles */
.dialog-title {
  color: #1976d2;
  font-weight: 600;
}

.dialog-content {
  color: #424242;
  line-height: 1.6;
}
</style>