<template>
  <div class="fetal-development-timeline">
    <v-timeline side="end" align="start">
      <!-- First Trimester -->
      <v-timeline-item
        dot-color="white"
        size="large"
        v-for="item in fetalDevelopment"
        :key="item.title"
      >
        <template v-slot:icon>
          <v-icon color="white">{{ item.icon }}</v-icon>
        </template>
        <template v-slot:opposite>
          <div class="text-h6 font-weight-bold ">
            {{ item.title }}
          </div>
          <div class="text-subtitle-1 text--secondary">
            {{ item.description }}
          </div>
        </template>
        <v-card class="elevation-2">
          <v-card-text>
            <p>
              {{ item.content }}
            </p>
          </v-card-text>
        </v-card>
      </v-timeline-item>

    </v-timeline>
  </div>
</template>

<script>
export default {
  name: 'PregnancyFetalDev',
  data() {
    return {
      fetalDevelopment: [
        {
          title: 'First Trimester',
          description: 'Weeks 1-12',
          icon: 'mdi-baby-face-outline',
          content: 'After fertilization, the embryo implants in the uterus and begins forming vital organs. By week 5, the heart starts beating. The brain, spinal cord, and limbs begin to take shape, and by the end of the first trimester, the fetus has recognizable features like fingers, toes, and facial contours. Though still tiny, it\'s already moving—though the mother can\'t feel it yet.'
        },
        {
          title: 'Second Trimester',
          description: 'Weeks 13-26',
          icon: 'mdi-baby-bottle-outline',
          content: 'In the second trimester of pregnancy, with the foundations of the placenta laid down and maternal blood flow bringing more nutrients and oxygen to the placenta, fetal development can really start to accelerate. The fetus develops fine hair (lanugo), fingerprints, and begins practicing movements like sucking and swallowing. Around week 20, many mothers feel the first movements of their baby. Organs like the lungs and digestive system mature, and the baby can often be seen on an ultrasound.'
        },
        {
          title: 'Third Trimester',
          description: 'Weeks 27-40',
          icon: 'mdi-baby',
          content: 'The final trimester of pregnancy is all about growth and fine-tuning. The brain develops rapidly, fat accumulates under the skin, and the lungs prepare for breathing. The baby responds to sounds and light. As space in the uterus becomes more constrained, the baby will usually naturally turn to a position of \'best fit\' with its head is facing downwards, ready for birth.'
        }
      ]
    }
  }
}

</script>

<style scoped lang="scss">
.fetal-development-timeline {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

::v-deep .v-timeline {
  padding-top: 0;
}

::v-deep .v-timeline-item__dot {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

::v-deep .v-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }
}

::v-deep .v-timeline-item__opposite {
  padding-right: 24px;
  
  @media (max-width: 959px) {
    padding-right: 16px;
  }
}

.text-h6 {
  margin-bottom: 4px;
}

.text-subtitle-1 {
  font-weight: 500;
}

@media (max-width: 599px) {
  .fetal-development-timeline {
    padding: 16px;
  }
  
  ::v-deep .v-timeline-item__opposite {
    min-width: 120px;
  }
}
</style>
