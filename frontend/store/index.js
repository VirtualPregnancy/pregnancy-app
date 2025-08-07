export const state = () => ({
  currentContent: {},
});

export const getters = {
  getCurrentContent: (state) => state.currentContent,
};

export const mutations = {
  setCurrentContent(state, newContent) {
    state.currentContent = newContent;
  },
  setChartLoaded(state, value) {
    // This mutation exists to prevent Vuex errors
    // Currently not storing chart loaded state, but can be extended if needed
  },
};
