<template>
  <div>
    <v-card class="timeline-card">
      <v-card-text>
        At 12 weeks of gestation. This is often the first scan you might have,
        and aims to:
        <ul>
          <li>
            • Check the location of the pregnancy (that it is in the uterus and
            not
            <v-btn
              text
              small
              color="primary"
              class="medical-term-btn"
              @click="showEctopicDialog = true"
            >
              ectopic</v-btn
            >)
          </li>
          <li>• Determine if there is a single baby or twins/triplets</li>
          <li>• Check the basic anatomy of the fetus.</li>
          <li>• Listen to the fetal heartbeat.</li>
          <li>
            Screen for chromosomal conditions using
            <v-btn
              text
              small
              color="primary"
              class="medical-term-btn"
              @click="showNuchalDialog = true"
            >
              nuchal translucency
            </v-btn>
          </li>
        </ul>
      </v-card-text>
    </v-card>

    <v-card class="timeline-card">
      <v-card-text>
        At 20 weeks of gestation. This scan focusses on checking:
        <ul>
          <li>
            • Anatomy of all the major organs to ensure they have formed
            properly.
          </li>
          <li>
            • That the limbs have formed correctly (Arms, legs, hands and feet),
            and if any movement can be seen.
          </li>
          <li>
            • Your baby’s growth by measuring the length of the main thigh bone
            (the femur), the distance from the top of its head to the bottom of
            its spine (crown-rump length), and the circumference of its head and
            abdomen.
          </li>
          <li>• How the heart is beating.</li>
          <li>
            • How easily blood is flowing to the placenta [link to blood flow to
            the placenta].
          </li>
          <li>
            • The volume of amniotic fluid around your baby. Low levels of
            amniotic fluid can be an indicator of pregnancy complications.
          </li>
        </ul>
      </v-card-text>
    </v-card>

    <!-- Ectopic Pregnancy Dialog - Vuetify 2.x compatible -->
    <v-dialog v-model="showEctopicDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline">
          <v-icon left color="warning"
            >mdi-information-variant-circle-outline</v-icon
          >
          Ectopic Pregnancy
        </v-card-title>

        <v-card-text class="pt-4">
          <p>
            An ectopic pregnancy occurs when a fertilized egg implants outside
            the uterus, most often in a fallopian tube. This can be dangerous
            and requires prompt medical attention.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showEctopicDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Nuchal Translucency Dialog - Vuetify 2.x compatible -->
    <v-dialog v-model="showNuchalDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline">
          <v-icon left color="info">mdi-ruler</v-icon>
          Nuchal Translucency
        </v-card-title>

        <v-card-text class="pt-4">
          This is a measurement of the thickness of fluid at the back of the
          baby’s neck that is used in combination with a blood test to screen
          for chromosomal conditions like Down syndrome, trisomy 13, and trisomy
          18.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showNuchalDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "UltrasoundWhatIsFetalDevelopment",

  data() {
    return {
      showEctopicDialog: false,
      showNuchalDialog: false,
    };
  },
};
</script>

<style scoped>
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