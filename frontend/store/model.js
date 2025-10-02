// 3D Model State Management Module
// Centralized state management for all 3D model related data and operations

import modelData from '@/assets/data/modelData.json';

export const state = () => ({
  // Rendering configuration
  useTubeRendering: true,
  currentPerformanceMode: "high",
  
  // Model identification and configuration
  modelName: "Loading...",
  modelConfig: modelData.models[0].config, // Initialize with healthy model config
  
  // Color mapping and visualization
  pressureColorMapping: null,
  pressureMapping: true,
  colorMappingType: 'pressure', // 'pressure', 'flux', 'default'
  
  // Loading and rendering states
  isLoading: false,
  loadingComplete: false,
  renderingComplete: false,
  
  // Model display properties
  modelSize: 200,
  
  // Waveform data
  waveformData: modelData.models[0].waveform,
  
  // 3D engine instances (will be set by components)
  engineInstances: {
    copper: null,
    three: null,
    baseRenderer: null,
    vtkLoader: null,
    scene: null
  },
  
  // UI state
  showHelpDialog: false,
  controlsPanelCollapsed: true,
  
  // Error handling
  lastError: null,
  errorCount: 0
});

export const getters = {
  // Basic getters
  getModelName: (state) => state.modelName,
  getModelConfig: (state) => state.modelConfig,
  getModelSize: (state) => state.modelSize,
  getWaveformData: (state) => state.waveformData,
  
  // State checkers
  isModelLoading: (state) => state.isLoading,
  isModelReady: (state) => state.loadingComplete && state.renderingComplete,
  isEngineReady: (state) => {
    const { copper, three, baseRenderer } = state.engineInstances;
    return !!(copper && three && baseRenderer);
  },
  
  // Color mapping getters
  getCurrentColorMapping: (state) => state.colorMappingType,
  getPressureColorMapping: (state) => state.pressureColorMapping,
  
  // Combined state for components
  getModelStates: (state) => ({
    useTubeRendering: state.useTubeRendering,
    currentPerformanceMode: state.currentPerformanceMode,
    modelName: state.modelName,
    modelConfig: state.modelConfig,
    pressureColorMapping: state.pressureColorMapping,
    pressureMapping: state.pressureMapping,
    isLoading: state.isLoading,
    loadingComplete: state.loadingComplete,
    colorMappingType: state.colorMappingType,
    renderingComplete: state.renderingComplete,
    modelSize: state.modelSize
  }),
  
  // Error state
  hasErrors: (state) => state.lastError !== null,
  getLastError: (state) => state.lastError
};

export const mutations = {
  // Model configuration mutations
  SET_MODEL_NAME(state, name) {
    state.modelName = name;
  },
  
  SET_MODEL_CONFIG(state, config) {
    state.modelConfig = config;
  },
  
  SET_MODEL_SIZE(state, size) {
    state.modelSize = size;
  },
  
  // Rendering configuration mutations
  SET_TUBE_RENDERING(state, useTube) {
    state.useTubeRendering = useTube;
  },
  
  SET_PERFORMANCE_MODE(state, mode) {
    state.currentPerformanceMode = mode;
  },
  
  // Color mapping mutations
  SET_COLOR_MAPPING_TYPE(state, type) {
    state.colorMappingType = type;
  },
  
  SET_PRESSURE_COLOR_MAPPING(state, mapping) {
    state.pressureColorMapping = mapping;
  },
  
  SET_PRESSURE_MAPPING(state, enabled) {
    state.pressureMapping = enabled;
  },
  
  // Loading state mutations
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  
  SET_LOADING_COMPLETE(state, complete) {
    state.loadingComplete = complete;
  },
  
  SET_RENDERING_COMPLETE(state, complete) {
    state.renderingComplete = complete;
  },
  
  // Waveform data mutations
  SET_WAVEFORM_DATA(state, data) {
    state.waveformData = data;
  },
  
  // Engine instances mutations
  SET_ENGINE_INSTANCE(state, { key, instance }) {
    state.engineInstances[key] = instance;
  },
  
  CLEAR_ENGINE_INSTANCES(state) {
    Object.keys(state.engineInstances).forEach(key => {
      state.engineInstances[key] = null;
    });
  },
  
  // UI state mutations
  SET_HELP_DIALOG(state, show) {
    state.showHelpDialog = show;
  },
  
  SET_CONTROLS_PANEL_COLLAPSED(state, collapsed) {
    state.controlsPanelCollapsed = collapsed;
  },
  
  // Batch update for multiple states
  UPDATE_MODEL_STATES(state, updates) {
    Object.keys(updates).forEach(key => {
      if (state.hasOwnProperty(key)) {
        state[key] = updates[key];
      }
    });
  },
  
  // Error handling mutations
  SET_ERROR(state, error) {
    state.lastError = error;
    state.errorCount += 1;
  },
  
  CLEAR_ERROR(state) {
    state.lastError = null;
  },
  
  // Reset mutations
  RESET_MODEL_STATE(state) {
    // Reset to initial values while preserving engine instances
    const engineInstances = { ...state.engineInstances };
    
    Object.assign(state, {
      useTubeRendering: true,
      currentPerformanceMode: "high",
      modelName: "Loading...",
      modelConfig: modelData.models[0].config,
      pressureColorMapping: null,
      pressureMapping: true,
      colorMappingType: 'pressure',
      isLoading: false,
      loadingComplete: false,
      renderingComplete: false,
      modelSize: 200,
      waveformData: modelData.models[0].waveform,
      showHelpDialog: false,
      controlsPanelCollapsed: true,
      lastError: null,
      errorCount: 0,
      engineInstances // Preserve engine instances
    });
  }
};

