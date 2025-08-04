<template>
  <v-app class="landing-page">
    <v-container fluid class="pa-0 landing-container">
      <v-row no-gutters class="fill-height">
        <!-- Left Panel -->
        <v-col 
          :cols="mdAndUp ? 4 : 12" 
          :class="mdAndUp ? 'left-panel-large' : 'left-panel-small'"
          class="left-side"
        >
          <v-card 
            flat 
            tile 
            class="pa-4 transparent fill-height overflow-y-auto"
          >
            <v-row no-gutters>
              <v-col 
                v-for="item in leftItems" 
                :key="item.title"
                :cols="mdAndUp ? 12 : 6"
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

        <!-- Center Model Panel -->
        <v-col 
          :cols="mdAndUp ? 4 : 12" 
          class="center-panel d-flex align-center justify-center"
        >
          <v-card 
            flat 
            tile 
            class="pa-4 transparent model-container"
            :class="mdAndUp ? 'fill-height' : 'model-height-mobile'"
          >
            <div class="d-flex align-center justify-center fill-height">
              <!-- <model /> -->
            </div>
          </v-card>
        </v-col>

        <!-- Right Panel -->
        <v-col 
          :cols="mdAndUp ? 4 : 12" 
          :class="mdAndUp ? 'right-panel-large' : 'right-panel-small'"
          class="right-side"
        >
          <v-card 
            flat 
            tile 
            class="pa-4 transparent fill-height overflow-y-auto"
          >
            <v-row no-gutters>
              <v-col 
                v-for="item in rightItems" 
                :key="item.title"
                :cols="mdAndUp ? 12 : 6"
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
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import ItemCard from '@/components/landing/itemCard.vue';
import Model from '@/components/model/Model.vue';
export default {
  layout: 'empty',
  components: {
    ItemCard,
    Model
  },
  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    leftItems() {
      return this.items.filter(item => item.index <= 1);
    },
    rightItems() {
      return this.items.filter(item => item.index > 1);
    }
  },
  data() {
    return {
      items: [
        {
          index: 0,
          title: 'What is happening in pregnancy?',
          description: 'Understand the changes to your body and fetal development, and the roles of placenta, and how do we check on baby\'s health',
          image: '/img/landing/pregnant.svg',
          backgroundColor: '#7A3520',
          link: '/pregnancy-changes'
        },
        {
          index: 1,
          title: 'Pregnancy concerns',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
          image: '/img/embryo_icon.svg',
          backgroundColor: '#313657',
          link: '/conditions'
        },
        {
          index: 2,
          title: 'What does my ultrasound scan mean?',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
          image: '/img/medical_record.svg',
          backgroundColor: '#1F6683',
          link: '/ultrasound-model'
        },
        {
          index: 3,
          title: 'Clinical Cares',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
          image: '/img/landing/pregnancy.png',
          backgroundColor: '#6C90B9',
          link: '/clinical'
        },
        {
          index: 4,
          title: 'Support',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
          image: '/img/landing/pregnancy.png',
          backgroundColor: '#D1C7B5',
          link: '/about'
        }
      ]
    }
  }
};
</script>

<style scoped lang="scss">
.landing-page {
  background-color: #000;
  user-select: none;
}

.landing-container {
  height: 100vh;
  overflow: hidden;
}

/* Panel styling following default layout patterns */
.left-panel-large,
.right-panel-large {
  position: relative;
  height: 100vh;
}

.left-panel-small,
.right-panel-small {
  width: 100vw;
}

.center-panel {
  position: relative;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
}

.model-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-height-mobile {
  height: 50vh;
  min-height: 300px;
}

/* Transparent cards following default layout */
.transparent {
  margin: 0;
  padding: 0;
  opacity: 0.9;
  background: transparent !important;
}

/* Responsive adjustments */
@media (max-width: 959px) {
  .landing-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
  
  .left-panel-small,
  .right-panel-small {
    height: auto;
    min-height: 40vh;
  }
  
  .center-panel {
    height: auto;
    order: -1;
  }
  
  .model-height-mobile {
    height: 40vh;
    min-height: 250px;
  }
}

@media (max-width: 600px) {
  .model-height-mobile {
    height: 30vh;
    min-height: 200px;
  }
}
</style>
