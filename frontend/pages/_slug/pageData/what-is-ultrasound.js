export default {
  title: 'What is Ultrasound',
  description: 'Understanding ultrasound technology, how it works, and what to expect during your ultrasound scans.',
  showModel: false,
  componentType: 'ContentPane',
  layoutType: 'educational',
  contentSections: [
    {
      id: 'ultrasound-basics',
      title: 'Understanding Ultrasound Technology',
      icon: 'mdi-help-circle',
      iconColor: 'primary',
      items: [
        {
          id: 'how-ultrasound-works',
          title: 'How Ultrasound Works',
          icon: 'mdi-wave',
          iconColor: 'info',
          description: 'The science behind ultrasound imaging and how it creates pictures of your baby.',
          list: [
            'Uses high-frequency sound waves (2-18 MHz)',
            'Sound waves bounce off tissues and organs',
            'Computer processes returning echoes into images',
            'Real-time imaging shows movement',
            'No harmful radiation - completely safe'
          ]
        },
        {
          id: 'types-of-ultrasound',
          title: 'Types of Ultrasound',
          icon: 'mdi-monitor-multiple',
          iconColor: 'accent',
          description: 'Different types of ultrasound technology and their specific uses.',
          list: [
            '2D ultrasound - standard flat images',
            '3D ultrasound - three-dimensional images',
            '4D ultrasound - 3D images in real-time motion',
            'Doppler ultrasound - measures blood flow',
            'Transvaginal ultrasound - internal probe for early pregnancy'
          ]
        },
        {
          id: 'safety-concerns',
          title: 'Safety and Limitations',
          icon: 'mdi-shield-check',
          iconColor: 'success',
          description: 'Understanding the safety profile and limitations of ultrasound.',
          list: [
            'No known harmful effects on mother or baby',
            'Used safely for decades in pregnancy',
            'Cannot see everything - some conditions may be missed',
            'Image quality depends on position and maternal factors',
            'Performed by trained healthcare professionals'
          ]
        }
      ]
    },
    {
      id: 'pregnancy-ultrasounds',
      title: 'Ultrasounds During Pregnancy',
      icon: 'mdi-calendar-month',
      iconColor: 'success',
      items: [
        {
          id: 'first-trimester-scans',
          title: 'First Trimester Scans (6-14 weeks)',
          icon: 'mdi-numeric-1-circle',
          iconColor: 'primary',
          description: 'Early pregnancy scans to confirm pregnancy and assess development.',
          list: [
            'Dating scan - confirms pregnancy age and due date',
            'Viability scan - checks for heartbeat',
            'Multiple pregnancy detection',
            'Early anatomy assessment',
            'Nuchal translucency screening (11-14 weeks)'
          ]
        },
        {
          id: 'second-trimester-scans',
          title: 'Second Trimester Scans (14-28 weeks)',
          icon: 'mdi-numeric-2-circle',
          iconColor: 'accent',
          description: 'Detailed anatomy scans and growth monitoring.',
          list: [
            'Anatomy scan (18-22 weeks) - detailed structural assessment',
            'Gender determination (if desired)',
            'Placental location and assessment',
            'Amniotic fluid levels',
            'Growth and development monitoring'
          ]
        },
        {
          id: 'third-trimester-scans',
          title: 'Third Trimester Scans (28-40 weeks)',
          icon: 'mdi-numeric-3-circle',
          iconColor: 'warning',
          description: 'Growth monitoring and preparation for delivery.',
          list: [
            'Growth scans - monitoring fetal size',
            'Placental function assessment',
            'Baby\'s position and presentation',
            'Amniotic fluid levels',
            'Umbilical cord blood flow studies'
          ]
        }
      ]
    },
    {
      id: 'what-to-expect',
      title: 'What to Expect During Your Scan',
      icon: 'mdi-information-outline',
      iconColor: 'info',
      items: [
        {
          id: 'preparing-for-scan',
          title: 'Preparing for Your Ultrasound',
          icon: 'mdi-clipboard-check',
          iconColor: 'success',
          description: 'How to prepare for your ultrasound appointment.',
          list: [
            'Early scans may require full bladder',
            'Wear comfortable, easily accessible clothing',
            'Bring partner or support person if desired',
            'List any questions you want to ask',
            'Allow adequate time for the appointment'
          ]
        },
        {
          id: 'during-the-scan',
          title: 'During the Examination',
          icon: 'mdi-account-search',
          iconColor: 'primary',
          description: 'What happens during your ultrasound examination.',
          list: [
            'Warm gel applied to your abdomen',
            'Transducer moved across your belly',
            'Images displayed on screen in real-time',
            'Measurements and assessments taken',
            'Pictures may be printed for you to take home'
          ]
        },
        {
          id: 'interpreting-results',
          title: 'Understanding Your Results',
          icon: 'mdi-chart-line',
          iconColor: 'accent',
          description: 'How ultrasound results are interpreted and communicated.',
          list: [
            'Sonographer performs the scan',
            'Doctor or specialist interprets results',
            'Normal variations vs. concerning findings',
            'Follow-up scans may be recommended',
            'Results discussed with your healthcare provider'
          ]
        }
      ]
    },
    {
      id: 'advanced-ultrasound',
      title: 'Advanced Ultrasound Techniques',
      icon: 'mdi-cog',
      iconColor: 'warning',
      items: [
        {
          id: 'doppler-studies',
          title: 'Doppler Ultrasound Studies',
          icon: 'mdi-chart-areaspline',
          iconColor: 'error',
          description: 'Specialized ultrasound to assess blood flow patterns.',
          list: [
            'Measures blood flow in umbilical cord',
            'Assesses placental blood supply',
            'Evaluates baby\'s brain blood flow',
            'Detects circulation problems',
            'Guides management of high-risk pregnancies'
          ]
        },
        {
          id: 'fetal-echocardiography',
          title: 'Fetal Echocardiography',
          icon: 'mdi-heart',
          iconColor: 'accent',
          description: 'Specialized heart scan to assess fetal cardiac development.',
          list: [
            'Detailed assessment of baby\'s heart',
            'Detects congenital heart defects',
            'Usually performed 18-24 weeks',
            'Recommended for high-risk pregnancies',
            'Guides planning for delivery and newborn care'
          ]
        },
        {
          id: 'specialized-imaging',
          title: 'Other Specialized Imaging',
          icon: 'mdi-camera-enhance',
          iconColor: 'info',
          description: 'Additional imaging techniques when needed.',
          list: [
            'Fetal MRI for complex conditions',
            'Volume imaging for detailed 3D assessment',
            'Elastography to assess tissue stiffness',
            'Contrast-enhanced ultrasound (rare in pregnancy)',
            'Research applications and new technologies'
          ]
        }
      ]
    }
  ]
};