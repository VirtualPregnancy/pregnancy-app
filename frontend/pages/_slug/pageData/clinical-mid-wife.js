export default {
  title: 'Clinical Care',
  description: 'Clinical care pathways for pregnancy in Aotearoa NZ. Understand what to expect during midwife and doctor visits, and how care pathways adapt when there are concerns.',
  showModel: false,
  contentSections: [
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
  ]
};