import * as Copper from "copper3d";
import * as THREE from "three";

// Initialize these variables but don't create elements immediately
let container = null;
let baseRenderer = null;
let isInitialized = false;

// Initialize function to be called when needed
const initializeCopper = () => {
  if (isInitialized || !process.client) {
    return;
  }

  try {
    // Create container element
    container = document.createElement("div");
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.margin = 0;
    container.style.padding = 0;
    
    const guiOpen = false;
    
    // Create copper renderer
    baseRenderer = new Copper.copperRenderer(container, {
      guiOpen,
      camera: true,
      performance: true,
      alpha: true,
      logarithmicDepthBuffer: true,
      light: false,
      controls: "copper3d",
    });
    
    if (guiOpen) baseRenderer.gui.closed = true;
    baseRenderer.animate();
    
    isInitialized = true;
    console.log('[Copper] 3D engine initialized successfully');
    
  } catch (error) {
    console.error('[Copper] Failed to initialize 3D engine:', error);
    throw error;
  }
};

export default (context, inject) => {
  inject("baseRenderer", () => {
    if (!isInitialized && process.client) {
      initializeCopper();
    }
    return baseRenderer;
  }),
  inject("baseContainer", () => {
    if (!isInitialized && process.client) {
      initializeCopper();
    }
    return container;
  }),
  inject("three", () => {
    return THREE;
  }),
  inject("Copper", () => {
    return Copper;
  });
};
