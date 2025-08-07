<template>
    <img 
      :src="iconPath" 
      :class="iconClass"
      :alt="alt"
      :style="iconStyle"
    />
  </template>
  
  <script>
  export default {
    props: {
      icon: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: null
      },
      alt: {
        type: String,
        default: ''
      }
    },
    computed: {
      iconPath() {
        let path;
        // If it's an SVG path, use it directly
        if (this.icon.startsWith('/')) {
          path = this.icon;
        } else {
          // Otherwise use default icon
          path = '/img/landing/pregnancy-icon.svg';
        }
        
        // Handle GitHub Pages deployment path
        if (process.env.DEPLOY_ENV === 'GH_PAGES') {
          return `/pregnancy-app${path}`;
        }
        return path;
      },
      
      iconClass() {
        return [
          'svg-icon',
          { 'primary': this.color === 'primary' }
        ];
      },
      
      iconStyle() {
        return {
          width: this.size + 'px',
          height: this.size + 'px'
        };
      }
    }
  }
  </script>
  
  <style scoped>
  .svg-icon {
    filter: brightness(0) invert(1);
  }
  
  
  </style> 