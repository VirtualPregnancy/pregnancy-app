<template>
  <div v-if="!isModelPage" class="weight-converter-container">
    <!-- Floating Button -->
    <button
      v-if="!showDialog"
      @click="showDialog = true"
      class="w-14 h-14 md:w-16 md:h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      title="Weight Converter"
    >
      <v-icon color="white" size="24">mdi-scale-balance</v-icon>
    </button>

    <!-- Dialog -->
    <transition name="fade">
      <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-1002" @click.self="showDialog = false" style="z-index: 1002;">
        <div class="bg-white rounded-lg shadow-2xl w-full max-w-sm transform transition-all">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Weight Converter</h3>
            <button
              @click="showDialog = false"
              class="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              <v-icon size="20">mdi-close</v-icon>
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-5 space-y-4">
            <div class="flex items-center space-x-3">
              <label class="w-12 text-sm font-medium text-gray-700">lb</label>
              <input
                v-model.number="pounds"
                type="number"
                @input="convertFromPounds"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div class="flex items-center space-x-3">
              <label class="w-12 text-sm font-medium text-gray-700">kg</label>
              <input
                v-model.number="kilograms"
                type="number"
                @input="convertFromKilograms"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getPageData } from '@/pages/_slug/pageData/pageDataLoader.js';

export default {
  name: 'WeightConverter',
  data() {
    return {
      showDialog: false,
      pounds: null,
      kilograms: null,
      converting: false,
      isModelPage: false
    }
  },
  async mounted() {
    await this.checkIfModelPage();
    this.$watch('$route', () => {
      this.checkIfModelPage();
    }, { deep: true });
  },
  methods: {
    async checkIfModelPage() {
      if (this.$route && this.$route.name === 'slug' && this.$route.params.slug) {
        try {
          const pageData = await getPageData(this.$route.params.slug);
          this.isModelPage = pageData ? pageData.showModel === true : false;
        } catch (error) {
          this.isModelPage = false;
        }
      } else {
        this.isModelPage = false;
      }
    },
    convertFromPounds() {
      if (this.converting) return
      this.converting = true
      if (this.pounds === null || this.pounds === '') {
        this.kilograms = null
      } else {
        this.kilograms = parseFloat((this.pounds * 0.453592).toFixed(2))
      }
      this.$nextTick(() => { this.converting = false })
    },
    convertFromKilograms() {
      if (this.converting) return
      this.converting = true
      if (this.kilograms === null || this.kilograms === '') {
        this.pounds = null
      } else {
        this.pounds = parseFloat((this.kilograms * 2.20462).toFixed(2))
      }
      this.$nextTick(() => { this.converting = false })
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.weight-converter-container {
  position: fixed !important;
  bottom: 80px;
  right: 20px;
  z-index: 1001 !important;
  pointer-events: none;
}

.weight-converter-container > * {
  pointer-events: auto;
}

@media (min-width: 768px) {
  .weight-converter-container {
    bottom: 80px;
    right: 24px;
  }
}

@media (max-width: 768px) {
  .weight-converter-container {
    bottom: 100px;
    right: 16px;
  }
}
</style>
