<template>
  <div>
    
        Ultrasound helps determine where the placenta is located in the uterus (ie if it is at the front (anterior), back (posterior), or fundal (top) positions) and its proximity to the opening of the cervix (the opening at the bottom of the uterus through which the baby will pass during birth). If the placenta has implanted in a way that blocks the cervix this is called 
        <v-btn
          text
          small
          color="primary"
          class="medical-term-btn"
          @click="showPlacentaPreviaDialog = true"
        >
          placenta previa
        </v-btn>, and it is important to know about this before delivery to prevent complications.
      
  

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
            Placenta previa occurs when the placenta covers the cervical opening, which can cause bleeding and other complications during pregnancy.
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

  </div>
</template>

<script>
export default {
  name: 'UltrasoundWhatIsPlacentaPosition',
  
  data() {
    return {
      showPlacentaPreviaDialog: false,
      showNuchalDialog: false
    };
  }
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
  padding: 0 4px !important;
  height: auto !important;
  font-weight: 600;
  margin: 0 2px;
  display: inline;
  vertical-align: baseline;
  font-size: inherit !important;
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