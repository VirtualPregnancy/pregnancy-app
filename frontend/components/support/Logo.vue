<template>
  <div class="logo">
    <img :src="logoPath" alt="University of Auckland Logo" />
  </div>
</template>

<script>
export default {
  computed: {
    logoPath() {
      const basePath = this.$config.basePath || '';
      return basePath + '/img/uoa_logo.svg';
    }
  }
}
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  img {
    width: 100%;
    height: auto;
    max-height: 10dvh; 
    max-width: 20dvh; 
    object-fit: contain;
  }
}
</style>
