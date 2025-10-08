<template>
  <v-card 
    :data-section-id="section.id"
    class="section-card elevation-2 overflow-hidden"
    :class="{ 'section-card--expanded': isExpanded }"
  >
    <!-- Section Header -->
    <v-card-title 
      class="section-header cursor-pointer"
      @click="toggleSection"
    >
      <v-icon left :color="section.iconColor" class="section-icon">{{ section.icon }}</v-icon>
      <span class="text-xl font-semibold flex-1 section-title">{{ section.title }}</span>
      <v-icon 
        :class="{ 'chevron-rotated': isExpanded }"
        class="chevron-icon"
        color="primary"
      >
        mdi-chevron-down
      </v-icon>
    </v-card-title>

    <!-- Section Content -->
    <div class="section-content" :class="{ 'section-content--expanded': isExpanded }">
      <v-card-text class="content-text">
        <!-- Use custom component if specified -->
        <component 
          v-if="section.component" 
          :is="section.component"
          v-bind="section.props || {}"
          class="space-y-6"
        />
        <!-- Fallback to HTML content -->
        <div v-else class="space-y-6" v-html="section.content">
        </div>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'MultipleSection',
  
  props: {
    section: {
      type: Object,
      required: true
    },
    isExpanded: {
      type: Boolean,
      default: false
    }
  },
  
  methods: {
    toggleSection() {
      this.$emit('toggle', this.section.id);
    }
  }
}
</script>

<style scoped lang="scss">
/* Section Cards */
.section-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-left-color: var(--v-primary-base);
}

.section-card--expanded {
  border-left-color: var(--v-secondary-base);
}

/* Section Header */
.section-header {
  background: rgba(248, 250, 252, 0.95);
  transition: all 0.3s ease;
}

.section-header:hover {
  background: rgba(243, 244, 246, 1);
  transform: translateX(4px);
}

/* Chevron Animation */
.chevron-icon {
  transition: transform 0.3s ease;
}

.chevron-rotated {
  transform: rotate(180deg);
}

/* Content Animation */
.section-content {
  max-height: 0;
  overflow: scroll;
  transition: all 0.3s ease;
  opacity: 0;
}

.section-content--expanded {
  max-height: 1000px;
  opacity: 1;
}
</style>

