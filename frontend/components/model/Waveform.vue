<template>
  <div class="waveform-container">
    <div ref="chart" class="waveform-chart"></div>
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
    console.log(
      "[Waveform] Component mounted, received waveform:",
      this.waveform
    );
    this.chartTitle = this.waveform.title;
    this.isPlaying = this.waveform.isPlaying;
    this.speed = this.waveform.speed;
    this.drawChart();  
     
    

    // Add resize listener for responsive behavior
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeChart();
    });
    this.resizeObserver.observe(this.$refs.chart);

    // Window resize fallback
    window.addEventListener("resize", this.resizeChart);
  },
  watch: {
    waveform: {
      handler: function (newVal) {
        console.log("[Waveform] Waveform config changed:", newVal);
        if (newVal) {
          this.chartTitle = newVal.title;
          this.isPlaying = newVal.isPlaying;
          this.speed = newVal.speed;
          console.log("[Waveform] Updating chart configuration");
          this.drawChart();
          if (this.isPlaying) {
            this.startPlayheadAnimation();
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
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
      if (!this.chart) {
        console.log("[Waveform] Chart not initialized");
        return;
      }
      this.chart.setOption({
        title: {
          text: this.chartTitle || 'Waveform Chart',
          textStyle: { color: '#ffffff', fontSize: 14 }
        },
        grid: {
          left: 40,
          right: 20,
          top: 40,
          bottom: 30,
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { color: '#999' },
          min: 0,
          max: 100
        },
        yAxis: {
          type: "value",
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { color: '#999' },
          min: -1,
          max: 1
        },
        series: [
          {
            name: "Waveform",
            data: [1,2,3,4,5,6,7,8,9,10],
            type: "line",
            lineStyle: { color: '#4CAF50', width: 2 },
            symbol: 'none'
          }
        ],
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
          },
        ],
        animation: false,
        backgroundColor: "transparent",
      });

      // Initialize playhead
      this.updatePlayhead();
    },

    startPlayheadAnimation() {
      if (!this.isPlaying) return;
      if (this.playheadTimer) clearInterval(this.playheadTimer);

      // Use fixed range for playhead movement (0-100)
      const totalRange = 100;
      const step = 1; // move 1 unit each frame
      const interval = 100; // ms for smooth movement

      this.playheadIndex = 0;
      this.playheadTimer = setInterval(() => {
        this.playheadIndex += step;
        if (this.playheadIndex >= totalRange) {
          this.playheadIndex = 0; // loop back to start
        }
        this.updatePlayhead();
      }, interval);
    },

    updatePlayhead() {
      if (!this.chart) return;

      // Convert current index -> pixel coord inside chart
      const coordX = this.chart.convertToPixel(
        { xAxisIndex: 0 },
        this.playheadIndex
      );

      // Ensure coordX is valid
      if (coordX && coordX > 0) {
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
        });
      }
    },
  },
  beforeDestroy() {
    if (this.playheadTimer) clearInterval(this.playheadTimer);

    // Clean up resize observers
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener("resize", this.resizeChart);

    // Dispose chart
    if (this.chart) {
      this.chart.dispose();
    }
  },
};
</script>

<style scoped lang="scss">

</style>
