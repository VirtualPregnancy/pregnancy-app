<template>
  <div>
    Your ultrasound report or clinical team may talk about some of the common
    metrics that are reported from your Doppler ultrasound scan. These metrics
    are derived from certain parts of the waveform, and large clinical studies
    have allowed us to understand how these numbers relate to fetal health.
    <div class="d-flex flex-row gap-4 mt-4 mb-4 justify-center">
      <v-card style="background: var(--v-accentLight-base); color: white">
        <v-card-title style="color: white"> Resistive Index (RI) </v-card-title>
        <v-card-text style="color: white"> </v-card-text>
      </v-card>

      <v-card style="background: var(--v-accent-base); color: white">
        <v-card-title style="color: white">
          Pulsatility index (PI)
        </v-card-title>
        <v-card-text style="color: white"> </v-card-text>
      </v-card>

      <v-card style="background: var(--v-success-base); color: white">
        <v-card-title style="color: white"> S/D ratio </v-card-title>
        <v-card-text style="color: white"> </v-card-text>
      </v-card>
    </div>
    What may be a 'normal' or 'abnormal' value for each of these metrics varies
    depending on the blood vessel being examined, and the gestation of your
    pregnancy (how far along you are). Indicators of normal ranges for these
    values for the umbilical artery and uterine artery are below.

    <!-- Normal Ranges Table Section -->
    <div class="mt-6 d-flex justify-center">
      <v-btn
        color="primary"
        @click="showRangesDialog = true"
        class="mb-4 text-center"
      >
        <v-icon left>mdi-table-large</v-icon>
        View Normal Ranges Table
      </v-btn>
    </div>

    <!-- Popup Dialog for Normal Ranges -->
    <v-dialog
      v-model="showRangesDialog"
      max-width="900px"
      style="z-index: 9999"
    >
      <v-card>
        <v-card-title
          class="text-h5 px-6 py-4"
          style="background: var(--v-accentLight-base); color: white"
        >
          <v-icon left color="white">mdi-chart-box-outline</v-icon>
          Normal Ranges of Doppler Metrics - Third Trimester
        </v-card-title>

        <v-card-text class="pa-0">
          <v-tabs v-model="activeTab" centered color="primary">
            <v-tab>
              <v-icon left>mdi-heart</v-icon>
              Umbilical Artery
            </v-tab>
            <v-tab>
              <v-icon left>mdi-water</v-icon>
              Uterine Artery
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <!-- Umbilical Artery Table -->
            <v-tab-item>
              <div class="pa-6">
                <v-alert
                  type="info"
                  outlined
                  class="mb-4"
                  style="border-color: var(--v-accent-base)"
                >
                  <div class="text-sm">
                    <strong>Umbilical Artery:</strong> Lorem ipsum dolor sit
                    amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </div>
                </v-alert>

                <v-data-table
                  :headers="headers"
                  :items="umbilicalData"
                  hide-default-footer
                  class="elevation-1"
                />
              </div>
            </v-tab-item>

            <!-- Uterine Artery Table -->
            <v-tab-item>
              <div class="pa-6">
                <v-alert
                  type="info"
                  outlined
                  class="mb-4"
                  style="border-color: var(--v-accent-base)"
                >
                  <div class="text-sm">
                    <strong>Uterine Artery:</strong> Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </div>
                </v-alert>

                <v-data-table
                  :headers="headers"
                  :items="uterineData"
                  hide-default-footer
                  class="elevation-1"
                />
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>

        <v-card-text style="background: var(--v-background-base)">
          <div class="text-sm" style="color: var(--v-text-color)">
            <v-icon small color="accent" class="mr-2">mdi-information</v-icon>
            <strong>Note:</strong> Just example data
          </div>
        </v-card-text>

        <v-card-actions class="px-6 py-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showRangesDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "DopplerMetricsWithTable",

  data() {
    return {
      showRangesDialog: false,
      activeTab: 0,

      headers: [
        {
          text: "Gestational Age",
          value: "gestation",
          sortable: false,
          width: "25%",
        },
        {
          text: "Resistive Index (RI)",
          value: "ri",
          sortable: false,
          width: "25%",
        },
        {
          text: "Pulsatility Index (PI)",
          value: "pi",
          sortable: false,
          width: "25%",
        },
        { text: "S/D Ratio", value: "sd", sortable: false, width: "25%" },
      ],

      umbilicalData: [
        {
          gestation: "28-30 weeks",
          ri: "0.60-0.75",
          pi: "0.90-1.35",
          sd: "2.5-4.0",
        },
        {
          gestation: "31-33 weeks",
          ri: "0.58-0.72",
          pi: "0.85-1.30",
          sd: "2.3-3.8",
        },
        {
          gestation: "34-36 weeks",
          ri: "0.55-0.70",
          pi: "0.80-1.25",
          sd: "2.0-3.5",
        },
        {
          gestation: "37-40 weeks",
          ri: "0.52-0.68",
          pi: "0.75-1.20",
          sd: "1.8-3.2",
        },
      ],

      uterineData: [
        {
          gestation: "28-30 weeks",
          ri: "0.45-0.60",
          pi: "0.70-1.00",
          sd: "1.8-2.6",
        },
        {
          gestation: "31-33 weeks",
          ri: "0.42-0.58",
          pi: "0.68-0.98",
          sd: "1.7-2.5",
        },
        {
          gestation: "34-36 weeks",
          ri: "0.40-0.55",
          pi: "0.65-0.95",
          sd: "1.6-2.4",
        },
        {
          gestation: "37-40 weeks",
          ri: "0.38-0.52",
          pi: "0.62-0.92",
          sd: "1.5-2.3",
        },
      ],
    };
  },

  methods: {},
};
</script>

<style scoped>
.v-data-table th {
  background-color: var(--v-accentLight-base) !important;
  color: white !important;
}

.v-chip {
  font-weight: 500;
}

@media print {
  .v-dialog__content {
    position: static !important;
  }
}
</style>