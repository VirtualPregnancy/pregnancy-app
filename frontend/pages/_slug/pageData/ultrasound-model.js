export default {
  title: 'Ultrasound Technology',
  description: 'Understand ultrasound technology, waveforms, Doppler measurements, and use interactive tools to interpret your scan results and metrics.',
  showModel: false,
  contentSections: [
    {
      id: 'ultrasound-technology',
      title: 'Ultrasound Technology',
      icon: 'mdi-monitor',
      iconColor: 'info',
      items: [
        {
          id: 'how-ultrasound-works',
          title: 'How Ultrasound Works',
          icon: 'mdi-wave',
          iconColor: 'primary',
          description: 'Ultrasound uses high-frequency sound waves to create images of your baby and placenta.',
          list: [
            'Sound waves bounce off tissues',
            'Computer creates real-time images',
            'No radiation exposure',
            'Safe for mother and baby',
            'Can show movement and blood flow'
          ]
        },
        {
          id: 'doppler-measurements',
          title: 'Doppler Measurements',
          icon: 'mdi-chart-line',
          iconColor: 'accent',
          description: 'Doppler ultrasound measures blood flow in the placenta and umbilical cord.',
          list: [
            'Umbilical artery resistance index',
            'Middle cerebral artery flow',
            'Ductus venosus flow',
            'Uterine artery resistance',
            'Placental blood flow assessment'
          ]
        }
      ]
    },
    {
      id: 'scan-interpretation',
      title: 'Understanding Your Scan',
      icon: 'mdi-eye',
      iconColor: 'success',
      items: [
        {
          id: 'normal-measurements',
          title: 'Normal Measurements',
          icon: 'mdi-check-circle',
          iconColor: 'success',
          description: 'What normal ultrasound measurements look like and what they mean.',
          list: [
            'Crown-rump length (CRL)',
            'Biparietal diameter (BPD)',
            'Abdominal circumference (AC)',
            'Femur length (FL)',
            'Estimated fetal weight'
          ]
        },
        {
          id: 'abnormal-findings',
          title: 'Abnormal Findings',
          icon: 'mdi-alert',
          iconColor: 'warning',
          description: 'When ultrasound shows concerns and what happens next.',
          list: [
            'Growth restriction',
            'Placental problems',
            'Amniotic fluid issues',
            'Structural abnormalities',
            'Follow-up testing needed'
          ]
        }
      ]
    }
  ]
};