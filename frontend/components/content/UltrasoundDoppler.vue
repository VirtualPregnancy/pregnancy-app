<template>
  <div class="ultrasound-doppler-wrapper">
    <!-- Main Content -->
    <div class="ultrasound-content">
      <!-- Introduction Paragraph -->
      <p class="text-lg leading-relaxed mb-6">
        Doppler ultrasound is a specialized form of ultrasound imaging that uses the
        <v-btn 
          text 
          color="primary" 
          class="medical-term-btn"
          @click="showDopplerDialog = true"
        >
          Doppler effect
        </v-btn>
        to measure the movement of blood through vessels. In pregnancy, the main blood vessels that are checked by Doppler ultrasound are the uterine
        <v-btn 
          text 
          color="primary" 
          class="medical-term-btn"
          @click="showUterineDialog = true"
        >
          artery
        </v-btn>
        and the
        <v-btn 
          text 
          color="primary" 
          class="medical-term-btn"
          @click="showUmbilicalDialog = true"
        >
          umbilical artery
        </v-btn>
        . These vessels are chosen as they are large enough to easily image and produce useful information about downstream blood flow to the uterus and the placenta respectively. Sometimes if blood flow in the uterine or umbilical artery is abnormal Doppler ultrasound of some of the major blood vessels in the fetus may also be measured (usually the middle cerebral artery (MCA) which tells us about blood flow in the brain, or the ductus venosus (DV) which tells us about blood flow around the heart).
</p>
        <p class="text-lg leading-relaxed mb-6">Doppler ultrasound produces a waveform shape across each heartbeat.  Each major vessel in the body produces a ‘signature’ shape, and your clinical team can use different measurements and features taken from the shape of these waveforms to understand if blood is flowing to the placenta and baby normally, or if it may be reduced.  </p>
      

      <!-- Normal Doppler -->
     <img src="https://www.researchgate.net/profile/Kilian-Pohl/publication/221363274/figure/fig1/AS:305378391805956@1449819290476/llustration-of-shape-patterns-conveyed-by-Doppler-images-for-various-cardiac.png" alt="Normal Doppler" />


    

    <!-- Dialogs -->

    <v-dialog v-model="showDopplerDialog"   max-width="600">
      <v-card>
        <v-card-title class="headline primary--text">
          <v-icon left color="primary">{{ dialogContent.doppler.icon }}</v-icon>
          {{ dialogContent.doppler.title }}
        </v-card-title>
        <v-card-text class="pt-4">
          {{ dialogContent.doppler.content }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showDopplerDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showUterineDialog"   max-width="600">
      <v-card>
        <v-card-title class="headline primary--text">
          <v-icon left color="primary">{{ dialogContent.uterine.icon }}</v-icon>
          {{ dialogContent.uterine.title }}
        </v-card-title>
        <v-card-text class="pt-4"> 
          {{ dialogContent.uterine.content }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showUterineDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showUmbilicalDialog"   max-width="600">
      <v-card>
        <v-card-title class="headline primary--text">
          <v-icon left color="primary">{{ dialogContent.umbilical.icon }}</v-icon>
          {{ dialogContent.umbilical.title }}
        </v-card-title>
        <v-card-text class="pt-4">
          {{ dialogContent.umbilical.content }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showUmbilicalDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
    </div>
  </template>
  
  <script>
export default {
  name: "UltrasoundDoppler",

  data() {
    return {
      // Dialog states
      showDopplerDialog: false,
      showUterineDialog: false,
      showUmbilicalDialog: false,

    

      // Waveform parameters
      waveformPoints: [],
      pulsePosition: 0,
      dialogContent: {
        doppler: {
          title: "Doppler Effect",
          icon: "mdi-wave",
          content: "Doppler is xxx",
          controller: "showDopplerDialog",
        },
        uterine: {
          title: "Uterine Artery",
          content: "Uterine is xxx",
          controller: "showUterineDialog",
          icon: "mdi-heart-pulse",
        },
        umbilical: {
          title: "Umbilical Artery",
          content: "Umbilical is xxx",
          controller: "showUmbilicalDialog",
          icon: "mdi-baby-carriage",
        },
      },
    };
  },

 
};
</script>
  
  <style scoped>
/* Medical Term Button Styles - Vuetify 2.x compatible */
.medical-term-btn {
  text-transform: none !important;
  text-decoration: underline;
  min-width: auto !important;
  padding: 0 4px !important;
  height: auto !important;
  font-weight: 600;
  margin: 0 2px;
  display: inline !important;
  vertical-align: baseline;
  font-size: inherit !important;
  line-height: inherit !important;
  border-radius: 0 !important;
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

/* Container styles to prevent layout issues */
.ultrasound-doppler-wrapper {
  width: 100%;
  overflow-x: hidden;
  display: block !important;
}

.ultrasound-content {
  width: 100%;
  display: block !important;
  column-count: unset !important;
  column-width: unset !important;
  columns: unset !important;
}

.ultrasound-doppler-wrapper p,
.ultrasound-doppler-wrapper div,
.ultrasound-content p,
.ultrasound-content div {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: none !important;
  column-count: unset !important;
  column-width: unset !important;
  columns: unset !important;
  column-gap: unset !important;
  column-fill: unset !important;
  column-rule: unset !important;
  column-span: unset !important;
  break-inside: unset !important;
  page-break-inside: unset !important;
  display: block !important;
  white-space: normal !important;
  text-align: left !important;
  writing-mode: horizontal-tb !important;
  direction: ltr !important;
}
</style>