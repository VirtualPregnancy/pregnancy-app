export default {
  // Pages that should show 3D model
  modelPages: ['pregnancy-changes', 'conditions-fetal'],
  
  // Page titles
  titles: {
    'clinical-mid-wife': 'Clinical Care',
    'ultrasound-model': 'Ultrasound Technology',
    'about': 'About Us'
  },
  
  // Page descriptions
  descriptions: {
    'clinical-mid-wife': 'Clinical care pathways for pregnancy in Aotearoa NZ. Understand what to expect during midwife and doctor visits, and how care pathways adapt when there are concerns.',
    'ultrasound-model': 'Understand ultrasound technology, waveforms, Doppler measurements, and use interactive tools to interpret your scan results and metrics.',
    'about': 'Support services available for pregnant people and their whānau. Find out about available support services and how to access them.'
  },
  
  // Page content sections
  contentSections: {
    'clinical-mid-wife': [
      {
        id: 'midwife-care',
        title: 'Midwife Care',
        icon: 'mdi-account-group',
        iconColor: 'success',
        items: [
          {
            id: 'lead-maternity-carer',
            title: 'Lead Maternity Carer (LMC)',
            icon: 'mdi-compass-outline',
            iconColor: 'primary',
            description: 'Your LMC is your primary healthcare provider during pregnancy, birth, and the postnatal period.',
            list: [
              'Regular antenatal appointments',
              'Birth planning and preparation',
              'Labour and birth support',
              'Postnatal care for 6 weeks',
              'Referral to specialists if needed'
            ]
          },
          {
            id: 'antenatal-appointments',
            title: 'Antenatal Appointments',
            icon: 'mdi-calendar-check',
            iconColor: 'info',
            description: 'Regular check-ups to monitor your health and your baby\'s development.',
            list: [
              'Monthly appointments until 28 weeks',
              'Fortnightly appointments 28-36 weeks',
              'Weekly appointments from 36 weeks',
              'Blood pressure and urine checks',
              'Fetal heart rate monitoring',
              'Growth and position assessment'
            ]
          }
        ]
      },
      {
        id: 'doctor-care',
        title: 'Doctor Care',
        icon: 'mdi-medical-bag',
        iconColor: 'warning',
        items: [
          {
            id: 'specialist-referrals',
            title: 'Specialist Referrals',
            icon: 'mdi-hospital-building',
            iconColor: 'accent',
            description: 'When additional medical care is needed, your LMC will refer you to appropriate specialists.',
            list: [
              'Obstetrician consultation',
              'Maternal-fetal medicine specialist',
              'Endocrinologist for diabetes',
              'Cardiologist for heart conditions',
              'Genetic counsellor if needed'
            ]
          },
          {
            id: 'high-risk-pregnancy',
            title: 'High-Risk Pregnancy Care',
            icon: 'mdi-alert-circle-outline',
            iconColor: 'error',
            description: 'Specialized care for pregnancies with medical complications or risk factors.',
            list: [
              'More frequent appointments',
              'Specialized monitoring',
              'Hospital-based care if needed',
              'Multidisciplinary team approach',
              'Individualized care plans'
            ]
          }
        ]
      }
    ],
    
    'ultrasound-model': [
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
    ],
    
    'about': [
      {
        id: 'support-services',
        title: 'Support Services',
        icon: 'mdi-heart',
        iconColor: 'error',
        items: [
          {
            id: 'mental-health',
            title: 'Mental Health Support',
            icon: 'mdi-brain',
            iconColor: 'accent',
            description: 'Specialized mental health support during pregnancy and postpartum.',
            list: [
              'Perinatal mental health services',
              'Counselling and therapy',
              'Support groups',
              'Crisis intervention',
              'Postnatal depression support'
            ]
          },
          {
            id: 'practical-support',
            title: 'Practical Support',
            icon: 'mdi-hands-helping',
            iconColor: 'success',
            description: 'Practical help with daily tasks and pregnancy needs.',
            list: [
              'Transportation assistance',
              'Meal preparation',
              'Household help',
              'Financial support',
              'Equipment and supplies'
            ]
          }
        ]
      }
    ]
  }
}; 