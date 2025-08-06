<template>
  <v-app class="landing-page">
    <!-- Hamburger Menu Icon -->
    <div class="hamburger-menu fixed top-5 left-5 z-[1000] cursor-pointer p-2 rounded-xl transition-all duration-300 hover:-translate-y-0.5" @click="navigateToUltrasound">
      <v-icon size="28" color="#333">mdi-menu</v-icon>
    </div>
    
    <v-container fluid class="pa-0 landing-container h-screen overflow-hidden relative z-[1] w-full">
      <v-row no-gutters class="fill-height">
        <!-- Left Panel - Title and Content -->
        <v-col 
          :cols="mdAndUp ? 3 : 12" 
          class="left-side justify-space-around mt-[5%] flex flex-col justify-start items-stretch h-screen"
        >
          <v-card 
            flat 
            tile 
            class="pa-4 transparent fill-height overflow-y-auto"
          >
            <!-- Title Section -->
            <div class="title-section flex-1 flex flex-col justify-center text-center relative">
              
              <h1 class="main-title text-[2.4rem] font-bold mb-6 leading-tight relative z-[2]">
                <span class="title-gradient block mb-2">Pregnancy is an</span>
                <span class="title-highlight block">exciting time!</span>
              </h1>
              <div class="content-text">
                <p class="intro-text mb-6 text-base leading-snug font-normal">Nau mai, haere mai! Whether you're experiencing a smooth pregnancy or navigating unexpected challenges, this app is here to support you and your whānau every step of the way. Designed especially for people in Aotearoa New Zealand, we offer trusted information, helpful tools, and culturally respectful guidance to help you understand your health and make confident decisions. Your journey is unique, and we're honoured to walk alongside you because every pregnancy deserves care, connection, and compassion.</p>

              </div>
              
            </div>
          </v-card>
        </v-col>

        <!-- Middle Panel - Three Cards -->
        <v-col 
          :cols="mdAndUp ? 5 : 12" 
          class="middle-side justify-space-between flex flex-col justify-start items-stretch h-screen overflow-hidden"
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
                class="pa-2 flex justify-center items-center"
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

        <!-- Right Panel - Two Cards -->
        <v-col 
          :cols="mdAndUp ? 4 : 12" 
          class="right-side justify-space-around"
        >
          <v-card 
            flat 
            tile 
            class="pa-4 transparent fill-height overflow-y-auto justify-space-around"
          >
            <v-row no-gutters class="fill-height right-side-row flex items-around mt-[10%]">
              <v-col 
                v-for="item in rightItems" 
                :key="item.title"
                cols="12"
                class="pa-2 flex items-around justify-center"
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
            <!-- <div class="logo-container">
             <Logo />
            </div>  -->
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
      this.$router.push('/ultrasound-what-is-ultrasound');
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
  background: rgba(49, 54, 87, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(49, 54, 87, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: var(--v-secondary-base);
    color: white;
    box-shadow: 0 6px 25px rgba(49, 54, 87, 0.3);
  }
}




.main-title {
  letter-spacing: -0.5px;
  
  .title-gradient {
    background: linear-gradient(135deg, var(--v-secondary-base) 0%, var(--v-info-base) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .title-highlight {
    background: linear-gradient(135deg, var(--v-primary-base) 0%, var(--v-accent-base) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
  
  .intro-text {
    color: var(--v-success-base);
  }
}


.middle-side .v-row {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 0;
  height: 100%;
  overflow: hidden;
}

.middle-side .v-col {
  flex: 0 0 auto;
}


.right-side .v-card {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.right-side .v-row {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: auto;
  flex: 1;
  overflow: hidden;
  padding: 20px 0;
}

.right-side .v-col {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 250px;
  flex: 0 0 auto;
}



/* Responsive adjustments */
@media (max-width: 959px) {
  
  .left-side,
  .middle-side,
  .right-side {
    height: auto;
    overflow: visible;
    min-height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .right-side-row {
    margin-top: -5%;
  }
  
  .left-side .v-card,
  .middle-side .v-card,
  .right-side .v-card {
    overflow: visible;
    height: auto;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .middle-side .v-row,
  .right-side .v-row {
    height: auto;
    overflow: visible;
    gap: 20px;
    padding: 20px;
    align-items: center;
    justify-content: center;
  }
  
  .middle-side .v-col,
  .right-side .v-col {
    margin-bottom: 20px;
    max-height: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .content-text p {
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .main-title {
    font-size: 1.8rem;
  }
  
  .content-text p {
    font-size: 0.85rem;
  }
}

/* Transparent cards */
.transparent {
  background: transparent !important;
}
</style>