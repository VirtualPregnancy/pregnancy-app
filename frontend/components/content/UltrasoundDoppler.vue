<template>
  <div class="ultrasound-doppler-wrapper">
    <!-- Main Content -->
    <div class="ultrasound-content">
      <!-- Introduction Paragraph -->
      <p class="text-lg leading-relaxed mb-6">
        Doppler ultrasound is a specialised form of ultrasound imaging that measures the movement of blood through vessels.
      </p>
      <p class="text-lg leading-relaxed mb-6">
        If you have concerns about your pēpi's health during pregnancy, a Doppler ultrasound can assess the condition of key blood vessels, such as the 
        <v-btn 
          text 
          color="primary" 
          class="medical-term-btn"
          @click="showUterineDialog = true"
        >
        uterine
        </v-btn>
        and the
        <v-btn 
          text 
          color="primary" 
          class="medical-term-btn"
          @click="showUmbilicalDialog = true"
        >
          umbilical
        </v-btn> arteries <i>(see example below)</i>. 
        These vessels are large enough to easily image. They both provide useful information about downstream blood flow through the uterus and the placenta, respectively. Red or blue spots on the image indicate blood flow towards the ultrasound probe and away from it, respectively. Dark shades in the image indicate slower blood flow, and light shades indicate faster blood flow.
        <!-- Normal Doppler -->
        <!-- <img src="https://www.researchgate.net/profile/Kilian-Pohl/publication/221363274/figure/fig1/AS:305378391805956@1449819290476/llustration-of-shape-patterns-conveyed-by-Doppler-images-for-various-cardiac.png" alt="Normal Doppler" /> -->
        <figure style="text-align: center;">
          <img :src="getImagePath('/img/examples/normal-ultrasound.jpg')" alt='Example Doppler Ultrasound through the umbilical artery.' style='width: 100%; max-width: 700px; margin: 20px auto; display: block;' />
          <figcaption>
            <small>Example of a Doppler ultrasound image. &copy; 2025 James Lab & Pregnancy Modelling Group. All rights reserved.</small>
          </figcaption>
        </figure>
      </p>
      <p class="text-lg leading-relaxed mb-6">
        When blood flow in the uterine or umbilical arteries is abnormal, Doppler ultrasound images are taken of major fetal blood vessels, such as the 
        <v-btn 
          text 
          color="primary" 
          class="medical-term-btn"
          @click="showDVDialog = true"
        >
        ductus venosis (DV)
        </v-btn>
        and the 
        <v-btn 
          text 
          color="primary" 
          class="medical-term-btn"
          @click="showMCADialog = true"
        >
        middle cerebral artery (MCA)
        </v-btn>. You can find more information about fetal complications <nuxt-link to="/complications-fetal">here</nuxt-link>, such as FGR or SGA.
      </p> 
      <!--
      <p class="text-lg leading-relaxed mb-6">
        Doppler imaging of the DV helps to monitor blood flow around the wider fetal circulation early in pregnancy <strong>(11-13 weeks)</strong>. For high-risk pregnancies, e.g. involving a <a href='/complications-fetal'>small-for-gestational-age (SGA)</a> fetus, DV doppler is also performed in the second and third trimesters <strong>(prior to 34 weeks)</strong> to monitor potential complications. Imaging the MCA is performed after <strong>32 weeks</strong> to monitor blood flow to the pēpi's upper body. From this, a clinical metric called 
        <v-btn 
          text 
          color="primary" 
          class="medical-term-btn"
          @click="showCPRDialog = true"
        >
        CPR (Cerebroplacental Ratio)
        </v-btn>
        is reported to indicate the wellbeing of the fetus.
      </p> 
      -->
      <p class="text-lg leading-relaxed mb-6">
        Doppler ultrasound produces a signal in the form of a wave across each heartbeat. Each major vessel in the body produces a unique wave pattern. Analysing these wave patterns and the measurements derived from them shows whether blood flow to the placenta and pēpi is normal or reduced. This helps you and your care team keep track of pēpi’s health and how well the anatomy is developing.
      </p>
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

    <v-dialog v-model="showDVDialog"   max-width="600">
      <v-card>
        <v-card-title class="headline primary--text">
          <v-icon left color="primary">{{ dialogContent.dv.icon }}</v-icon>
          {{ dialogContent.dv.title }}
        </v-card-title>
        <v-card-text class="pt-4">
          {{ dialogContent.dv.content }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showDVDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showMCADialog"   max-width="600">
      <v-card>
        <v-card-title class="headline primary--text">
          <v-icon left color="primary">{{ dialogContent.mca.icon }}</v-icon>
          {{ dialogContent.mca.title }}
        </v-card-title>
        <v-card-text class="pt-4">
          {{ dialogContent.mca.content }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showMCADialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showCPRDialog"   max-width="600">
      <v-card>
        <v-card-title class="headline primary--text">
          <v-icon left color="primary">{{ dialogContent.cpr.icon }}</v-icon>
          {{ dialogContent.cpr.title }}
        </v-card-title>
        <v-card-text class="pt-4">
          This ratio is calculated by dividing the
          <nuxt-link to="/ultrasound-metric">pulsatility index</nuxt-link>
          of the middle cerebral artery by that of the umbilical artery.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showCPRDialog = false">
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
      showDVDialog: false,
      showMCADialog: false,
      showCPRDialog: false,

      // Waveform parameters
      waveformPoints: [],
      pulsePosition: 0,
      dialogContent: {
        doppler: {
          title: "Doppler Effect",
          icon: "mdi-wave",
          content: "The Doppler Effect describes the perceived changing frequency of waves (e.g. sound) with respect to the observer. A high frequency of sound waves indicates that the blood is flowing towards the ultrasound probe held by the imaging technician. The sound wave frequency lowers when blood flows away from the probe.",
          controller: "showDopplerDialog",
        },
        uterine: {
          title: "Uterine Artery",
          content: "The uterine artery is a blood vessel that supplies oxygenated blood from the heart to the uterus. During pregnancy, these arteries enlargen to increase oxygenated blood supply to the growing fetus.",
          controller: "showUterineDialog",
          icon: "mdi-heart-pulse",
        },
        umbilical: {
          title: "Umbilical Artery",
          content: "The umbilical arteries are two blood vessels that transports deoxygenated blood and waste products from the fetus to the placenta. These arteries move through the umbilical cord back to mum's side of the placenta, where the wastes are removed through maternal circulation.",
          controller: "showUmbilicalDialog",
          icon: "mdi-baby-carriage",
        },
        dv: {
          title: "Ductus Venosis",
          icon: "mdi-wave",
          content: "The ductus venosus forms temporarily during pregnancy. This acts as a shunt to move blood flow from the umbilical vein of the fetus to the inferior vena cava (the largest vein in the body) of mum.",
          controller: "showDVDialog",
        },
        mca: {
          title: "Middle Cerebral Artery",
          content: "The middle cerebral artery is a major blood vessel in the brain that supplies oxygenated blood from the heart to the cerebrum. This vessel originates from the internal carotid artery located in the neck.",
          controller: "showMCADialog",
          icon: "mdi-heart-pulse",
        },
        cpr: {
          title: "Cerebroplacental Ratio",
          controller: "showCPRDialog",
          icon: "mdi-baby-carriage",
        }
      },
    };
  },

 
  methods: {
    getImagePath(imagePath) {
      const basePath = this.$config.basePath || (
        process.env.DEPLOY_ENV === 'GH_PAGES' ? '/pregnancy-app' : ''
      );

      return `${basePath}${imagePath}`;
    },
    getRoutePath(route) {
      const basePath = this.$config.basePath || (
        process.env.DEPLOY_ENV === 'GH_PAGES' ? '/pregnancy-app' : ''
      );

      return this.$config.deployEnv === 'GH_PAGES' || process.env.DEPLOY_ENV === 'GH_PAGES'
        ? `${basePath}${route}`
        : `/#${route}`;
    }
  },
};
</script>
  
  <style scoped>
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