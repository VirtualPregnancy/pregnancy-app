<template>
  <div class="pa-2">
    <div class="flexbox demo-head">
      <div>
        <h1 class="pt-2 pl-6 main-heading">
          {{ $parentTopic().heading }} 
        </h1>
      </div>
    </div>
   
    <div>
      <client-only>
        <div
          v-if="$parentTopic().content"
          class="pt-2 pt-xl-4 marked mb-8 mt-4"
        >
        {{ $parentTopic().content }}
      </div>
      
        <template #fallback>
          <div class="loading-placeholder pt-2">
            <v-skeleton-loader type="article" />
          </div>
        </template>
      </client-only>
    </div>
  </div>
</template>

<script>


export default {
  name: "Panel",

  data() {
    return {
      select: "",
      currentPanel: "",
      items: ["latest", "version 2.0", "version 1.0"],
      lastConditionData: null, // Store condition data for potential future use
      isClient: false, // Track if we're on client side
    };
  },

  methods: {
   
  

    
    
    
    
  },

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

// .primary--text {
//   // color: var(--v-secondary-base) !important;
//   // caret-color: var(--v-secondary-base) !important;
//   color: #fff;
// }
</style>
