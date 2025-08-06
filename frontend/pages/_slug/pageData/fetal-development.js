export default {
  title: 'Fetal Development',
  description: 'Understanding how your baby develops throughout pregnancy - from conception to birth.',
  showModel: false,
  componentType: 'TimelineContentPane', // New: specify which component to use
  layoutType: 'progressive', // New: specify layout style
  renderConfig: {
    showTimeline: true,
    enableProgress: true,
    showWeekNumbers: true
  },
  contentSections: [
    {
      id: 'first-trimester',
      title: 'First Trimester Development (0-12 weeks)',
      icon: 'mdi-baby-face',
      iconColor: 'success',
      items: [
        {
          id: 'weeks-1-4',
          title: 'Weeks 1-4: Fertilization and Implantation',
          icon: 'mdi-circle-small',
          iconColor: 'primary',
          description: 'The journey begins with fertilization and the formation of the blastocyst.',
          list: [
            'Fertilization occurs in the fallopian tube',
            'Cell division begins (zygote to blastocyst)',
            'Implantation in the uterine wall',
            'Formation of the amniotic cavity',
            'Basic cell layers (ectoderm, mesoderm, endoderm) form'
          ]
        },
        {
          id: 'weeks-5-8',
          title: 'Weeks 5-8: Organ Formation',
          icon: 'mdi-heart',
          iconColor: 'error',
          description: 'Critical period of organogenesis when major organs begin to form.',
          list: [
            'Heart begins beating (around week 6)',
            'Neural tube develops (brain and spinal cord)',
            'Limb buds appear',
            'Eyes, ears, and nose begin forming',
            'Digestive system starts developing'
          ]
        },
        {
          id: 'weeks-9-12',
          title: 'Weeks 9-12: Rapid Growth',
          icon: 'mdi-account-child',
          iconColor: 'accent',
          description: 'From embryo to fetus - all major organs are now present.',
          list: [
            'All major organs are formed',
            'Fingers and toes are well-defined',
            'External genitalia develop',
            'Kidneys begin producing urine',
            'Movement begins (not yet felt by mother)'
          ]
        }
      ]
    },
    {
      id: 'second-trimester',
      title: 'Second Trimester Development (13-27 weeks)',
      icon: 'mdi-baby-face-outline',
      iconColor: 'info',
      items: [
        {
          id: 'weeks-13-16',
          title: 'Weeks 13-16: Rapid Growth',
          icon: 'mdi-ruler',
          iconColor: 'success',
          description: 'Period of rapid growth and development of facial features.',
          list: [
            'Facial features become more distinct',
            'Skeleton hardens from cartilage to bone',
            'Hair begins to grow',
            'Digestive system begins functioning',
            'Gender can be determined on ultrasound'
          ]
        },
        {
          id: 'weeks-17-20',
          title: 'Weeks 17-20: Movement and Senses',
          icon: 'mdi-eye',
          iconColor: 'warning',
          description: 'First movements felt by mother and sensory development begins.',
          list: [
            'Mother feels first movements (quickening)',
            'Eyebrows and eyelashes form',
            'Taste buds develop',
            'Hearing begins to develop',
            'Sleep-wake cycles begin'
          ]
        },
        {
          id: 'weeks-21-27',
          title: 'Weeks 21-27: Lung Development',
          icon: 'mdi-lungs',
          iconColor: 'primary',
          description: 'Critical lung development and viability milestone.',
          list: [
            'Lungs develop air sacs (alveoli)',
            'Surfactant production begins',
            'Brain development accelerates',
            'Can respond to sounds and light',
            'Viability threshold reached (around 24 weeks)'
          ]
        }
      ]
    },
    {
      id: 'third-trimester',
      title: 'Third Trimester Development (28-40 weeks)',
      icon: 'mdi-human-pregnant',
      iconColor: 'secondary',
      items: [
        {
          id: 'weeks-28-32',
          title: 'Weeks 28-32: Brain Development',
          icon: 'mdi-brain',
          iconColor: 'accent',
          description: 'Rapid brain development and preparation for life outside the womb.',
          list: [
            'Brain tissue increases rapidly',
            'Eyes can open and close',
            'Bones harden (except skull)',
            'Fat deposits increase',
            'Immune system strengthens'
          ]
        },
        {
          id: 'weeks-33-36',
          title: 'Weeks 33-36: Final Maturation',
          icon: 'mdi-chart-line',
          iconColor: 'info',
          description: 'Final organ maturation and weight gain.',
          list: [
            'Lungs continue maturing',
            'Digestive system nearly complete',
            'Most organs are fully developed',
            'Significant weight gain',
            'Positioning for birth (head down)'
          ]
        },
        {
          id: 'weeks-37-40',
          title: 'Weeks 37-40: Ready for Birth',
          icon: 'mdi-baby-bottle',
          iconColor: 'success',
          description: 'Full term pregnancy - baby is ready for birth.',
          list: [
            'Considered full term at 37 weeks',
            'All organs are mature',
            'Fat continues to accumulate',
            'Antibodies pass from mother',
            'Ready for independent life'
          ]
        }
      ]
    }
  ]
};