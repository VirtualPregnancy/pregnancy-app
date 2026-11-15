<template>
  <div class="fetal-development-timeline">
    <div class="image-crop">
      <img
        :src="getImagePath('/img/pregnancy-journey/fetal-development/trimesters.png')"
        alt='Fetal Development'
        class="image"
      />
    </div>
    <v-timeline
      :reverse="false"
      dense
    >
      <v-timeline-item
        v-for="item in fetalDevelopment"
        :key="item.title"
      >
        <template v-slot:icon>
          <v-icon color="white">{{ item.icon }}</v-icon>
        </template>
        <v-card class="elevation-2">
          <v-card-title class="text-h5">
            <strong>{{ item.title }}</strong>
          </v-card-title>
          <v-card-subtitle>
            <em>{{ item.description }}</em>
          </v-card-subtitle>
          <v-card-text style="white-space: pre-line;">
            <span v-html="item.content"></span>
          </v-card-text>
          <figure v-if="item.images" class="image-figure">
            <div class="subfigure-grid">
              <div
                v-for="(image, index) in item.images"
                :key="image.src"
                class="subfigure"
              >
                <img :src="getImagePath(image.src)" :alt="image.alt" />
                <div class="subfigure-caption">
                  ({{ String.fromCharCode(97 + index) }}) {{ image.caption }}
                </div>
              </div>
            </div>
            <figcaption class="figure-caption" v-html="item.figureCaption"></figcaption>
          </figure>
          <figure v-else-if="item.imageSrc" class="image-figure single-image">
            <img :src="getImagePath(item.imageSrc)" :alt="item.imageAlt" />
            <figcaption>{{ item.imageCaption }}</figcaption>
          </figure>
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
        // TODO: ?can link to tests done at this stage? Important t to find a midwife, blood tests , offered screening for conditions where there are chromosome differences
        {
          title: '1st Trimester',
          description: 'Weeks 1-12 (or Months 1-3)',
          icon: 'mdi-baby-face-outline',
          content: 'After fertilisation, the embryo is implanted in the uterus and vital organs begin to form. \n\nBy week 5, the heart starts beating and the brain, spinal cord, and limbs begin to take shape. By week 9, the embryo has developed into a fetus. \n\nAt the end of the first trimester, the fetus has recognisable features like fingers, toes, and facial contours. The fetus is already moving but the mother can\'t feel this yet.'
        },
        // TODO: ?can link here to anatomy scan, diabetes screening.  Need to check the growth of baby (tapemeasurement uss growth)
        {
          title: '2nd Trimester',
          description: 'Weeks 13-26 (or Months 4-6)',
          icon: 'mdi-baby-bottle-outline',
          content: 'The foundations of the placenta are laid down, allowing blood flow to bring more nutrients and oxygen from mum to the fetus. The developing fetus gets bigger and you can see more features on the scan. \n\nAround week 20, many mothers feel the first movements of their pēpi-to-be. Organs like the lungs and digestive system mature, and the sex of the future pēpi can be determined from an ultrasound scan. \n\nYou can find an example ultrasound scan at <b>20 weeks</b> below.',
          images: [
            {
              src: '/img/pregnancy-journey/fetal-development/Week20_15_Biparietal diameter (BPD).jpg',
              alt: 'Week 20 ultrasound scan showing fetal biparietal diameter.',
              caption: 'Biparietal diameter measurement.'
            },
            {
              src: '/img/pregnancy-journey/fetal-development/Week20_23_Face.jpg',
              alt: 'Week 20 ultrasound scan of face.',
              caption: 'View of the fetal face, with the face labelled in red.'
            }
          ],
          figureCaption: '<small>&copy; 2025 James Lab & Pregnancy Modelling Group. All rights reserved.</small>'
        },
        // TODO: Growth scans as needed
        {
          title: '3rd Trimester',
          description: 'Weeks 27-40 (or Months 7-9)',
          icon: 'mdi-baby',
          content: 'This stage is all about the growth of the fetus. \n\nThe brain develops rapidly, fat accumulates under the skin, and the lungs prepare for breathing. The fetus responds to sounds and light. \n\nAs space in the uterus becomes smaller for the growing fetus, it naturally turns to a position of \'best fit\'. Here, the head faces downwards, getting ready for birth. \n\nYou can find an example ultrasound scan of the fetal head and face at <b>35 weeks</b> below. These scans were taken to monitor fetal blood flow and growth, if there are concerns with the growth and development of pēpi.',
          images: [
            {
              src: '/img/pregnancy-journey/fetal-development/Week35_15_Biparietal diameter (BPD).jpg',
              alt: 'Week 35 ultrasound scan showing fetal biparietal diameter.',
              caption: 'Biparietal diameter measurement.'
            },
            {
              src: '/img/pregnancy-journey/fetal-development/Week35_1_37_Face.jpg',
              alt: 'Week 35 ultrasound scan of face.',
              caption: 'View of the fetal face, with the face labelled in red.'
            }
          ],
          figureCaption: '<small>&copy; 2025 James Lab & Pregnancy Modelling Group. All rights reserved.</small>'
        }
      ]
    }
  },

  methods: {
    getImagePath(imagePath) {
      const basePath = this.$config.basePath || (
        process.env.DEPLOY_ENV === 'GH_PAGES' ? '/pregnancy-app' : ''
      );

      return imagePath && imagePath.startsWith('/')
        ? `${basePath}${imagePath}`
        : imagePath;
    }
  }
}

</script>

<style scoped lang="scss">
.fetal-development-timeline {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.image-crop {
  width: 80%;
  aspect-ratio: 2000 / 1400;
  overflow: hidden;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin: 10px 0;
}

.image {
  width: 125%;
  max-width: none;
  margin-left: -12.5%;
  display: block;
}

.image-figure {
  width: 100%;
  max-width: 700px;
  margin: 20px auto;
  text-align: center;
}

.subfigure-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.subfigure {
  margin: 0;
}

.subfigure img,
.single-image img {
  width: 100%;
  display: block;
}

.subfigure-caption,
.image-figure > figcaption {
  margin-top: 8px;
  font-size: 0.875rem;
}

.figure-caption small {
  font-size: 0.75rem;
}

@media (max-width: 599px) {
  .subfigure-grid {
    grid-template-columns: 1fr;
  }
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
