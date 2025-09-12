<template>
  <div class="waveform-container">
    <div class="flex  justify-between items-center mb-5">
      <div class="text-center font-weight-bold flex-1">
        {{ waveform.title }}
      </div>
      <div>
      <button 
        @click="toggleColorblindMode"
        class="ml-4 px-3 py-1 text-sm rounded-md transition-colors duration-200"
        :class="colorblindMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        :title="colorblindMode ? 'Switch to normal colors' : 'Switch to colorblind-friendly colors'"
      >
       Change color
      </button>
      </div>
    </div>
    <div ref="chart" class="waveform-chart"></div>
    
  </div>
</template>

<script>
import * as echarts from "echarts";
import modelData from '@/assets/data/modelData.json';

export default {
  props: {
    waveform: Object,
  },
  
  data() {
    return {
      chart: null,
      playheadIndex: 0,
      playheadTimer: null,
      isPlaying: false,
      speed: 1,
      waveformData: { x: [], y: [] },
      defaultWaveform: modelData.models[0].waveform,
      colorblindMode: false,
    };
  },
  
  mounted() {
    this.initChart();
    this.loadWaveformData();
    this.setupResizeHandling();
  },
  
  watch: {
    waveform: {
      handler: async function (newVal) {
        if (newVal) {
          this.isPlaying = newVal.isPlaying;
          this.speed = newVal.speed;
          await this.loadWaveformData();
          if (this.isPlaying) {
            this.startPlayheadAnimation();
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  
  methods: {
    getAssetUrl(path) {
      const base = this.$config?.basePath || '';
      return `${base}${path}`;
    },
    
    getWaveformColor(waveform, colorType = 'normal') {
      if (!waveform?.colors) {
        // Fallback colors if not defined in modelData
        const fallbackColors = {
          normal: '#4CAF50',
          colorblind: '#2196F3'
        };
        return fallbackColors[colorType] || fallbackColors.normal;
      }
      
      return this.colorblindMode ? waveform.colors.colorblind : waveform.colors.normal;
    },
    
    getDefaultWaveformColor(colorType = 'normal') {
      return this.getWaveformColor(this.defaultWaveform, colorType);
    },

    initChart() {
      if (this.chart) {
        this.chart.dispose();
      }
      this.chart = echarts.init(this.$refs.chart);
    },
    
    setupResizeHandling() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      this.resizeObserver = new ResizeObserver(() => {
        if (this.chart && !this.chart.isDisposed()) {
          this.chart.resize();
        }
      });
      this.resizeObserver.observe(this.$refs.chart);
      
      window.addEventListener("resize", () => {
        if (this.chart && !this.chart.isDisposed()) {
          this.chart.resize();
        }
      });
    },
    
    async loadWaveformData() {
      if (!this.waveform?.xDataPath || !this.waveform?.yDataPath) {
        await this.useDefaultData();
        return;
      }

      try {
        const [xResponse, yResponse] = await Promise.all([
          fetch(this.getAssetUrl(this.waveform.xDataPath)),
          fetch(this.getAssetUrl(this.waveform.yDataPath))
        ]);

        if (!xResponse.ok || !yResponse.ok) {
          throw new Error(`HTTP ${xResponse.status} ${yResponse.status}`);
        }

        const xData = this.parseXAxisCSV(await xResponse.text());
        const yData = this.parseCSV(await yResponse.text());

        if (xData.length > 0 && yData.length > 0) {
          this.waveformData = { x: xData, y: yData };
          await this.drawChart();
        } else {
          throw new Error("Empty data");
        }
      } catch (error) {
        console.warn("[Waveform] Using default data:", error.message);
        await this.useDefaultData();
      }
    },
    
    async useDefaultData() {
      this.waveformData = {
        x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        y: [0, 0.5, 1, 0.5, 0, -0.5, -1, -0.5, 0, 0.5, 1]
      };
      await this.drawChart();
    },
    
    parseCSV(csvText) {
      return csvText.trim().split('\n')
        .map(line => parseFloat(line.trim()))
        .filter(val => !isNaN(val));
    },
    
    parseXAxisCSV(csvText) {
      return csvText.trim().split('\n')
        .map(line => parseFloat(line.trim()));
    },
    
    async loadDefaultWaveformData() {
      try {
        const firstModel = modelData.models[0];
        if (firstModel.waveform.xDataPath && firstModel.waveform.yDataPath) {
          const [xResponse, yResponse] = await Promise.all([
            fetch(this.getAssetUrl(firstModel.waveform.xDataPath)),
            fetch(this.getAssetUrl(firstModel.waveform.yDataPath))
          ]);

          if (xResponse.ok && yResponse.ok) {
            const xData = this.parseXAxisCSV(await xResponse.text());
            const yData = this.parseCSV(await yResponse.text());
            
            if (xData.length > 0 && yData.length > 0) {
              return { x: xData, y: yData };
            }
          }
        }
      } catch (error) {
        console.warn("[Waveform] Failed to load default waveform data:", error.message);
      }
      
      return {
        x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        y: [0, 0.5, 1, 0.5, 0, -0.5, -1, -0.5, 0, 0.5, 1]
      };
    },
    
    async drawChart() {
      if (!this.chart || this.chart.isDisposed()) {
        this.initChart();
      }
      
      const { x, y } = this.waveformData;
      const defaultData = await this.loadDefaultWaveformData();
      const isDefaultWaveform = this.waveform?.lineTitle === this.defaultWaveform.lineTitle;
      
      this.chart.clear();
      
      const series = this.buildSeries(x, y, defaultData, isDefaultWaveform);
      const legendData = this.buildLegendData(isDefaultWaveform);
      
      this.chart.setOption({
        legend: {
          data: legendData,
          textStyle: { color: '#000' },
          top: -5,
          icon: 'rect',
        },
        xAxis: {
          type: "value",
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#000' } },
          axisLabel: { color: '#999' },
          name: this.waveform?.xAxis || 'Time',
          nameLocation: 'center',
          nameGap: 30
        },
        yAxis: {
          type: "value",
          axisLine: { lineStyle: { color: '#000' } },
          axisLabel: { color: '#999' },
          name: this.waveform?.yAxis || 'Signal'
        },
        series: series,
        dataZoom: [{ type: "inside", start: 0, end: 100 }],
        backgroundColor: "transparent",
        animation: false,
      });
      
      this.updatePlayhead();
    },
    
    buildSeries(x, y, defaultData, isDefaultWaveform) {
      const series = [];
      
      if (!isDefaultWaveform) {
        const defaultColor = this.getDefaultWaveformColor();
        const defaultColorRgba = this.hexToRgba(defaultColor, 0.8);
        const defaultAreaRgba = this.hexToRgba(defaultColor, 0.3);
        const defaultTimeOffset = this.defaultWaveform.timeOffset || 1.0;
        
        // Apply multiplicative time offset and normalize to start from 0
        const minDefaultX = Math.min(...defaultData.x);
        
        series.push({
          name: this.defaultWaveform.lineTitle,
          data: defaultData.x.map((xVal, index) => {
            const scaledX = (xVal - minDefaultX) * defaultTimeOffset;
            return [scaledX, defaultData.y[index]];
          }),
          type: "line",
          areaStyle: { color: defaultAreaRgba },
          lineStyle: { color: defaultColorRgba, width: 1 },
          symbol: 'none',
          itemStyle: { color: defaultColorRgba }
        });
      }
      
      const currentColor = this.getWaveformColor(this.waveform);
      const currentTimeOffset = this.waveform?.timeOffset || 1.0;
      
      // Apply multiplicative time offset and normalize to start from 0
      const minCurrentX = Math.min(...x);
      
      series.push({
        name: this.waveform?.lineTitle || 'Waveform',
        data: x.map((xVal, index) => {
          const scaledX = (xVal - minCurrentX) * currentTimeOffset;
          return [scaledX, y[index]];
        }),
        type: "line",
        lineStyle: { color: currentColor, width: 2 },
        symbol: 'none',
        itemStyle: { color: currentColor }
      });
      
      return series;
    },
    
    hexToRgba(hex, alpha = 1) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    
    toggleColorblindMode() {
      this.colorblindMode = !this.colorblindMode;
      // Redraw chart with new colors
      this.drawChart();
    },
    
    buildLegendData(isDefaultWaveform) {
      return isDefaultWaveform ? 
        [this.waveform?.lineTitle] : 
      [this.defaultWaveform.lineTitle, this.waveform?.lineTitle];
    },
    
    startPlayheadAnimation() {
      if (!this.isPlaying) return;
      if (this.playheadTimer) clearInterval(this.playheadTimer);

      const totalRange = this.waveformData.x.length;
      const step = Math.max(1, Math.floor(totalRange / 100));
      const interval = 25 / this.speed;

      this.playheadIndex = 0;
      this.playheadTimer = setInterval(() => {
        this.playheadIndex += step;
        if (this.playheadIndex >= totalRange) {
          this.playheadIndex = 0;
        }
        this.updatePlayhead();
      }, interval);
    },
    
    updatePlayhead() {
      if (!this.chart || this.chart.isDisposed() || this.waveformData.x.length === 0) return;

      const currentX = this.waveformData.x[this.playheadIndex];
      const coordX = this.chart.convertToPixel({ xAxisIndex: 0 }, currentX);
      
      if (coordX && coordX > 0 && this.waveform?.isPlaying) {
        this.chart.setOption({
          graphic: [{
            id: "playhead",
            type: "line",
            shape: {
              x1: coordX,
              y1: 50,
              x2: coordX,
              y2: this.chart.getHeight() - 50,
            },
            style: {
              stroke: "#DD3C51",
              lineWidth: 2,
            },
            z: 10,
          }],
        });
      }
    },
  },
  
  beforeDestroy() {
    if (this.playheadTimer) clearInterval(this.playheadTimer);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.chart && !this.chart.isDisposed()) {
      this.chart.dispose();
    }
  },
};
</script>

<style scoped lang="scss">
.waveform-container {
  width: 100%;
  height: 35dvh;
  border-radius: 8px;
  padding: 10px;
}

.waveform-chart {
  margin: 5px;
  width: 100%;
  height: 100%;
}
</style>
