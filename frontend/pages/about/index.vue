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
          {{ aboutUs.title }}
        </h1>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--v-accent-base);">
          {{ aboutUs.description }}
        </p>
      </div>

      <!-- Content -->
      <div class="space-y-6">
       
        <v-card class="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-accent" style="border-left-color: transparent;">
          <v-card-title class="text-xl font-semibold" style="background-color: var(--v-info-base); color: white;">
            <v-icon left style="color: white;">mdi-account-group</v-icon>
            <span>Our Team</span>
          </v-card-title>
          <v-card-text style="color: var(--v-accent-base);">
                <v-card class="mt-4" style="background-color: var(--v-background-base); " v-for="team in aboutUs.Team" :key="team.name">
                  <v-row>
                    <v-col cols="12" md="2">
                      <v-img :src="team.image" width="10vw" height="80%" class="rounded-lg mb-4 mt-4 ml-4" :alt="team.name" />
                    </v-col>
                    <v-col cols="12" md="10">
                      <v-card-title>{{ team.name }}</v-card-title>
                      <v-card-text>
                        <p style="color: grey;">{{ team.role }}</p>
                        <p>{{ team.description }}</p>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
          </v-card-text>
        </v-card>

        <v-card class="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-success" style="border-left-color: transparent;">
          <v-card-title class="text-xl font-semibold" style="background-color: var(--v-accent-base); color: white;">
            <v-icon left style="color: white;">mdi-heart</v-icon>
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
import aboutUs from './aboutUs.json';
export default {
  name: 'AboutPage',
  layout: 'empty',
  data() {
    return {
      aboutUs: aboutUs
    }
  },
  methods: {
    goHome() {
      console.log('[AboutPage] Navigating to home');
    }
  }
}
</script>

 