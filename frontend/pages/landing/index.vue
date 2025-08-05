<template>
  <v-app class="landing-page">
    <!-- Hamburger Menu Icon -->
    <div class="hamburger-menu" @click="navigateToUltrasound">
      <v-icon size="28" color="#333">mdi-menu</v-icon>
    </div>
    
    <v-container fluid class="pa-0 landing-container">
      <v-row no-gutters class="fill-height">
        <!-- Left Panel - Title and Content -->
        <v-col 
          :cols="mdAndUp ? 3 : 12" 
          class="left-side justify-space-around"
        >
          <v-card 
            flat 
            tile 
            class="pa-4 transparent fill-height overflow-y-auto"
          >
            <!-- Title Section -->
            <div class="title-section">
              
              <h1 class="main-title">
                <span class="title-gradient">Pregnancy is an</span>
                <span class="title-highlight">exciting time!</span>
              </h1>
              <div class="content-text">
                <p class="intro-text">Discover everything you need to know about your pregnancy journey - from understanding the changes in your body to monitoring your baby's health.</p>
                <p class="feature-text">💕 learn about pregnancy<br>
                🤱 understand fetal development<br>
                📊 understand ultrasound technology<br>
                👶 understand fetal development<br>
              </p>

              </div>
              
            </div>
          </v-card>
        </v-col>

        <!-- Middle Panel - Three Cards -->
        <v-col 
          :cols="mdAndUp ? 5 : 12" 
          class="middle-side justify-space-around"
        >
          <v-card 
            flat 
            tile 
            class="pa-4 transparent fill-height overflow-y-auto"
          >
            <v-row no-gutters class="fill-height">
              <v-col 
                v-for="item in middleItems" 
                :key="item.title"
                cols="12"
                class="pa-2"
              >
                <item-card 
                  :title="item.title" 
                  :description="item.description" 
                  :image="item.image" 
                  :backgroundColor="item.backgroundColor" 
                  :link="item.link" 
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- Right Panel  -->
        <v-col 
          :cols="mdAndUp ? 4 : 12" 
          class="right-side"
        >
          <v-card 
            flat 
            tile 
            class="pa-4 transparent fill-height overflow-y-auto"
          >
            <v-row no-gutters class="fill-height">
              <v-col 
                v-for="item in rightItems" 
                :key="item.title"
                cols="12"
                class="pa-2"
              >
                <item-card 
                  :title="item.title" 
                  :description="item.description" 
                  :image="item.image" 
                  :backgroundColor="item.backgroundColor" 
                  :link="item.link" 
                />
              </v-col>
            </v-row>
            <div class="logo-container">
              <Logo />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import ItemCard from '@/components/landing/itemCard.vue';
import Logo from '@/components/about/Logo.vue';
import landingPageData from './landingPageData';

export default {
  layout: 'empty',
  components: {
    ItemCard,
    Logo
  },
  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    middleItems() {
      return this.items.filter(item => item.index <= 2);
    },
    rightItems() {
      return this.items.filter(item => item.index > 2);
    }
  },
  data() {
    return {
      items: landingPageData.items
    }
  },
  methods: {
    navigateToUltrasound() {
      this.$router.push('/ultrasound-model');
    },
    scrollToCards() {
      const middleSection = document.querySelector('.middle-side');
      if (middleSection) {
        middleSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.landing-page {
  background: var(--v-background-base);
  user-select: none;
  padding-top: 1%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  
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

.hamburger-menu {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  background: rgba(49, 54, 87, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(49, 54, 87, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--v-secondary-base);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(49, 54, 87, 0.3);
  }
}

.landing-container {
  height: 100vh;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.left-side {
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

.title-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  position: relative;
}




.main-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  line-height: 1.2;
  letter-spacing: -0.5px;
  position: relative;
  z-index: 2;
  
  .title-gradient {
    background: linear-gradient(135deg, var(--v-secondary-base) 0%, var(--v-info-base) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .title-highlight {
    background: linear-gradient(135deg, var(--v-primary-base) 0%, var(--v-accent-base) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    animation: glow 2s ease-in-out infinite alternate;
  }
}

@keyframes glow {
  from {
    filter: drop-shadow(0 0 5px var(--v-primary-lighten1));
  }
  to {
    filter: drop-shadow(0 0 15px var(--v-primary-base));
  }
}

.content-text {
  color: var(--v-secondary-base);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto 2rem;
  position: relative;
  z-index: 2;
  
  .intro-text {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--v-secondary-darken1);
  }
  
  .feature-text {
    font-size: 0.95rem;
    line-height: 1.8;
    background: rgba(255, 255, 255, 0.6);
    color: var(--v-secondary-base);
    padding: 1rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}


.middle-side {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

.middle-side .v-row {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 16px;
  padding: 20px 0;
}

.middle-side .v-col {
  flex: 1;
  max-height: calc((100vh - 120px) / 2.5);
}

.right-side {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
}

.right-side .v-card {
  display: flex;
  flex-direction: column;
  justify-content:space-around;
  align-items: center;
  height: 100%;
  width: 100%;
}

.right-side .v-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
}

.right-side .v-col {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 250px;
}

/* Logo container styling */
.logo-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 50%;
  
  .logo {
    img {
      width: 60px;
      height: auto;
    }
  }
}

/* Responsive adjustments */
@media (max-width: 959px) {
  .landing-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
  
  .left-side,
  .middle-side,
  .right-side {
    height: auto;
    min-height: 40vh;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .content-text p {
    font-size: 0.9rem;
  }
  
  .logo-container {
    position: relative;
    bottom: auto;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    margin-top: 20px;
    width: 60%;
    
    .logo {
      img {
        width: 50px;
      }
    }
  }
}

@media (max-width: 600px) {
  .main-title {
    font-size: 1.8rem;
  }
  
  .content-text p {
    font-size: 0.85rem;
  }
  
  .logo-container {
    .logo {
      img {
        width: 40px;
      }
    }
  }
}

/* Transparent cards */
.transparent {
  margin: 0;
  padding: 0;
  opacity: 0.9;
  background: transparent !important;
}
</style>