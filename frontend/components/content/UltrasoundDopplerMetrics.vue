<template>
  <div>
    <div class="d-flex flex-row gap-4 mt-4 mb-4 justify-center">
      <v-card
        v-for="item in cardItems"
        :key="item.title"
        :style="{ background: item.color, color: 'white' }"
      >
        <v-card-title style="color: white">{{ item.title }}</v-card-title>
        <v-card-text style="color: white">{{ item.content }}</v-card-text>
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

     <!-- PI Checker -->
     <v-card class="my-6 pa-4" outlined>
      <div class="flex justify-center align-center flex-column">
      <h3 class="mb-4">QuickPI Value Checker</h3>

      <div class="width-full d-flex  gap-4">
        
        <v-text-field
          v-model.number="week"
          label="Gestational Week (18-40)"
          type="number"
          min="18"
          max="40"
          outlined
          dense
          style="width: 70%"
          
        />

        <v-select
          v-model="artery"
          :items="['umbilical', 'uterine']"
          label="Artery"
          outlined
          dense
        />

        <v-text-field
          v-model.number="piValue"
          label="PI Value"
          type="number"
          step="0.01"
          outlined
          dense
        />
        </div>
         <!-- divider -->
        <div>

        <v-btn color="primary" @click="check" :disabled="!isValid">
          Check
        </v-btn>

        <v-btn @click="clear" v-if="hasInput"> Clear </v-btn>
      </div>
    </div>

      <div v-if="result" :class="`pa-3 rounded ${resultClass}`">
        <strong>{{ result.status }}</strong
        ><br />
        {{ result.message }}
      </div>
    </v-card>

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
            <v-tab v-for="item in dialogData" :key="item.title">
              <v-icon left>mdi-heart</v-icon>
              {{ item.title }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <!-- Uterine Artery Table -->
            <v-tab-item v-for="item in dialogData" :key="item.title">
              <div class="pa-6">
                <v-alert
                  type="info"
                  outlined
                  class="mb-4"
                  style="border-color: var(--v-accent-base)"
                >
                  <div class="text-sm">
                    <strong>{{ item.title }}:</strong> {{ item.content }}
                  </div>
                </v-alert>

                <v-data-table
                  :headers="item.headers"
                  :items="item.data"
                  hide-default-footer
                  :items-per-page="-1"
                  class="elevation-1"
                />
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>

        <v-card-text style="background: var(--v-background-base)">
          <div class="text-sm" style="color: var(--v-text-color)">
            <v-icon small color="accent" class="mr-2"
              >mdi-book-open-outline</v-icon
            >
            <strong>References:</strong>
            <br />
            * Acharya G, et al. Reference ranges for serial measurements of
            blood velocity and pulsatility index at the intra-abdominal portion,
            and fetal and placental ends of umbilical artery. Ultrasound Obstet
            Gynecol 2005; 26:162-169.s
            <br />
             <a
              href="https://www.tewhatuora.govt.nz/assets/For-the-health-sector/Maternity-Services/NZMFMN-Obstetric-Doppler-Guideline-2015.pdf"
              target="_blank"
              >New Zealand Obstetric Doppler Guideline
            </a>
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
      week: null,
      artery: null,
      piValue: null,
      result: null,
      cardItems: [
        {
          title: "Resistive Index (RI)",
          color: "var(--v-accentLight-base)",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },

        {
          title: "Pulsatility Index (PI)",
          color: "var(--v-accent-base)",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },

        {
          title: "S/D Ratio",
          color: "var(--v-success-base)",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      ],
      dialogData: [
        {
          title: "Umbilical Artery PI",
          content: "> 95th percentile is abnormal",
          headers: [
            {
              text: "Gestation Weeks",
              value: "gestation",
              sortable: false,
              width: "33%",
            },
            {
              text: "50th percentile",
              value: "percentile50",
              sortable: false,
              width: "33%",
            },
            {
              text: "95th percentile",
              value: "percentile95",
              sortable: false,
              width: "34%",
            },
          ],
          data: [
            { gestation: "19", percentile50: "1.25*", percentile95: "1.63*" },
            { gestation: "20", percentile50: "1.22*", percentile95: "1.59*" },
            { gestation: "21", percentile50: "1.15", percentile95: "1.46" },
            { gestation: "22", percentile50: "1.13", percentile95: "1.43" },
            { gestation: "23", percentile50: "1.10", percentile95: "1.40" },
            { gestation: "24", percentile50: "1.08", percentile95: "1.38" },
            { gestation: "25", percentile50: "1.06", percentile95: "1.35" },
            { gestation: "26", percentile50: "1.04", percentile95: "1.33" },
            { gestation: "27", percentile50: "1.02", percentile95: "1.31" },
            { gestation: "28", percentile50: "1.00", percentile95: "1.28" },
            { gestation: "29", percentile50: "0.98", percentile95: "1.26" },
            { gestation: "30", percentile50: "0.96", percentile95: "1.24" },
            { gestation: "31", percentile50: "0.94", percentile95: "1.21" },
            { gestation: "32", percentile50: "0.92", percentile95: "1.19" },
            { gestation: "33", percentile50: "0.90", percentile95: "1.16" },
            { gestation: "34", percentile50: "0.88", percentile95: "1.14" },
            { gestation: "35", percentile50: "0.86", percentile95: "1.11" },
            { gestation: "36", percentile50: "0.84", percentile95: "1.09" },
            { gestation: "37", percentile50: "0.81", percentile95: "1.06" },
            { gestation: "38", percentile50: "0.79", percentile95: "1.03" },
            { gestation: "39", percentile50: "0.77", percentile95: "1.00" },
            { gestation: "40", percentile50: "0.75*", percentile95: "1.07*" },
          ],
        },
        {
          title: "Mean Uterine Artery PI",
          content:
            "Mean PI = (RT PI + LT PI) / 2. >95th percentile is abnormal",
          headers: [
            {
              text: "Gestation Weeks",
              value: "gestation",
              sortable: false,
              width: "33%",
            },
            {
              text: "50th percentile",
              value: "percentile50",
              sortable: false,
              width: "33%",
            },
            {
              text: "95th percentile",
              value: "percentile95",
              sortable: false,
              width: "34%",
            },
          ],
          data: [
            { gestation: "18", percentile50: "1.20", percentile95: "1.79" },
            { gestation: "19", percentile50: "1.15", percentile95: "1.70" },
            { gestation: "20", percentile50: "1.10", percentile95: "1.61" },
            { gestation: "21", percentile50: "1.05", percentile95: "1.54" },
            { gestation: "22", percentile50: "1.00", percentile95: "1.47" },
            { gestation: "23", percentile50: "0.96", percentile95: "1.41" },
            { gestation: "24", percentile50: "0.93", percentile95: "1.35" },
            { gestation: "25", percentile50: "0.89", percentile95: "1.30" },
            { gestation: "26", percentile50: "0.86", percentile95: "1.25" },
            { gestation: "27", percentile50: "0.84", percentile95: "1.21" },
            { gestation: "28", percentile50: "0.81", percentile95: "1.17" },
            { gestation: "29", percentile50: "0.79", percentile95: "1.13" },
            { gestation: "30", percentile50: "0.77", percentile95: "1.10" },
            { gestation: "31", percentile50: "0.75", percentile95: "1.06" },
            { gestation: "32", percentile50: "0.73", percentile95: "1.04" },
            { gestation: "33", percentile50: "0.71", percentile95: "1.01" },
            { gestation: "34", percentile50: "0.70", percentile95: "0.99" },
            { gestation: "35", percentile50: "0.69", percentile95: "0.97" },
            { gestation: "36", percentile50: "0.68", percentile95: "0.95" },
            { gestation: "37", percentile50: "0.67", percentile95: "0.94" },
            { gestation: "38", percentile50: "0.66", percentile95: "0.92" },
            { gestation: "39", percentile50: "0.65", percentile95: "0.91" },
            { gestation: "40", percentile50: "0.65", percentile95: "0.90" },
          ],
        },
      ],
    };
  },

  computed: {
    isValid() {
      return (
        this.week >= 18 && this.week <= 40 && this.artery && this.piValue > 0
      );
    },

    hasInput() {
      return this.week || this.artery || this.piValue;
    },

    resultClass() {
      if (!this.result) return "";
      return this.result.abnormal
        ? "error--text bg-red-50"
        : this.result.high
        ? "warning--text bg-orange-50"
        : "success--text bg-green-50";
    },
  },

  methods: {
    check() {
      if (!this.isValid) return;

      const data = this.dialogData
        .find((d) => d.title.toLowerCase().includes(this.artery))
        ?.data.find((w) => parseInt(w.gestation) === this.week);

      if (!data) {
        this.result = {
          status: "No Data",
          message: `No reference data for week ${this.week}`,
          abnormal: false,
          high: true,
        };
        return;
      }

      const p95 = parseFloat(data.percentile95.replace("*", ""));
      const p50 = parseFloat(data.percentile50.replace("*", ""));

      if (this.piValue > p95) {
        this.result = {
          status: "ABNORMAL",
          message: `${this.piValue} > ${p95} (95th percentile). Consult healthcare provider.`,
          abnormal: true,
          high: false,
        };
      } else if (this.piValue > p50) {
        this.result = {
          status: "Normal - Above Average",
          message: `${this.piValue} is between 50th (${p50}) and 95th (${p95}) percentile.`,
          abnormal: false,
          high: false,
        };
      } else {
        this.result = {
          status: "Normal ",
          message: `${this.piValue} ≤ ${p50} (50th percentile)`,
          abnormal: false,
          high: false,
        };
      }
    },

    clear() {
      this.week = null;
      this.artery = null;
      this.piValue = null;
      this.result = null;
    },
  },
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