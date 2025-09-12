<template>
  <div class="chart-container">
    <div class="input-section">
      <div class="input-group">
        <div>
        <label for="gestationalAge">Gestational Age (11-41 Weeks):</label>
        <input 
          id="gestationalAge"
          v-model.number="userInput.week" 
          type="number" 
          min="11" 
          max="41" 
          step="0.1"
          placeholder="Enter Weeks"
        />
        </div>
        <div>
        <label for="bpdValue">BPD Value (mm):</label>
        <input 
          id="bpdValue"
          v-model.number="userInput.bpd" 
          type="number" 
          min="10" 
          max="120" 
          step="0.1"
          placeholder="Enter BPD in mm"
        />
        </div>
      </div>
      <div>
      <button @click="addUserPoint" class="check-btn">
        <v-icon left color="white" >mdi-check</v-icon>
        Check
      </button>
    </div>
    </div>
    
    <div ref="chart" class="growth-chart"></div>
    
    <div v-if="userPoint" class="conclusion-section">
      <h3>Analysis Result</h3>
      <div class="conclusion-content">
        <p><strong>Your measurement:</strong> {{ userPoint.bpd }}mm at {{ userPoint.week + 11 }} weeks</p>
        <p><strong>Percentile position:</strong> {{ userPoint.percentile }}%</p>
        <p><strong>Conclusion:</strong> {{ userPoint.conclusion }}</p>
        <p><strong>Reference values:</strong></p>
        <ul>
          <li>5th percentile: {{ userPoint.p5 }}mm</li>
          <li>50th percentile: {{ userPoint.p50 }}mm</li>
          <li>95th percentile: {{ userPoint.p95 }}mm</li>
        </ul>
      </div>
    </div>

    <!-- reference -->
    <div class="reference-section">
      <p>*Data comes from <a href="https://www.asum.com.au/wp-content/uploads/2015/09/Fetal-Measurements.pdf" target="_blank"> ASUM</a></p>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: 'PregnancyPersonalisedAssessment',
  data() {
    return {
      chart: null,
      userInput: {
        week: null,
        bpd: null
      },
      userPoint: null,
      // BPD growth data
      bpdData: {
        title: 'Biparietal Diameter (BPD)',
        unit: 'mm',
        data: {
          11: { mean: 16, sd: 2.0 },
          12: { mean: 20, sd: 4.0 },
          13: { mean: 24, sd: 4.0 },
          14: { mean: 28, sd: 4.0 },
          15: { mean: 31, sd: 4.0 },
          16: { mean: 36, sd: 5.0 },
          17: { mean: 39, sd: 5.0 },
          18: { mean: 42, sd: 4.0 },
          19: { mean: 45, sd: 5.0 },
          20: { mean: 47, sd: 4.0 },
          21: { mean: 49, sd: 4.0 },
          22: { mean: 52, sd: 5.0 },
          23: { mean: 57, sd: 5.0 },
          24: { mean: 60, sd: 6.0 },
          25: { mean: 64, sd: 6.0 },
          26: { mean: 67, sd: 4.0 },
          27: { mean: 68, sd: 5.0 },
          28: { mean: 72, sd: 4.0 },
          29: { mean: 73, sd: 4.0 },
          30: { mean: 76, sd: 4.0 },
          31: { mean: 80, sd: 6.0 },
          32: { mean: 81, sd: 4.0 },
          33: { mean: 84, sd: 6.0 },
          34: { mean: 86, sd: 6.0 },
          35: { mean: 88, sd: 6.5 },
          36: { mean: 90, sd: 6.0 },
          37: { mean: 92, sd: 6.5 },
          38: { mean: 93, sd: 6.0 },
          39: { mean: 95, sd: 8.0 },
          40: { mean: 96, sd: 8.0 },
          41: { mean: 98, sd: 8.0 }
        }
      },
      // Color scheme
      colors: {
        primary: "#DD3C51",
        secondary: "#313657", 
        tertiary: "#1F6683",
        quaternary: "#6C90B9",
        quinary: "#D1C7B5"
      }
    }
  },
  computed: {
    chartData() {
      const growthTable = [];
      
      // Generate data from week 11 to 41
      for (let week = 11; week <= 41; week++) {
        const data = this.bpdData.data[week];
        const p50 = data.mean;
        const p5 = Math.round(data.mean - 2 * data.sd);
        const p95 = Math.round(data.mean + 2 * data.sd);
        
        growthTable.push({
          week: week,
          p5: p5,
          p50: p50,
          p95: p95
        });
      }
      
      return {
        weeks: growthTable.map(item => item.week),
        p5: growthTable.map(item => item.p5),
        p50: growthTable.map(item => item.p50),
        p95: growthTable.map(item => item.p95)
      };
    }
  },
  mounted() {
    this.initChart();
    this.setupResizeHandler();
  },
  methods: {
    addUserPoint() {
      if (!this.userInput.week || !this.userInput.bpd) {
        alert('Please enter both gestational age and BPD value');
        return;
      }
      
      if (this.userInput.week < 11 || this.userInput.week > 41) {
        alert('Gestational age must be between 11 and 41 weeks');
        return;
      }
      
      // Find the closest week data
      const week = Math.round(this.userInput.week);
      const data = this.bpdData.data[week];
      
      if (!data) {
        alert('Invalid gestational age');
        return;
      }
      
      const p50 = data.mean;
      const p5 = Math.round(data.mean - 2 * data.sd);
      const p95 = Math.round(data.mean + 2 * data.sd);
      
      // Calculate percentile
      const userBPD = this.userInput.bpd;
      let percentile;
      let conclusion;
      
      if (userBPD <= p5) {
        percentile = Math.round(((userBPD - p5) / (p50 - p5)) * 25);
        conclusion = 'Below normal range (< 5th percentile)';
      } else if (userBPD <= p50) {
        percentile = Math.round(5 + ((userBPD - p5) / (p50 - p5)) * 45);
        conclusion = 'Below average (5th-50th percentile)';
      } else if (userBPD <= p95) {
        percentile = Math.round(50 + ((userBPD - p50) / (p95 - p50)) * 45);
        conclusion = 'Above average (50th-95th percentile)';
      } else {
        percentile = Math.round(95 + ((userBPD - p95) / (p95 - p50)) * 5);
        conclusion = 'Above normal range (> 95th percentile)';
      }
      
      this.userPoint = {
        week: this.userInput.week - 11,
        bpd: userBPD,
        p5: p5,
        p50: p50,
        p95: p95,
        percentile: Math.max(1, Math.min(99, percentile)),
        conclusion: conclusion
      };
      
      this.updateChart();
    },
    
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      this.drawChart();
    },
    
    drawChart() {
      const option = this.getChartOption();
      this.chart.setOption(option);
    },
    
    updateChart() {
      const option = this.getChartOption();
      this.chart.setOption(option);
    },
    
    getChartOption() {
      const series = [
        {
          name: '5th Percentile (-2SD)',
          type: 'line',
          data: this.chartData.p5,
          smooth: true,
          lineStyle: {
            width: 2,
            color: this.colors.primary
          },
          symbol: 'none'
        },
        {
          name: '50th Percentile (Mean)',
          type: 'line',
          data: this.chartData.p50,
          smooth: true,
          lineStyle: {
            width: 2,
            color: this.colors.secondary
          },
          symbol: 'none'
        },
        {
          name: '95th Percentile (+2SD)',
          type: 'line',
          data: this.chartData.p95,
          smooth: true,
          lineStyle: {
            width: 2,
            color: this.colors.tertiary
          },
          symbol: 'none'
        }
      ];
      
      // Add user point if exists
      if (this.userPoint) {
        series.push({
          name: 'Your Measurement',
          type: 'scatter',
          data: [[this.userPoint.week, this.userPoint.bpd]],
          symbolSize: 12,
          itemStyle: {
            color: this.colors.primary,
            borderColor: this.colors.secondary,
            borderWidth: 2
          },
          symbol: 'circle'
        });
      }
      
      return {
        title: {
          text: `${this.bpdData.title}`,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: this.colors.secondary
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          top: '15%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.chartData.weeks,
          name: 'Gestational Age (weeks)',
          nameLocation: 'middle',
          nameGap: 30,
          axisLabel: {
            formatter: '{value}',
            color: this.colors.secondary
          },
          axisLine: {
            lineStyle: {
              color: this.colors.quaternary
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: this.colors.quinary,
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: `${this.bpdData.title} (${this.bpdData.unit})`,
          nameLocation: 'middle',
          nameGap: 40,
          axisLabel: {
            color: this.colors.secondary
          },
          axisLine: {
            lineStyle: {
              color: this.colors.quaternary
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: this.colors.quinary,
              type: 'dashed'
            }
          }
        },
        series: series,
        legend: {
          data: ['5th Percentile (-2SD)', '50th Percentile (Mean)', '95th Percentile (+2SD)', 'Your Measurement'],
          bottom: 0,
          textStyle: {
            color: this.colors.secondary
          },
          itemStyle: {
            borderType: 'solid',
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: this.colors.quinary,
          borderColor: this.colors.quaternary,
          textStyle: {
            color: 'black'
          },
          formatter: function(params) {
            let result = `Week ${params[0].axisValue}<br/>`;
            params.forEach(param => {
              if (param.seriesName === 'Your Measurement') {
                result += `<strong>${param.seriesName}: ${param.value[1]}mm</strong><br/>`;
              } else {
                result += `${param.seriesName}: ${param.value}mm<br/>`;
              }
            });
            return result;
          }
        },
        animation: false
      };
    },
    
    setupResizeHandler() {
      const resizeObserver = new ResizeObserver(() => {
        this.chart && this.chart.resize();
      });
      resizeObserver.observe(this.$refs.chart);
      
      window.addEventListener('resize', () => {
        this.chart && this.chart.resize();
      });
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  padding: 20px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
}

.input-group {
  display: flex;
  gap: 5px;
}

.input-group label {
  font-weight: bold;
  color: #313657;
  font-size: 14px;
}

.input-group input {
  padding: 8px 12px;
  border: 2px solid #6C90B9;
  border-radius: 4px;
  font-size: 14px;
  width: 150px;
}

.input-group input:focus {
  outline: none;
  border-color: #1F6683;
  box-shadow: 0 0 5px rgba(31, 102, 131, 0.3);
}

.check-btn {
  padding: 10px 20px;
  background-color: #DD3C51;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.check-btn:hover {
  background-color: #b83243;
}

.growth-chart {
  width: 100%;
  border: 1px solid var(--v-info-base);
  height: 400px;
  margin-bottom: 20px;
}

.conclusion-section {
  background-color: #f8f9fa;
  border: 2px solid #6C90B9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.conclusion-section h3 {
  color: #313657;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
}

.conclusion-content p {
  margin: 8px 0;
  color: #313657;
  font-size: 14px;
}

.conclusion-content ul {
  margin: 10px 0;
  padding-left: 20px;
}

.conclusion-content li {
  margin: 5px 0;
  color: #313657;
  font-size: 14px;
}

@media (max-width: 768px) {
  .input-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .input-group input {
    width: 100%;
  }
  
  .growth-chart {
    height: 300px;
  }
  
  .chart-container {
    padding: 10px;
  }
}
</style>