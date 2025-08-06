<template>
  <div class="interactive-metrics-page">
    <div class="metrics-container">
      <!-- Header Section -->
      <div class="page-header">
        <h1 class="main-title">
          <v-icon left color="primary" size="36">mdi-chart-line</v-icon>
          Interactive Ultrasound Metrics Tool
        </h1>
        <p class="page-subtitle">
          Enter your ultrasound measurements to understand what they tell us about your pregnancy
        </p>
      </div>

      <!-- Input Panel -->
      <div class="input-panel">
        <v-card class="metrics-input-card" elevation="4">
          <v-card-title class="input-header">
            <v-icon left color="accent">mdi-form-textbox</v-icon>
            Enter Your Measurements
          </v-card-title>
          
          <v-card-text>
            <v-row>
              <!-- Gestational Age -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="metrics.gestationalAge"
                  label="Gestational Age (weeks)"
                  type="number"
                  min="6"
                  max="42"
                  outlined
                  dense
                  :rules="[rules.required, rules.gestationalAge]"
                  @input="calculateMetrics"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary">mdi-calendar</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- Biparietal Diameter -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="metrics.bpd"
                  label="Biparietal Diameter (mm)"
                  type="number"
                  min="10"
                  max="120"
                  outlined
                  dense
                  :rules="[rules.required, rules.bpd]"
                  @input="calculateMetrics"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="info">mdi-diameter</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- Head Circumference -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="metrics.hc"
                  label="Head Circumference (mm)"
                  type="number"
                  min="50"
                  max="400"
                  outlined
                  dense
                  :rules="[rules.required, rules.hc]"
                  @input="calculateMetrics"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="warning">mdi-circle-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- Abdominal Circumference -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="metrics.ac"
                  label="Abdominal Circumference (mm)"
                  type="number"
                  min="50"
                  max="450"
                  outlined
                  dense
                  :rules="[rules.required, rules.ac]"
                  @input="calculateMetrics"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="success">mdi-circle</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- Femur Length -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="metrics.fl"
                  label="Femur Length (mm)"
                  type="number"
                  min="5"
                  max="90"
                  outlined
                  dense
                  :rules="[rules.required, rules.fl]"
                  @input="calculateMetrics"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="secondary">mdi-bone</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- Estimated Fetal Weight (Optional) -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="metrics.efw"
                  label="Estimated Fetal Weight (g) - Optional"
                  type="number"
                  min="100"
                  max="6000"
                  outlined
                  dense
                  @input="calculateMetrics"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="accent">mdi-weight</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row class="mt-4">
              <v-col cols="12">
                <div class="action-buttons">
                  <v-btn 
                    color="primary" 
                    large
                    :disabled="!isFormValid"
                    @click="analyzeMetrics"
                  >
                    <v-icon left>mdi-calculator</v-icon>
                    Analyze Measurements
                  </v-btn>
                  <v-btn 
                    color="secondary" 
                    outlined
                    @click="clearForm"
                  >
                    <v-icon left>mdi-refresh</v-icon>
                    Clear All
                  </v-btn>
                  <v-btn 
                    color="success" 
                    outlined
                    @click="loadSampleData"
                  >
                    <v-icon left>mdi-file-document</v-icon>
                    Load Sample
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>

      <!-- Results Panel -->
      <div v-if="showResults" class="results-panel">
        <v-row>
          <!-- Percentile Chart -->
          <v-col cols="12" lg="6">
            <v-card class="percentile-card" elevation="4">
              <v-card-title>
                <v-icon left color="primary">mdi-chart-areaspline</v-icon>
                Growth Percentiles
              </v-card-title>
              <v-card-text>
                <div class="percentile-chart">
                  <canvas ref="percentileChart" width="400" height="300"></canvas>
                </div>
                <div class="percentile-legend">
                  <div class="legend-item">
                    <div class="legend-color normal"></div>
                    <span>Normal Range (10th-90th percentile)</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color your-baby"></div>
                    <span>Your Baby's Measurements</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 3D Model Visualization -->
          <v-col cols="12" lg="6">
            <v-card class="model-card" elevation="4">
              <v-card-title>
                <v-icon left color="accent">mdi-cube-outline</v-icon>
                3D Fetal Model
              </v-card-title>
              <v-card-text>
                <div class="model-container" ref="modelContainer">
                  <div class="model-placeholder">
                    <v-icon size="80" color="accent">mdi-baby-face</v-icon>
                    <p>3D Model Visualization</p>
                    <p class="model-info">Based on your measurements:</p>
                    <div class="model-stats">
                      <div><strong>Size:</strong> {{ fetalSize }} percentile</div>
                      <div><strong>Development:</strong> {{ developmentStage }}</div>
                    </div>
                  </div>
                </div>
                <div class="model-controls">
                  <v-btn small color="primary" @click="rotateModel">
                    <v-icon left small>mdi-rotate-3d</v-icon>
                    Rotate
                  </v-btn>
                  <v-btn small color="secondary" @click="zoomModel">
                    <v-icon left small>mdi-magnify</v-icon>
                    Zoom
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Detailed Analysis -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card class="analysis-card" elevation="4">
              <v-card-title>
                <v-icon left color="success">mdi-clipboard-text</v-icon>
                Detailed Analysis
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <div class="metric-analysis">
                      <h4>Growth Assessment</h4>
                      <div class="analysis-item" :class="getStatusClass(growthStatus)">
                        <v-icon left :color="getStatusColor(growthStatus)">
                          {{ getStatusIcon(growthStatus) }}
                        </v-icon>
                        <span>{{ growthAssessment }}</span>
                      </div>
                      <p class="analysis-description">
                        {{ growthDescription }}
                      </p>
                    </div>
                  </v-col>

                  <v-col cols="12" md="4">
                    <div class="metric-analysis">
                      <h4>Proportionality</h4>
                      <div class="analysis-item" :class="getStatusClass(proportionStatus)">
                        <v-icon left :color="getStatusColor(proportionStatus)">
                          {{ getStatusIcon(proportionStatus) }}
                        </v-icon>
                        <span>{{ proportionAssessment }}</span>
                      </div>
                      <p class="analysis-description">
                        {{ proportionDescription }}
                      </p>
                    </div>
                  </v-col>

                  <v-col cols="12" md="4">
                    <div class="metric-analysis">
                      <h4>Weight Estimation</h4>
                      <div class="analysis-item normal">
                        <v-icon left color="info">mdi-scale</v-icon>
                        <span>{{ calculatedWeight }}g ({{ weightPercentile }}%)</span>
                      </div>
                      <p class="analysis-description">
                        {{ weightDescription }}
                      </p>
                    </div>
                  </v-col>
                </v-row>

                <!-- Recommendations -->
                <div class="recommendations mt-4">
                  <h4>
                    <v-icon left color="warning">mdi-lightbulb</v-icon>
                    Recommendations
                  </h4>
                  <v-alert
                    v-for="recommendation in recommendations"
                    :key="recommendation.type"
                    :type="recommendation.type"
                    class="mb-2"
                  >
                    {{ recommendation.message }}
                  </v-alert>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InteractiveUltrasoundMetrics',
  layout: 'default',

  data() {
    return {
      metrics: {
        gestationalAge: null,
        bpd: null,
        hc: null,
        ac: null,
        fl: null,
        efw: null
      },
      
      rules: {
        required: value => !!value || 'This field is required',
        gestationalAge: value => (value >= 6 && value <= 42) || 'Must be between 6-42 weeks',
        bpd: value => (value >= 10 && value <= 120) || 'Must be between 10-120mm',
        hc: value => (value >= 50 && value <= 400) || 'Must be between 50-400mm',
        ac: value => (value >= 50 && value <= 450) || 'Must be between 50-450mm',
        fl: value => (value >= 5 && value <= 90) || 'Must be between 5-90mm'
      },

      showResults: false,
      
      // Analysis results
      fetalSize: 0,
      developmentStage: '',
      growthStatus: 'normal',
      growthAssessment: '',
      growthDescription: '',
      proportionStatus: 'normal',
      proportionAssessment: '',
      proportionDescription: '',
      calculatedWeight: 0,
      weightPercentile: 0,
      weightDescription: '',
      recommendations: []
    }
  },

  computed: {
    isFormValid() {
      return this.metrics.gestationalAge && 
             this.metrics.bpd && 
             this.metrics.hc && 
             this.metrics.ac && 
             this.metrics.fl;
    }
  },

  methods: {
    calculateMetrics() {
      if (!this.isFormValid) return;
      
      // Calculate estimated fetal weight using Hadlock formula
      const bpd = this.metrics.bpd / 10; // Convert to cm
      const hc = this.metrics.hc / 10;
      const ac = this.metrics.ac / 10;
      const fl = this.metrics.fl / 10;
      
      // Hadlock formula
      this.calculatedWeight = Math.round(
        Math.exp(
          1.5662 - 0.0108 * hc +
          0.0468 * ac + 0.171 * fl +
          0.00034 * hc * hc - 0.003685 * ac * fl
        )
      );
    },

    analyzeMetrics() {
      this.calculateMetrics();
      this.performAnalysis();
      this.showResults = true;
      this.$nextTick(() => {
        this.drawPercentileChart();
      });
    },

    performAnalysis() {
      const ga = this.metrics.gestationalAge;
      
      // Calculate percentiles (simplified calculation for demo)
      this.fetalSize = this.calculatePercentile(this.calculatedWeight, ga, 'weight');
      
      // Determine development stage
      if (ga < 14) {
        this.developmentStage = 'First Trimester';
      } else if (ga < 28) {
        this.developmentStage = 'Second Trimester';
      } else {
        this.developmentStage = 'Third Trimester';
      }

      // Growth assessment
      this.assessGrowth();
      this.assessProportions();
      this.generateRecommendations();
    },

    assessGrowth() {
      if (this.fetalSize < 10) {
        this.growthStatus = 'concern';
        this.growthAssessment = 'Below Expected Size';
        this.growthDescription = 'Your baby appears smaller than expected for gestational age. This may warrant additional monitoring.';
      } else if (this.fetalSize > 90) {
        this.growthStatus = 'warning';
        this.growthAssessment = 'Above Expected Size';
        this.growthDescription = 'Your baby appears larger than expected for gestational age. This may require special delivery planning.';
      } else {
        this.growthStatus = 'normal';
        this.growthAssessment = 'Normal Growth';
        this.growthDescription = 'Your baby is growing within the normal range for gestational age.';
      }
    },

    assessProportions() {
      // Simplified proportionality assessment
      const headToAbdomenRatio = this.metrics.hc / this.metrics.ac;
      const expectedRatio = 1.1; // Simplified expected ratio
      
      if (Math.abs(headToAbdomenRatio - expectedRatio) < 0.1) {
        this.proportionStatus = 'normal';
        this.proportionAssessment = 'Proportionate Growth';
        this.proportionDescription = 'Head and body measurements are in good proportion.';
      } else if (headToAbdomenRatio > expectedRatio + 0.1) {
        this.proportionStatus = 'warning';
        this.proportionAssessment = 'Large Head';
        this.proportionDescription = 'Head measurements are proportionally larger than body measurements.';
      } else {
        this.proportionStatus = 'warning';
        this.proportionAssessment = 'Small Head';
        this.proportionDescription = 'Head measurements are proportionally smaller than body measurements.';
      }
    },

    generateRecommendations() {
      this.recommendations = [];
      
      if (this.growthStatus === 'concern') {
        this.recommendations.push({
          type: 'warning',
          message: 'Consider additional ultrasound scans to monitor growth velocity.'
        });
        this.recommendations.push({
          type: 'info',
          message: 'Discuss nutrition and lifestyle factors with your healthcare provider.'
        });
      }
      
      if (this.growthStatus === 'warning') {
        this.recommendations.push({
          type: 'warning',
          message: 'Monitor for gestational diabetes and discuss delivery planning.'
        });
      }
      
      if (this.proportionStatus === 'warning') {
        this.recommendations.push({
          type: 'info',
          message: 'Additional detailed anatomy scan may be recommended.'
        });
      }
      
      this.recommendations.push({
        type: 'success',
        message: 'Always discuss these results with your healthcare provider for proper interpretation.'
      });
    },

    calculatePercentile(value, ga, type) {
      // Simplified percentile calculation (in real app, would use medical growth charts)
      const baseValues = {
        weight: ga * 100 - 500 // Simplified calculation
      };
      
      const percentile = Math.min(95, Math.max(5, 
        50 + (value - baseValues[type]) / baseValues[type] * 50
      ));
      
      this.weightPercentile = Math.round(percentile);
      this.weightDescription = `Your baby's estimated weight is at the ${this.weightPercentile}th percentile for ${ga} weeks.`;
      
      return Math.round(percentile);
    },

    drawPercentileChart() {
      // Simplified chart drawing (in real app, would use Chart.js or similar)
      const canvas = this.$refs.percentileChart;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw growth curve placeholder
      ctx.strokeStyle = '#6C90B9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 250);
      ctx.quadraticCurveTo(200, 150, 350, 50);
      ctx.stroke();
      
      // Mark your baby's position
      const x = (this.metrics.gestationalAge - 6) / 36 * 300 + 50;
      const y = 250 - (this.fetalSize / 100) * 200;
      
      ctx.fillStyle = '#DD3C51';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add labels
      ctx.fillStyle = '#313657';
      ctx.font = '14px Arial';
      ctx.fillText('Gestational Age (weeks)', 150, 290);
      
      ctx.save();
      ctx.translate(20, 150);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Growth Percentile', -50, 0);
      ctx.restore();
    },

    getStatusClass(status) {
      return {
        'status-normal': status === 'normal',
        'status-warning': status === 'warning',
        'status-concern': status === 'concern'
      };
    },

    getStatusColor(status) {
      switch (status) {
        case 'normal': return 'success';
        case 'warning': return 'warning';
        case 'concern': return 'error';
        default: return 'info';
      }
    },

    getStatusIcon(status) {
      switch (status) {
        case 'normal': return 'mdi-check-circle';
        case 'warning': return 'mdi-alert';
        case 'concern': return 'mdi-alert-circle';
        default: return 'mdi-information';
      }
    },

    clearForm() {
      this.metrics = {
        gestationalAge: null,
        bpd: null,
        hc: null,
        ac: null,
        fl: null,
        efw: null
      };
      this.showResults = false;
    },

    loadSampleData() {
      this.metrics = {
        gestationalAge: 32,
        bpd: 82,
        hc: 295,
        ac: 275,
        fl: 62,
        efw: 1800
      };
    },

    rotateModel() {
      // Placeholder for 3D model rotation
      console.log('Rotating 3D model...');
    },

    zoomModel() {
      // Placeholder for 3D model zoom
      console.log('Zooming 3D model...');
    }
  }
}
</script>

