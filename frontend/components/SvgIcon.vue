<template>
  <img 
    :src="iconPath" 
    class="svg-icon" 
    :alt="alt"
  />
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconPath() {
      // If it's an SVG path, use it directly
      if (this.icon.startsWith('/')) {
        return this.icon;
      }
      // Otherwise use default icon
      return '/img/landing/pregnancy-icon.svg';
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}
</style> 