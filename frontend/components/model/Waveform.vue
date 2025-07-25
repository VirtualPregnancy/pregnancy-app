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
    this.chartTitle = this.waveform.title;
    this.chartData = this.waveform.data;
    this.isPlaying = this.waveform.isPlaying;
    this.speed = this.waveform.speed;
    this.drawChart();
    this.startPlayheadAnimation();
  },
  watch: {
    waveform: "drawChart",
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
    drawChart() {
      const xData = this.chartData.map((_, i) => i);

      this.chart.setOption({
        grid: { left: 0, right: 0, top: 0, bottom: 0 },
        xAxis: {
          type: "category",
          boundaryGap: false,    // ensures line aligns to edges
          data: xData,
          show: false,
        },
        yAxis: {
          type: "value",
          min: Math.min(...this.chartData) - 100,  // add margin
          max: Math.max(...this.chartData) + 100,
          show: false,
        },
       
        series: [
          {
            data: this.chartData,
            type: "line",
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 1, color: "#4A90E2" },
          },
        ],
        dataZoom: [
          {
            type: "inside", 
            xAxisIndex: 0,
            show: false,
            endValue: Math.min(100, this.chartData.length - 1),
            start: 0,
            end: 100,
            height: 15,
            bottom: 5,
            handleSize: 8,
            handleStyle: {
              color: "#4A90E2"
            },
            textStyle: {
              color: "#666"
            },
            borderColor: "#ddd",
            fillerColor: "rgba(74, 144, 226, 0.2)",
            backgroundColor: "#f5f5f5"
          },
          
        ],
        animation: false,
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
              stroke: "#A8ACAD",
              lineWidth: 1,
            },
            z: 10,
          },
        ],
        zoom: [
          {
            type: "inside",
            xAxisIndex: 0,
            show: false,
            endValue: Math.min(100, this.chartData.length - 1),
            start: 0,
            end: 100,
            height: 15,
            bottom: 5,
            handleSize: 8,
            handleStyle: {
              color: "#4A90E2"
            },
          }
        ]
      });
    },
  },
  beforeDestroy() {
    if (this.playheadTimer) clearInterval(this.playheadTimer);
  },
};
</script>