<style scoped lang="scss">
.interactive-metrics-page {
  background: linear-gradient(135deg, rgba(209, 199, 181, 0.05) 0%, rgba(108, 144, 185, 0.03) 100%);
  min-height: 100vh;
  padding: 20px 0;
}

.metrics-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  
  .main-title {
    color: #313657;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 15px;
    text-shadow: 0 2px 8px rgba(49, 54, 87, 0.1);
  }
  
  .page-subtitle {
    color: #1F6683;
    font-size: 1.2rem;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    font-weight: 500;
  }
}

.input-panel {
  margin-bottom: 40px;
}

.metrics-input-card {
  background: rgba(49, 54, 87, 0.95) !important;
  border: 2px solid #1F6683 !important;
  
  .input-header {
    background: rgba(31, 102, 131, 0.2);
    color: #D1C7B5 !important;
    font-weight: 700;
    border-bottom: 1px solid rgba(108, 144, 185, 0.2);
  }
  
  .v-card__text {
    color: #D1C7B5;
  }
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.results-panel {
  animation: fadeInUp 0.6s ease;
}

.percentile-card,
.model-card,
.analysis-card {
  background: rgba(49, 54, 87, 0.95) !important;
  border: 2px solid #1F6683 !important;
  
  .v-card__title {
    background: rgba(31, 102, 131, 0.2);
    color: #D1C7B5 !important;
    font-weight: 700;
    border-bottom: 1px solid rgba(108, 144, 185, 0.2);
  }
  
  .v-card__text {
    color: #D1C7B5;
  }
}

.percentile-chart {
  background: rgba(209, 199, 181, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.percentile-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .legend-item {
    display: flex;
    align-items: center;
    
    .legend-color {
      width: 20px;
      height: 4px;
      margin-right: 10px;
      border-radius: 2px;
      
      &.normal {
        background: #6C90B9;
      }
      
      &.your-baby {
        background: #DD3C51;
      }
    }
  }
}

.model-container {
  background: rgba(108, 144, 185, 0.1);
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 20px;
  text-align: center;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .model-placeholder {
    p {
      margin: 10px 0;
      font-size: 1.1rem;
      font-weight: 500;
    }
    
    .model-info {
      color: #6C90B9;
      margin-top: 20px;
    }
    
    .model-stats {
      margin-top: 15px;
      
      div {
        margin: 5px 0;
        padding: 8px 15px;
        background: rgba(31, 102, 131, 0.2);
        border-radius: 6px;
        display: inline-block;
        margin: 5px;
      }
    }
  }
}

.model-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.metric-analysis {
  background: rgba(31, 102, 131, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  
  h4 {
    color: #6C90B9;
    margin-bottom: 15px;
    font-weight: 700;
  }
  
  .analysis-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 15px;
    font-weight: 600;
    
    &.status-normal {
      background: rgba(76, 175, 80, 0.1);
      border-left: 4px solid #4CAF50;
    }
    
    &.status-warning {
      background: rgba(255, 193, 7, 0.1);
      border-left: 4px solid #FFC107;
    }
    
    &.status-concern {
      background: rgba(244, 67, 54, 0.1);
      border-left: 4px solid #F44336;
    }
    
    &.normal {
      background: rgba(33, 150, 243, 0.1);
      border-left: 4px solid #2196F3;
    }
  }
  
  .analysis-description {
    line-height: 1.6;
    opacity: 0.9;
    margin: 0;
  }
}

.recommendations {
  h4 {
    color: #6C90B9;
    margin-bottom: 20px;
    font-weight: 700;
  }
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsive design
@media (max-width: 768px) {
  .metrics-container {
    padding: 0 15px;
  }
  
  .page-header {
    .main-title {
      font-size: 2rem;
    }
    
    .page-subtitle {
      font-size: 1rem;
    }
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .model-container {
    padding: 20px;
    min-height: 200px;
  }
}

// Override Vuetify styles for dark theme
::v-deep .v-text-field {
  .v-input__control .v-input__slot {
    background: rgba(209, 199, 181, 0.1) !important;
    border-color: rgba(108, 144, 185, 0.3) !important;
  }
  
  .v-label {
    color: #D1C7B5 !important;
  }
  
  input {
    color: #D1C7B5 !important;
  }
}

::v-deep .v-alert {
  background: rgba(49, 54, 87, 0.9) !important;
  border: 1px solid rgba(108, 144, 185, 0.3) !important;
}
</style>