<template>
  <div class="min-h-screen">
    <!-- Home Button -->
    <div class="fixed top-5 left-5 z-50">
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

    <!-- Hero Section with Background Image -->
    <div class="relative h-96 md:h-[400px] flex items-center justify-center">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img 
          :src="getImagePath(aboutUs.heroimage)" 
          :alt="aboutUs.heroimage"
          class="w-full h-full object-cover"
        />
        <!-- Dark Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <!-- Hero Content -->
      <div class="relative z-10 text-center text-white px-6">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          {{ aboutUs.title }}
        </h1>
        <p class="text-lg md:text-xl font-light max-w-3xl mx-auto">
          Supporting Your Pregnancy Journey Through Science and Care
        </p>
      </div>
    </div>

    <!-- Content Section -->
    <div class="bg-white py-16">
      <div class="max-w-4xl mx-auto px-6 md:px-8">
        <!-- Description -->
        <div class="text-center mb-16">
          <p class="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            {{ aboutUs.description }}
          </p>
        </div>

        <!-- Team Photos Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div 
            v-for="(photo, index) in aboutUs.team.photos" 
            :key="index"
            class="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img 
              :src="getImagePath(photo.src)" 
              :alt="photo.alt" 
              class="w-full h-80 object-cover"
            />
          </div>
        </div>

        <!-- Contributors and Contact Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contributors -->
          <div>
            <h3 class="text-2xl font-bold mb-6" style="color: var(--v-primary-base);">
              {{ aboutUs.contributors.title }}
            </h3>
            <div class="space-y-3">
              <div 
                v-for="(member, index) in aboutUs.contributors.members" 
                :key="index"
                class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                
              >
              <!-- @click="navigateToMember(member.link)" -->
              <v-icon color="#DD3C51" size="16">mdi-account</v-icon>
                <span class="text-gray-700 font-medium">{{ member.name }} <span class="italic" v-if="member.role">- {{ member.role }}</span></span>
                
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-2xl font-bold mb-6" style="color: var(--v-primary-base);">
              {{ aboutUs.contact.title }}
            </h3>
            <p class="text-gray-600 mb-6">
              {{ aboutUs.contact.description }}
            </p>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <v-icon color="#DD3C51" size="16">mdi-web</v-icon>
                <a :href="`${aboutUs.contact.website}`" class="text-blue-600 hover:text-blue-800 transition-colors">
                  Pregnancy Health Group
                </a>
              </div>
              <div class="flex items-start space-x-3">
                <v-icon color="#DD3C51" size="16">mdi-map-marker</v-icon>
                <span class="text-gray-700">{{ aboutUs.contact.institution }}</span>
              </div>
              <div class="flex items-start space-x-3">
                <v-icon color="#DD3C51" size="16">mdi-office-building</v-icon>
                <span class="text-gray-700">{{ aboutUs.contact.address }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Logo -->
        <div class="text-center mt-16">
          <Logo />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import aboutUs from './aboutUs.json';
import Logo from '@/components/Logo.vue';
export default {
  name: 'AboutPage',
  components: {
    Logo
  },
  layout: 'empty',
  data() {
    return {
      aboutUs: aboutUs
    }
  },
  methods: {
    goHome() {
      console.log('[AboutPage] Navigating to home');
    },
    navigateToMember(link) {
      window.open(link, '_blank');
    },
    getImagePath(imagePath) {
      const basePath = this.$config.basePath || '';
      // Ensure we don't double-add the base path
      const cleanPath = imagePath.replace(/^\/pregnancy-app/, '');
      return basePath + cleanPath;
    },
  }
}
</script>
 

