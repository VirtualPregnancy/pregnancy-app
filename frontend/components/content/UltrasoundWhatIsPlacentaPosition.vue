<template>
  <div>
    
    The 20-week ultrasound scan can show doctors the location of the placenta in mum's uterus. The main things they look for are: 
    <ul>
      <li>If the placenta is at the anterior (front), posterior (back), or fundal (top) positions</li>
      <li>The proximity of the placenta to the opening of the 
        <v-btn
          text
          small
          color="primary"
          class="medical-term-btn"
          @click="showCervixDialog = true"
        >cervix
        </v-btn>.
      </li>
    </ul> 

    It is typically a quick search for the placenta, as it is big and easy to spot. An example is shown below.
    <figure style="text-align: center;">
      <img :src="getImagePath('/img/ultrasound/fetal-development_us/placenta/Week20_19_face-placenta.jpg')" alt='Example ultrasound scan showing placenta.' style='width: 100%; max-width: 600px; margin: 20px auto; display: block;' />
      <figcaption>
        <small>Example of a 20-week ultrasound image that shows the position of the placenta in the uterus. &copy; 2025 James Lab & Pregnancy Modelling Group. All rights reserved.</small>
      </figcaption>
    </figure>

    If the implanted placenta blocks the cervix, this condition is called  
    <v-btn
      text
      small
      color="primary"
      class="medical-term-btn"
      @click="showPlacentaPreviaDialog = true"
    >
    placenta previa
    </v-btn>. It is important to know about this before delivery to prevent birthing complications.
  
    <!-- Placenta Previa Dialog - Vuetify 2.x compatible -->
    <v-dialog 
      v-model="showPlacentaPreviaDialog" 
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          <v-icon left color="warning">mdi-information-variant-circle-outline</v-icon>
          Placenta Previa
        </v-card-title>
        
        <v-card-text class="pt-4">
          <p>
            Placenta previa occurs when the placenta covers the cervical opening. This can cause bleeding and other complications during pregnancy.
          </p>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            text 
            @click="showPlacentaPreviaDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Cervix Dialog - Vuetify 2.x compatible -->
    <v-dialog 
      v-model="showCervixDialog" 
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          <v-icon left color="warning">mdi-information-variant-circle-outline</v-icon>
          Cervix
        </v-card-title>
        
        <v-card-text class="pt-4">
          <p>
            This is the opening at the bottom of the uterus. The pēpi will pass through this opening during birth.
          </p>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            text 
            @click="showCervixDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
export default {
  name: 'UltrasoundWhatIsPlacentaPosition',
  
  data() {
    return {
      showPlacentaPreviaDialog: false,
      showNuchalDialog: false,
      showCervixDialog: false
    };
  },

  methods: {
    getImagePath(imagePath) {
      const basePath = this.$config.basePath || (
        process.env.DEPLOY_ENV === 'GH_PAGES' ? '/pregnancy-app' : ''
      );

      return `${basePath}${imagePath}`;
    }
  },
};
</script>

<style scoped>
.timeline-card {
  padding: 2%;
  margin-bottom: 16px;
}

/* Medical Term Button Styles - Vuetify 2.x compatible */
.medical-term-btn {
  text-transform: none !important;
  text-decoration: underline;
  min-width: auto !important;
  padding: 0 !important;
  height: auto !important;
  font-weight: 600;
  margin: 0;
  display: inline-flex !important;
  align-items: baseline;
  vertical-align: baseline;
  font-size: inherit !important;
  line-height: inherit !important;
  letter-spacing: normal !important;
  border-radius: 0 !important;
  white-space: normal;
}

.medical-term-btn .v-btn__content {
  display: inline !important;
  padding: 0 !important;
}

.medical-term-btn:hover {
  background-color: rgba(25, 118, 210, 0.04) !important;
  text-decoration: none;
}

.medical-term-btn::before {
  display: none !important;
}

/* Dialog Styles */
.v-dialog .v-card .v-card-title {
  font-weight: 600;
  padding-bottom: 8px;
}

.v-card-text p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0;
}
</style>