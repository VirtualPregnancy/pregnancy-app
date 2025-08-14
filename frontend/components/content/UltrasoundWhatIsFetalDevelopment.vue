<template>
  <div>
    <v-card class="timeline-card">
      <v-card-text>
        At 12 weeks of gestation. This is often the first scan you might have. Along with dating the pregnancy, 
        checking the location of the pregnancy (that it is in the uterus and not 
        <v-btn
          text
          small
          color="primary"
          class="medical-term-btn"
          @click="showEctopicDialog = true"
        >
          ectopic
        </v-btn>), and determining if there is a single baby or not, this scan is focussed on checking 
        the basic anatomy of the fetus – more detail?. The sonographer may also listen for a fetal heartbeat. 
        Your baby's 
        <v-btn
          text
          small
          color="primary"
          class="medical-term-btn"
          @click="showNuchalDialog = true"
        >
          nuchal translucency
        </v-btn>
        will also usually be assessed. This is a measurement of the thickness of fluid at the back of the baby's neck 
        that is used in combination with a blood test to screen for chromosomal conditions like Down syndrome, 
        trisomy 13, and trisomy 18.
      </v-card-text>
    </v-card>
    
    <v-card class="timeline-card">
      <v-card-text>
        At 20 weeks of gestation the ultrasound scan focusses on checking fetal anatomy and identifying any abnormalities. 
        All the major organs are checked to ensure they have formed properly, including the brain, heart, lungs, stomach, 
        kidneys and bladder. Arms, legs, hands and feet are checked, including movement and the length of the main thigh bone (the femur).
      </v-card-text>
    </v-card>

    <!-- Ectopic Pregnancy Dialog - Vuetify 2.x compatible -->
    <v-dialog 
      v-model="showEctopicDialog" 
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          <v-icon left color="warning">mdi-information-variant-circle-outline</v-icon>
          Ectopic Pregnancy
        </v-card-title>
        
        <v-card-text class="pt-4">
          <p>
            An ectopic pregnancy occurs when a fertilized egg implants outside the uterus, 
            most often in a fallopian tube. This can be dangerous and requires prompt medical attention.
          </p>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            text 
            @click="showEctopicDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Nuchal Translucency Dialog - Vuetify 2.x compatible -->
    <v-dialog 
      v-model="showNuchalDialog" 
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          <v-icon left color="info">mdi-ruler</v-icon>
          Nuchal Translucency
        </v-card-title>
        
        <v-card-text class="pt-4">
     
            Nuchal translucency (NT) is a measurement of the thickness of fluid at the back 
            of the baby's neck during the first trimester ultrasound scan (usually between 11-14 weeks). 
            It's used to screen for chromosomal conditions like Down syndrome.
            <img src="https://www.researchgate.net/profile/Ronald-Lopez-Cepero/publication/221764795/figure/fig1/AS:340641696501766@1458226717553/Nuchal-translucency-at-11-weeks-of-gestational-age.png" alt="Nuchal translucency measurement" />
            <p class="text-small text-center">Credit: López-Cepero, Ronald & Lynch, Lauren & Zorrilla, Carmen & Leavitt, Karla & Vega, Alberto. (2011).</p>
          
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            text 
            @click="showNuchalDialog = false"
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
  name: 'UltrasoundWhatIsFetalDevelopment',
  
  data() {
    return {
      showEctopicDialog: false,
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