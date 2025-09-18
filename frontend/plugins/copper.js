import * as Copper from "copper3d";
import * as THREE from "three";

// Initialize these variables but don't create elements immediately
let container = null;
let baseRenderer = null;
let isInitialized = false;

// Device detection utility
const detectDeviceType = () => {
  if (!process.client) return 'desktop';
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
  
  if (isTablet) return 'tablet';
  if (isMobile) return 'mobile';
  return 'desktop';
};

// Get touch sensitivity configuration based on device type
const getTouchSensitivityConfig = (deviceType) => {
  const baseConfig = {
    touchSensitivity: 0.5,
    rotateSpeed: 0.8,
    zoomSpeed: 0.8,
    panSpeed: 0.6,
    enableDamping: true,
    dampingFactor: 0.1,
    touchThreshold: 2,
    autoRotate: false,
    autoRotateSpeed: 0
  };

  switch (deviceType) {
    case 'mobile':
      return {
        ...baseConfig,
        touchSensitivity: 0.3,    
        rotateSpeed: 0.05,       //todo: just for testing for now
        zoomSpeed: 0.05,          
        panSpeed: 0.05,            
        dampingFactor: 0.05,      
        touchThreshold: 3         
      };
    case 'tablet':
      return {
        ...baseConfig,
        touchSensitivity: 0.4,    // sensitive
        rotateSpeed: 0.4,         // Moderate rotation speed
        zoomSpeed: 0.5,           // zoom speed
        panSpeed: 0.3,            // pan speed
        dampingFactor: 0.12,      // damping
        touchThreshold: 3       // threshold
      };
    default: // desktop
      return baseConfig;
  }
};

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
    
    // Detect device type and get appropriate touch sensitivity config
    const deviceType = detectDeviceType();
    const touchConfig = getTouchSensitivityConfig(deviceType);
    
    console.log(`[Copper] Initializing for ${deviceType} device with touch sensitivity: ${touchConfig.touchSensitivity}`);
    
    // Create copper renderer with device-specific touch sensitivity adjustments
    baseRenderer = new Copper.copperRenderer(container, {
      guiOpen,
      camera: true,
      performance: true,
      alpha: true,
      logarithmicDepthBuffer: true,
      light: false,
      controls: "copper3d",
      // Apply device-specific touch sensitivity configuration
      controlsOptions: touchConfig
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
