<template>
  <div class="min-h-screen" style="background-color: var(--v-background-base);">
    <!-- Home Button -->
    <div class="fixed top-5 right-5 z-50">
      <v-btn
        fab
        small
        color="primary"
        class="shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl"
        :to="{ path: '/' }"
        @click="goHome"
      >
        <v-icon color="#DD3C51">mdi-home</v-icon>
      </v-btn>
    </div>
    
    <div class="max-w-4xl mx-auto px-6 md:px-8 pt-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--v-primary-base);">
          About Us
        </h1>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--v-accent-base);">
          Learn more about our team and mission
        </p>
      </div>

      <!-- Content -->
      <div class="space-y-6">
        <v-card class="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-primary" style="border-left-color: transparent;">
          <v-card-title class="text-xl font-semibold" style="background-color: rgba(221, 60, 81, 0.05); color: var(--v-primary-base);">
            <v-icon left color="primary">mdi-information</v-icon>
            <span>Our Mission</span>
          </v-card-title>
          <v-card-text style="color: var(--v-accent-base);">
            <p>Content will be added here...</p>
          </v-card-text>
        </v-card>

        <v-card class="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-accent" style="border-left-color: transparent;">
          <v-card-title class="text-xl font-semibold" style="background-color: rgba(108, 144, 185, 0.05); color: var(--v-accent-base);">
            <v-icon left color="accent">mdi-account-group</v-icon>
            <span>Our Team</span>
          </v-card-title>
          <v-card-text style="color: var(--v-accent-base);">
            <p>Content will be added here...</p>
          </v-card-text>
        </v-card>

        <v-card class="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-success" style="border-left-color: transparent;">
          <v-card-title class="text-xl font-semibold" style="background-color: rgba(31, 102, 131, 0.05); color: var(--v-success-base);">
            <v-icon left color="success">mdi-heart</v-icon>
            <span>Contact</span>
          </v-card-title>
          <v-card-text style="color: var(--v-accent-base);">
            <p>Content will be added here...</p>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  layout: 'empty',
  
  methods: {
    goHome() {
      console.log('[AboutPage] Navigating to home');
    }
  }
}
</script>

 