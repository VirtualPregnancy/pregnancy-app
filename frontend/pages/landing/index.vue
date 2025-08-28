<template>
  <v-app :class="mdAndUp ? 'landing-page' : 'landing-page-md'">
    <!-- Hamburger Menu Icon -->
    <div class="hamburger-menu fixed top-5 left-5 z-50">
      <Menu />
    </div>
    
    <!-- Three Column Layout -->
    <div class="landing-container">
      <div class="landing-row">
        
        <!-- Left Column - Title and Content -->
        <div class="column left-column">
          <div class="column-content">
            <div class="mb-4">
              <Logo />
            </div>
            <h1 class="main-title">
              Pregnancy is an exciting time!
            </h1>
            <p class="intro-text">
              Nau mai, haere mai! Whether you're experiencing a smooth pregnancy or navigating unexpected challenges, this app is here to support you and your whānau every step of the way. Designed especially for people in Aotearoa New Zealand, we offer trusted information, helpful tools, and guidance to help you understand your health and make confident decisions.

            </p>
          </div>
        </div>

        <!-- Cards Columns -->
        <div 
          v-for="(columnItems, columnIndex) in cardColumns" 
          :key="columnIndex"
          class="column cards-column"
        >
          <div class="column-content">
            <div class="cards-container">
              <div 
                v-for="item in columnItems" 
                :key="item.title"
                class="card-item"
                :style="{ backgroundColor: item.backgroundColor }"
                @click="navigateToPage(item.link)"
              >
                <div class="card-icon">
                  <img 
                    :src="item.image" 
                    :alt="item.title"
                    @error="onImageError"
                  />
                </div>
                <div class="card-content">
                  <h3 class="card-title">{{ item.title }}</h3>
                  <p class="card-description">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        

      </div>
    </div>
  </v-app>
</template>

<script>
import landingPageData from '@/assets/data/landingPageData';
import Menu from '@/components/landing/Menu.vue';
import Logo from '@/components/Logo.vue';
export default {
  layout: 'empty',
  components: {
    Menu,
    Logo
  },
  
  computed: {
    cardColumns() {
      const processedItems = landingPageData.items.map(item => ({
        ...item,
        image: this.getImagePath(item.image)
      }));
      
      // Split into two columns: [0,1,2] and [3,4,5]
      const middleColumn = processedItems.filter(item => item.index <= 2);
      const rightColumn = processedItems.filter(item => item.index > 2);
      
      return [middleColumn, rightColumn];
    },
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    
  },
  
  methods: {
    navigateToPage(link) {
      if (link) {
        this.$router.push(link);
      }
    },
    
    getImagePath(imagePath) {
      const basePath = this.$config.basePath || '';
      // Ensure we don't double-add the base path
      const cleanPath = imagePath.replace(/^\/pregnancy-app/, '');
      return basePath + cleanPath;
    },
    
    forceImageReload() {
      // Force recomputation of computed properties
      this.$forceUpdate();
      
      // Add a small delay and try to reload images that failed
      setTimeout(() => {
        const images = this.$el.querySelectorAll('img');
        images.forEach(img => {
          if (!img.complete || img.naturalWidth === 0) {
            const src = img.src;
            img.src = '';
            img.src = src;
          }
        });
      }, 100);
    },
    
    onImageError(event) {
      console.error('Image failed to load:', event.target.src);
      // Set a fallback or hide the image instead of retrying
      event.target.style.display = 'none';
    },
    
    
  }
};
</script>

<style scoped lang="scss">
.landing-page {
  background: var(--v-backgroundAlt-base);
  min-height: 100vh;
}
.landing-page-md {
  margin-top: 30px;
  box-sizing: border-box;
}

.hamburger-menu {
  background: var(--v-background-base);
  backdrop-filter: blur(10px);
  border: 1px solid var(--v-background-base);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 8px;
  
  &:hover {
    background: var(--v-secondary-base);
    color: white;
    box-shadow: 0 6px 25px rgba(49, 54, 87, 0.3);
  }
}

.landing-container {
  min-height: 100vh;
  width: 100vw;
  background: var(--v-backgroundAlt-base);
  display: flex;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(221, 60, 81, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(108, 144, 185, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(31, 102, 131, 0.05) 0%, transparent 50%);
    z-index: 0;
  }
}

.landing-row {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

.column {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
  &.left-column {
    flex: 0 0 24%;
    background: rgba(255, 255, 255, 0.02);
  }
  
  &.cards-column {
    flex: 0 0 38%;
    background: rgba(255, 255, 255, 0.01);
    
    &:last-child {
      background: rgba(255, 255, 255, 0.02);
    }
  }
}

.column-content {
  padding: 5em 2em;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Left Column Styles */
.left-column .column-content {
  text-align: center;
  align-items: center;
}

.main-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--v-primary-base);
  margin-bottom: 1em;
  line-height: 1.2;
  
  .title-gradient {
    display: block;
    background:  var(--v-info-base);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5em;
  }
  
  .title-highlight {
    display: block;
    background: var(--v-accent-base);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: glow 2s ease-in-out infinite alternate;
  }
}

.intro-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--v-info-base);
  
  /* Responsive font sizes using Tailwind-like approach */
  @media (min-width: 1536px) {
    font-size: 1.4rem; /* 2xl screens */
  }
  
  @media (min-width: 1280px) and (max-width: 1535px) {
    font-size: 1rem; /* xl screens */
  }
  
  @media (min-width: 1024px) and (max-width: 1279px) {
    font-size: 1rem; /* lg screens */
  }
  
  @media (min-width: 768px) and (max-width: 1023px) {
    font-size: 0.9375rem; /* md screens */
  }
  
  @media (min-width: 640px) and (max-width: 767px) {
    font-size: 0.875rem; /* sm screens */
  }
  
  @media (max-width: 639px) {
    font-size: 0.8125rem; /* xs screens */
  }
}


/* Cards Styles */
.cards-container {
  display: flex;
  flex-direction: column;
  gap: 2dvh;
  height: 100%;
  justify-content: center;
}

.card-item {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-height: 20dvh;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
}

.card-icon {
  flex: 0 0 10dvh;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1dvh;
  
  img {
    width: 10dvh;
    height: 10dvh;
    object-fit: contain;
  }
}

.card-content {
  flex: 1;
  padding: 1dvh 2dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  color: white;
  font-size: 1.5em;
  font-weight: 600;
  margin-bottom: 0.5dvh;
  line-height: 1.3;
}

.card-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1em;    
  line-height: 1.4;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-title {
    font-size: 2rem;
  }
  
  .card-title {
    font-size: 1.2rem;
  }
  
  .card-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .landing-page {
    height: auto;
    overflow-y: auto;
  }
  
  .landing-container {
    height: auto;
    min-height: 100vh;
  }
  
  .landing-row {
    flex-direction: column;
    height: auto;
  }
  
  .column {
    flex: none !important;
    height: auto;
    min-height: auto;
    
    &.left-column {
      min-height: 50vh;
      display: flex;
      align-items: center;
    }
    
    &.cards-column {
      min-height: auto;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .column-content {
    padding: 20px 15px;
    height: auto;
    min-height: auto;
  }
  
  .main-title {
    font-size: 1.8rem;
  }
  

  
  .cards-container {
    gap: 15px;
    justify-content: flex-start;
  }
  
  .card-item {
    min-height: 100px;
  }
  
  .card-icon {
    flex: 0 0 60px;
    
    img {
      width: 35px;
      height: 35px;
    }
  }
  
  .hamburger-menu {
    top: 10px;
    left: 10px;
  }
}
</style>