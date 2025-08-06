export default {
  title: 'Checking Baby\'s Health',
  description: 'Learn about the various methods healthcare providers use to monitor your baby\'s health and development throughout pregnancy.',
  showModel: false,
  contentSections: [
    {
      id: 'routine-monitoring',
      title: 'Routine Health Monitoring',
      icon: 'mdi-stethoscope',
      iconColor: 'primary',
      items: [
        {
          id: 'antenatal-visits',
          title: 'Regular Antenatal Visits',
          icon: 'mdi-calendar-check',
          iconColor: 'success',
          description: 'Scheduled appointments to monitor both mother and baby throughout pregnancy.',
          list: [
            'Monthly visits until 28 weeks',
            'Fortnightly visits from 28-36 weeks',
            'Weekly visits from 36 weeks until birth',
            'Blood pressure and urine checks',
            'Weight monitoring and fundal height measurement',
            'Listening to baby\'s heartbeat'
          ]
        },
        {
          id: 'fetal-movement',
          title: 'Fetal Movement Monitoring',
          icon: 'mdi-baby-face-outline',
          iconColor: 'accent',
          description: 'Understanding and tracking your baby\'s movements as an indicator of wellbeing.',
          interactive: true, // Enable interactive content slot
          list: [
            'First movements felt around 18-25 weeks',
            'Regular movement patterns develop by 28 weeks',
            'Daily fetal movement counting (kick counts)',
            'Changes in movement patterns may indicate concern',
            'When to contact healthcare provider about movements'
          ]
        },
        {
          id: 'growth-assessment',
          title: 'Growth and Development Assessment',
          icon: 'mdi-chart-line',
          iconColor: 'info',
          description: 'Monitoring how well your baby is growing throughout pregnancy.',
          list: [
            'Fundal height measurements',
            'Ultrasound growth scans',
            'Estimated fetal weight calculations',
            'Growth percentile tracking',
            'Detection of growth restriction or macrosomia'
          ]
        }
      ]
    },
    {
      id: 'diagnostic-tests',
      title: 'Diagnostic Tests and Scans',
      icon: 'mdi-microscope',
      iconColor: 'warning',
      items: [
        {
          id: 'ultrasound-scans',
          title: 'Ultrasound Examinations',
          icon: 'mdi-monitor',
          iconColor: 'primary',
          description: 'Using sound waves to visualize baby\'s development and detect potential issues.',
          list: [
            'Dating scan (8-14 weeks) - confirms due date',
            'Anatomy scan (18-22 weeks) - checks structures',
            'Growth scans - monitors fetal growth',
            'Doppler studies - assesses blood flow',
            '3D/4D scans for detailed imaging'
          ]
        },
        {
          id: 'screening-tests',
          title: 'Screening Tests',
          icon: 'mdi-test-tube',
          iconColor: 'accent',
          description: 'Tests that assess the risk of chromosomal abnormalities and other conditions.',
          list: [
            'First trimester combined screening (11-14 weeks)',
            'Second trimester screening (15-20 weeks)',
            'Non-invasive prenatal testing (NIPT)',
            'Glucose tolerance test (diabetes screening)',
            'Group B Strep screening (35-37 weeks)'
          ]
        },
        {
          id: 'diagnostic-procedures',
          title: 'Diagnostic Procedures',
          icon: 'mdi-medical-bag',
          iconColor: 'error',
          description: 'More definitive tests when screening indicates potential issues.',
          list: [
            'Chorionic villus sampling (CVS) - 10-13 weeks',
            'Amniocentesis - 15-20 weeks',
            'Fetal blood sampling (cordocentesis)',
            'Detailed fetal echocardiogram',
            'Fetal MRI for complex conditions'
          ]
        }
      ]
    },
    {
      id: 'fetal-wellbeing',
      title: 'Assessing Fetal Wellbeing',
      icon: 'mdi-heart-pulse',
      iconColor: 'success',
      items: [
        {
          id: 'heart-rate-monitoring',
          title: 'Fetal Heart Rate Monitoring',
          icon: 'mdi-heart',
          iconColor: 'error',
          description: 'Monitoring baby\'s heart rate patterns to assess wellbeing.',
          list: [
            'Routine listening with doppler at visits',
            'Non-stress test (NST) - monitors heart rate patterns',
            'Biophysical profile combines NST with ultrasound',
            'Contraction stress test if needed',
            'Continuous monitoring during labor'
          ]
        },
        {
          id: 'amniotic-fluid',
          title: 'Amniotic Fluid Assessment',
          icon: 'mdi-water',
          iconColor: 'info',
          description: 'Monitoring the amount and quality of amniotic fluid around baby.',
          list: [
            'Normal fluid levels indicate healthy kidneys',
            'Too little fluid (oligohydramnios) may indicate problems',
            'Too much fluid (polyhydramnios) can suggest complications',
            'Ultrasound measurement of fluid pockets',
            'Assessment of fluid clarity and composition'
          ]
        },
        {
          id: 'placental-function',
          title: 'Placental Function Testing',
          icon: 'mdi-bowl-outline',
          iconColor: 'warning',
          description: 'Ensuring the placenta is providing adequate support for baby.',
          list: [
            'Doppler ultrasound of umbilical arteries',
            'Middle cerebral artery Doppler studies',
            'Placental grading and maturity assessment',
            'Uterine artery Doppler (first trimester)',
            'Placental hormone level monitoring'
          ]
        }
      ]
    },
    {
      id: 'warning-signs',
      title: 'When to Seek Help',
      icon: 'mdi-alert-circle',
      iconColor: 'error',
      items: [
        {
          id: 'movement-concerns',
          title: 'Fetal Movement Concerns',
          icon: 'mdi-baby-face',
          iconColor: 'warning',
          description: 'Signs that warrant immediate medical attention regarding baby\'s movements.',
          list: [
            'Significant decrease in fetal movements',
            'No movements felt for several hours after 28 weeks',
            'Change in movement patterns',
            'Sudden increase in violent movements followed by stillness',
            'Any concerns about movement patterns'
          ]
        },
        {
          id: 'other-warning-signs',
          title: 'Other Warning Signs',
          icon: 'mdi-alert',
          iconColor: 'error',
          description: 'Additional symptoms that may indicate baby is in distress.',
          list: [
            'Severe or persistent abdominal pain',
            'Vaginal bleeding at any stage',
            'Sudden gush of fluid (possible membrane rupture)',
            'Severe headaches with visual changes',
            'Signs of preterm labor before 37 weeks'
          ]
        }
      ]
    }
  ]
};