export const actions = {
  // Initialize 3D engine instances
  async initializeEngine({ commit, state }, { copper, three, baseRenderer }) {
    try {
      commit('SET_ENGINE_INSTANCE', { key: 'copper', instance: copper });
      commit('SET_ENGINE_INSTANCE', { key: 'three', instance: three });
      commit('SET_ENGINE_INSTANCE', { key: 'baseRenderer', instance: baseRenderer });
      
      return true;
    } catch (error) {
      commit('SET_ERROR', `Failed to initialize 3D engine: ${error.message}`);
      return false;
    }
  },
  
  // Load a new model configuration
  async loadModel({ commit, state, getters }, { modelConfig, waveformData }) {
    commit('SET_LOADING', true);
    commit('SET_RENDERING_COMPLETE', false);
    commit('CLEAR_ERROR');
    
    try {
      commit('SET_MODEL_CONFIG', modelConfig);
      if (waveformData) {
        commit('SET_WAVEFORM_DATA', waveformData);
      }
      
      // Update model name based on config
      const modelName = modelConfig.name || "Placental Arterial Tree";
      commit('SET_MODEL_NAME', modelName);
      
      commit('SET_LOADING_COMPLETE', true);
      return true;
    } catch (error) {
      commit('SET_ERROR', `Failed to load model: ${error.message}`);
      commit('SET_LOADING', false);
      return false;
    }
  },
  
  // Update color mapping
  async updateColorMapping({ commit, state }, colorMappingType) {
    try {
      commit('SET_COLOR_MAPPING_TYPE', colorMappingType);
      
      // Update pressure mapping state based on type
      const pressureMapping = colorMappingType !== 'default';
      commit('SET_PRESSURE_MAPPING', pressureMapping);
      
      return true;
    } catch (error) {
      commit('SET_ERROR', `Failed to update color mapping: ${error.message}`);
      return false;
    }
  },
  
  // Handle model size changes
  async updateModelSize({ commit, state }, newSize) {
    try {
      commit('SET_MODEL_SIZE', newSize);
      return true;
    } catch (error) {
      commit('SET_ERROR', `Failed to update model size: ${error.message}`);
      return false;
    }
  },
  
  // Handle rendering completion
  async setRenderingComplete({ commit, dispatch }) {
    commit('SET_RENDERING_COMPLETE', true);
    commit('SET_LOADING', false);
    
    // Emit global event to hide loading overlay
    try {
      if (this.$nuxt) {
        this.$nuxt.$emit('global-loading', false);
      }
    } catch (error) {
      // Silent fail for global event
    }
  },
  
  // Handle condition updates from pregnancy tool
  async updateConditions({ commit, dispatch }, conditionData) {
    try {
      // Find matching model configuration based on conditions
      const matchingModel = modelData.models.find(model => {
        // Logic to match conditions with model configurations
        return model.conditions && 
               Object.keys(conditionData).every(key => 
                 model.conditions[key] === conditionData[key]
               );
      }) || modelData.models[0]; // Fallback to default
      
      await dispatch('loadModel', {
        modelConfig: matchingModel.config,
        waveformData: matchingModel.waveform
      });
      
      return true;
    } catch (error) {
      commit('SET_ERROR', `Failed to update conditions: ${error.message}`);
      return false;
    }
  },
  
  // Reset model to default state
  async resetToDefault({ commit, dispatch, state }) {
    try {
      const defaultConfig = modelData.models[0].config;
      const defaultWaveform = modelData.models[0].waveform;
      
      await dispatch('loadModel', {
        modelConfig: defaultConfig,
        waveformData: defaultWaveform
      });
      
      commit('SET_MODEL_SIZE', 200);
      commit('SET_COLOR_MAPPING_TYPE', 'pressure');
      
      return true;
    } catch (error) {
      commit('SET_ERROR', `Failed to reset model: ${error.message}`);
      return false;
    }
  },
  
  // Cleanup when component is destroyed
  async cleanup({ commit }) {
    commit('CLEAR_ENGINE_INSTANCES');
    commit('CLEAR_ERROR');
  }
};
