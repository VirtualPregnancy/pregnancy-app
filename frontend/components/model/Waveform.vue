<template>
  <div class="waveform-container">
    <div ref="chart" style="width: 100%; height: 100px"></div>
    <div> {{chartTitle}}</div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    waveform: Object, // optional external data
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
    console.log('[Waveform] Component mounted, received waveform:', this.waveform);
    if (this.waveform && this.waveform.data && this.waveform.data.length > 0) {
      this.chartTitle = this.waveform.title;
      this.chartData = this.waveform.data;
      this.isPlaying = this.waveform.isPlaying;
      this.speed = this.waveform.speed;
      console.log('[Waveform] Initializing chart with', this.chartData.length, 'data points');
      this.drawChart();
      this.startPlayheadAnimation();
    } else {
      console.log('[Waveform] No valid waveform data provided');
    }
  },
  watch: {
    waveform: {
      handler: function(newVal) {
        console.log('[Waveform] Waveform data changed:', newVal);
        if (newVal && newVal.data && newVal.data.length > 0) {
          this.chartTitle = newVal.title;
          this.chartData = newVal.data;
          this.isPlaying = newVal.isPlaying;
          this.speed = newVal.speed;
          console.log('[Waveform] Updating chart with', this.chartData.length, 'data points');
          this.drawChart();
          this.startPlayheadAnimation();
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      chartData: [],
      chart: null,
      playheadIndex: 0,
      playheadTimer: null,
      isPlaying: false,
      chartTitle: "",
      speed: 1,
    };
  },
  methods: {
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    
    drawChart() {
      if (!this.chart || !this.chartData || this.chartData.length === 0) {
        console.log('[Waveform] Cannot draw chart - missing data or chart not initialized');
        return;
      }
      
      const xData = this.chartData.map((_, i) => i);

      this.chart.setOption({
        grid: { 
          left: 5, 
          right: 5, 
          top: 5, 
          bottom: 5,
          containLabel: false
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
          show: false,
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: { show: false }
        },
        yAxis: {
          type: "value",
          min: Math.min(...this.chartData) - Math.abs(Math.min(...this.chartData)) * 0.1,
          max: Math.max(...this.chartData) + Math.abs(Math.max(...this.chartData)) * 0.1,
          show: false,
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: { show: false }
        },
        series: [
          {
            data: this.chartData,
            type: "line",
            smooth: true,
            showSymbol: false,
            sampling: 'none', // Ensure all data points are rendered
            large: false, // Disable large mode to show all points
            lineStyle: { 
              width: 2, 
              color: "#1F6683" 
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(31, 102, 131, 0.3)'
                }, {
                  offset: 1, color: 'rgba(31, 102, 131, 0.05)'
                }]
              }
            },
            emphasis: {
              focus: 'none'
            }
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ],
        animation: false,
        backgroundColor: 'transparent'
      });
      
      // initialize playhead
      this.updatePlayhead();
    },

    startPlayheadAnimation() {
      if (!this.isPlaying) return;
      if (this.playheadTimer) clearInterval(this.playheadTimer);

      const totalPoints = this.chartData.length;
      const step = 1; // move 1 index each frame
      const interval = 3000/this.chartData.length * this.speed; // ms (~33fps)

      this.playheadIndex = 0;
      this.playheadTimer = setInterval(() => {
        this.playheadIndex += step;
        if (this.playheadIndex >= totalPoints) {
          this.playheadIndex = 0; // loop back to start
        }
        this.updatePlayhead();
      }, interval);
    },

    updatePlayhead() {
      if (!this.chart) return;

      // Convert current index -> pixel coord inside chart
      const coordX = this.chart.convertToPixel({ xAxisIndex: 0 }, this.playheadIndex);

      this.chart.setOption({
        graphic: [
          {
            id: "playhead",
            type: "line",
            shape: {
              x1: coordX,
              y1: 0,
              x2: coordX,
              y2: this.chart.getHeight(),
            },
            style: {
              stroke: "#DD3C51",
              lineWidth: 2,
            },
            z: 10,
          },
        ],
        // Remove dataZoom restrictions for full data display
      });
    },
  },
  beforeDestroy() {
    if (this.playheadTimer) clearInterval(this.playheadTimer);
  },
};
</script>
