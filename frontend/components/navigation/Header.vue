<template>
  <div class="page-header" v-if="showHeader">
    <div class="header-container">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">
            {{ $parentTopic().heading }}
          </h1>
          <div
            v-if="$parentTopic().content"
            class="page-description"
            v-html="$parentTopic().content"
          ></div>
        </div>

        <!-- Home Button -->
        <div v-if="mdAndUp" class="header-actions">
          <v-btn
            fab
            small
            color="primary"
            :to="homePath"
            title="Home"
            class="home-btn"
          >
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",

  data() {
    return {
      select: "",
      currentPanel: "",
      items: ["latest", "version 2.0", "version 1.0"],
      lastConditionData: null, // Store condition data for potential future use
      isClient: false, // Track if we're on client side
    };
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    showHeader() {
      // Only show header on slug pages and when we have content
      return (
        this.$route.name === "slug" &&
        (this.$parentTopic()?.heading || this.$parentTopic()?.content)
      );
    },
    homePath() {
      // Get the correct home path based on deployment environment
      const basePath = this.$config?.basePath || '';
      return basePath ? `${basePath}/` : '/';
    },
  },

  methods: {},

  mounted() {
    this.isClient = true;
  },

  created() {
    // Only run on client side to avoid SSR mismatch
    if (process.client) {
      // Client-side initialization if needed
    }
  },

  updated() {
    if (this.isClient) {
      // Client-side updates if needed
    }
  },
};
</script>

<style lang="scss" scoped>
.page-header {
  background-color: var(--v-backgroundAlt-base);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: relative !important; // Force it to scroll with content, not fixed
  top: auto !important;
  left: auto !important;
  margin: 0 !important; // Ensure no margins affect positioning
  margin-bottom: 10px !important;
  right: auto !important;
  width: auto !important;
  z-index: auto !important; // Remove any z-index that might make it appear fixed
  transform: none !important; // Remove any transforms that might affect positioning

  .header-container {
    margin: 0 auto;

    @media (max-width: 960px) {
      padding: 0 16px;
    }
  }

  .header-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  .header-text {
    flex: 1;
    min-width: 0;
  }

  .header-actions {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    padding-top: 4px;
  }

  .home-btn {
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .page-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
    line-height: 1.3;

    @media (max-width: 960px) {
      font-size: 1.5rem;
    }
  }

  .page-description {
    font-size: 0.95rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;

    @media (max-width: 960px) {
      font-size: 0.9rem;
    }
  }
}

.select {
  width: 127px;
}
.v-input__slot {
  background: #fff;
}
.theme--dark.v-list {
  // v-secondary-base
  background: rgba(34, 155, 34, 1);
}
</style>
