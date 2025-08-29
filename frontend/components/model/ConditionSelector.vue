<template>
  <v-card class="elevation-6 rounded-lg condition-selector">
    <!-- Collapsible Header -->
    <v-card-title 
      class="pb-3 pt-3 cursor-pointer hover-bg-grey header-title"
      @click="toggleExpanded"
    >
      <v-icon left color="white" size="20">mdi-medical-bag</v-icon>
      <span class="font-weight-bold header-text">Pregnancy Conditions</span>
      <v-spacer></v-spacer>
      <v-chip
        v-if="selectedCondition"
        :color="getSelectedCondition().color"
        dark
        small
        class="ml-1 header-chip"
        label
      >
        {{ selectedCondition }}
      </v-chip>
      <v-btn
        icon
        small
        @click.stop="toggleExpanded"
        class="ml-1 expand-btn"
      >
        <v-icon 
          :class="{ 'rotate-180': expanded }"
          class="transition-transform expand-icon"
          color="white"
          size="20"
        >
          mdi-chevron-down
        </v-icon>
      </v-btn>
    </v-card-title>

    <!-- Expandable Content -->
    <v-expand-transition>
      <div v-show="expanded">
        <v-divider></v-divider>
        
        <v-card-text class="pt-4">
          <v-radio-group 
            v-model="selectedCondition" 
            @change="onConditionChange"
            class="mt-0"
          >
            <v-radio
              v-for="condition in conditions"
              :key="condition.key"
              :value="condition.key"
              class="mb-3"
            >
              <template v-slot:label>
                <v-card 
                  class="ml-2 pa-4 condition-card"
                  :class="{ 'selected-condition': selectedCondition === condition.key }"
                  flat
                  outlined
                >
                  <div class="flex align-center justify-space-between">
                    <div class="flex-grow-1 mr-2">
                      <div class="condition-title mb-2">
                        {{ condition.label }}
                      </div>
                      <div class="condition-description">
                        {{ condition.description }}
                      </div>
                    </div>
                    <v-chip
                      :color="condition.color"
                      dark
                      class="condition-chip"
                      label
                    >
                      {{ condition.abbreviation }}
                    </v-chip>
                  </div>
                </v-card>
              </template>
            </v-radio>
          </v-radio-group>
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-btn
            v-if="selectedCondition"
            color="warning"
            outlined
            block
            @click="resetSelection"
            class="text-transform-none reset-btn"
          >
            <v-icon left>mdi-refresh</v-icon>
            Reset to Normal
          </v-btn>
         
        </v-card-actions>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: 'ConditionSelector',
  
  data() {
    return {
      selectedCondition: null,
      expanded: false,
      
      conditions: [
        {
          key: 'FGR',
          label: 'Fetal Growth Restriction',
          abbreviation: 'FGR',
          description: 'Reduced placental perfusion and increased resistance',
          color: 'error'
        },
        {
          key: 'GDM',
          label: 'Gestational Diabetes Mellitus',
          abbreviation: 'GDM',
          description: 'Larger placental size with normal vascular patterns',
          color: 'info'
        }
      ]
    }
  },

  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    },

    onConditionChange() {
      this.emitChange();
    },

    resetSelection() {
      this.selectedCondition = null;
      this.emitChange();
      this.$emit('reset-to-normal');
    },

    getSelectedCondition() {
      return this.conditions.find(c => c.key === this.selectedCondition) || {};
    },

    emitChange() {
      this.$emit('condition-changed', {
        selectedCondition: this.selectedCondition,
        conditionData: this.getSelectedCondition()
      });
    }
  }
}
</script>

<style scoped>

.condition-selector {
  margin-bottom: 10px;
  background-color: #34495e !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Header Styles */
.header-title {
  background-color: rgba(108, 144, 185, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-text {
  color: #ffffff !important;
  font-size: 1.1rem !important;
  letter-spacing: 0.5px;
}

.header-chip {
  font-weight: bold !important;
  letter-spacing: 0.5px;
}

.expand-btn {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-radius: 50% !important;
}

.expand-btn:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.expand-icon {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.hover-bg-grey:hover {
  background-color: rgba(108, 144, 185, 0.2) !important;
}

/* Radio Group Styles */
.v-radio >>> .v-label {
  width: 100%;
  flex: 1;
}

.v-radio >>> .v-input--selection-controls__input {
  margin-right: 16px !important;
  flex-shrink: 0;
}

.v-radio >>> .v-input--radio-group--row .v-radio {
  margin-right: 0 !important;
  width: 100% !important;
  display: flex !important;
}

.v-radio {
  width: 100% !important;
  margin-bottom: 8px !important;
}

/* White radio button circles */
.v-radio >>> .v-input--selection-controls__input .v-input--selection-controls__ripple {
  color: white !important;
}

.v-radio >>> .v-input--selection-controls__input .v-icon {
  color: white !important;
}

.v-radio >>> .v-input--selection-controls__input input:checked + .v-input--selection-controls__ripple:before {
  background-color: white !important;
}

/* Condition Card Styles */
.condition-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(184, 188, 200, 0.3) !important;
  background-color: rgba(255, 255, 255, 0.03) !important;
  border-radius: 8px !important;
  min-height: 80px;
  width: 100% !important;
  max-width: 100% !important;
  display: flex;
  align-items: center;
}

.condition-card:hover {
  border-color: rgba(108, 144, 185, 0.6) !important;
  background-color: rgba(108, 144, 185, 0.08) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.selected-condition {
  border-color: rgba(221, 60, 81, 0.8) !important;
  background-color: rgba(221, 60, 81, 0.12) !important;
  box-shadow: 0 0 0 1px rgba(221, 60, 81, 0.3), 0 4px 12px rgba(221, 60, 81, 0.2) !important;
}

/* Text Styles */
.condition-title {
  color: #ffffff !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  line-height: 1.3;
  letter-spacing: 0.3px;
}

.condition-description {
  color: rgba(255, 255, 255, 0.85) !important;
  font-size: 0.875rem !important;
  line-height: 1.4;
  font-weight: 400;
}

.condition-chip {
  font-weight: 700 !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.5px;
  min-width: 50px;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Button Styles */
.text-transform-none {
  text-transform: none !important;
}

.v-btn--outlined {
  border-width: 1px !important;
  font-weight: 500 !important;
  letter-spacing: 0.3px;
}

.v-btn--outlined:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

.reset-btn {
  background-color: rgba(255, 193, 7, 0.1) !important;
  border-color: rgba(255, 193, 7, 0.6) !important;
  color: #ffc107 !important;
}

.reset-btn:hover {
  background-color: rgba(255, 193, 7, 0.2) !important;
  border-color: #ffc107 !important;
}

/* Animation Styles */
.cursor-pointer {
  cursor: pointer;
}

.transition-transform {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.rotate-180 {
  transform: rotate(180deg);
}

.v-expand-transition-enter-active,
.v-expand-transition-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.v-expand-transition-enter,
.v-expand-transition-leave-to {
  opacity: 0;
}

/* Divider */
.v-divider {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* Card content padding adjustment */
.v-card__text {
  padding-bottom: 8px !important;
}

.v-card__actions {
  padding-top: 8px !important;
}
</style>