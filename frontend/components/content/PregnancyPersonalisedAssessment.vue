<template>
  <div class="assessment-container">
    <v-card class="mx-auto" max-width="600" elevation="2">
      <v-card-title class="primary white--text">
        <v-icon left color="white">mdi-clipboard-check</v-icon>
        Pregnancy Assessment
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form v-model="valid">
          <!-- Week Selection -->
          <v-select
            v-model="selectedWeek"
            :items="weekOptions"
            label="Current pregnancy week"
            outlined
            prepend-icon="mdi-calendar"
            class="mb-3"
          ></v-select>

          <!-- Symptoms Checklist -->
          <v-subheader>Current symptoms:</v-subheader>
          <v-checkbox
            v-for="symptom in symptoms"
            :key="symptom.value"
            v-model="selectedSymptoms"
            :value="symptom.value"
            :label="symptom.text"
            color="primary"
          ></v-checkbox>

          <!-- Risk Level Display -->
          <v-alert
            :type="riskLevel.type"
            :icon="riskLevel.icon"
            class="mt-4"
          >
            <strong>{{ riskLevel.title }}</strong>
            <div>{{ riskLevel.message }}</div>
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="generateReport"
          :disabled="!selectedWeek"
        >
          Generate Report
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Results Dialog -->
    <v-dialog v-model="showResults" max-width="500">
      <v-card>
        <v-card-title class="secondary white--text">
          Assessment Results
        </v-card-title>
        <v-card-text class="pa-4">
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">mdi-calendar</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Week {{ selectedWeek }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">mdi-format-list-checks</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ selectedSymptoms.length }} symptoms reported</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showResults = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'PregnancyPersonalisedAssessment',
  data() {
    return {
      valid: false,
      selectedWeek: null,
      selectedSymptoms: [],
      showResults: false,
      weekOptions: Array.from({length: 40}, (_, i) => ({
        text: `Week ${i + 1}`,
        value: i + 1
      })),
      symptoms: [
        { text: 'Morning sickness', value: 'morning_sickness' },
        { text: 'Fatigue', value: 'fatigue' },
        { text: 'Back pain', value: 'back_pain' },
        { text: 'Swelling', value: 'swelling' },
        { text: 'Headaches', value: 'headaches' }
      ]
    }
  },
  computed: {
    riskLevel() {
      if (!this.selectedWeek) {
        return {
          type: 'info',
          icon: 'mdi-information',
          title: 'Assessment Needed',
          message: 'Please select your current pregnancy week to begin assessment.'
        }
      }
      
      if (this.selectedSymptoms.length === 0) {
        return {
          type: 'success',
          icon: 'mdi-check-circle',
          title: 'Low Risk',
          message: 'No concerning symptoms reported. Continue regular prenatal care.'
        }
      } else if (this.selectedSymptoms.length <= 2) {
        return {
          type: 'warning',
          icon: 'mdi-alert',
          title: 'Moderate Risk',
          message: 'Some symptoms present. Consider discussing with your healthcare provider.'
        }
      } else {
        return {
          type: 'error',
          icon: 'mdi-alert-circle',
          title: 'Higher Risk',
          message: 'Multiple symptoms reported. Please consult your healthcare provider soon.'
        }
      }
    }
  },
  methods: {
    generateReport() {
      this.showResults = true
    }
  }
}
</script>

<style scoped>
.assessment-container {
  padding: 20px;
}
</style>
