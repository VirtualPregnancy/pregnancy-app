<template>
  <div v-if="visible" class="global-loading-overlay">
    <div class="loading-card">
      <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
      <div class="loading-text">Loading, please wait…</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    visible: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.global-loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}

.loading-card {
  background: var(--v-background-base);
  color: var(--v-text-base);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.loading-text {
  font-weight: 600;
}
</style>

