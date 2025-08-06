export default {
  title: 'When Care Changes',
  description: 'Understanding how your clinical care pathway may change during pregnancy when there are concerns about you or your baby.',
  showModel: false,
  contentSections: [
    {
      id: 'triggers-for-change',
      title: 'When Care Pathways Change',
      icon: 'mdi-heart-cog',
      iconColor: 'warning',
      items: [
        {
          id: 'maternal-conditions',
          title: 'Maternal Health Conditions',
          icon: 'mdi-account-heart',
          iconColor: 'accent',
          description: 'Medical conditions in the mother that may require specialized care.',
          list: [
            'Pre-existing diabetes or gestational diabetes',
            'High blood pressure or pre-eclampsia',
            'Heart disease or other cardiac conditions',
            'Kidney disease or autoimmune conditions',
            'Previous pregnancy complications',
            'Mental health conditions requiring specialized support'
          ]
        },
        {
          id: 'fetal-concerns',
          title: 'Fetal Health Concerns',
          icon: 'mdi-baby-face-outline',
          iconColor: 'error',
          description: 'Conditions affecting the baby that require additional monitoring or intervention.',
          list: [
            'Fetal growth restriction (baby not growing well)',
            'Congenital abnormalities detected on scan',
            'Multiple pregnancy (twins, triplets)',
            'Abnormal placental function or position',
            'Decreased fetal movements',
            'Abnormal amniotic fluid levels'
          ]
        },
        {
          id: 'pregnancy-complications',
          title: 'Pregnancy Complications',
          icon: 'mdi-alert-circle',
          iconColor: 'primary',
          description: 'Complications that develop during pregnancy requiring enhanced care.',
          list: [
            'Bleeding in pregnancy',
            'Preterm labor or risk of early delivery',
            'Infection during pregnancy',
            'Severe morning sickness (hyperemesis)',
            'Placental problems (previa, abruption)',
            'Cervical incompetence'
          ]
        }
      ]
    },
    {
      id: 'care-team-changes',
      title: 'Changes to Your Care Team',
      icon: 'mdi-account-group',
      iconColor: 'info',
      items: [
        {
          id: 'specialist-involvement',
          title: 'Specialist Care Involvement',
          icon: 'mdi-medical-bag',
          iconColor: 'primary',
          description: 'When and why specialists become involved in your care.',
          list: [
            'Obstetrician consultation for medical complications',
            'Maternal-fetal medicine specialist for high-risk conditions',
            'Endocrinologist for diabetes management',
            'Cardiologist for heart conditions',
            'Geneticist for genetic concerns',
            'Psychiatrist for mental health support'
          ]
        },
        {
          id: 'multidisciplinary-team',
          title: 'Multidisciplinary Team Approach',
          icon: 'mdi-account-multiple',
          iconColor: 'success',
          description: 'How different healthcare professionals work together for your care.',
          list: [
            'Your LMC remains central to your care',
            'Regular communication between all team members',
            'Coordinated care planning meetings',
            'Shared decision-making with your input',
            'Clear roles and responsibilities defined',
            'Seamless transitions between different levels of care'
          ]
        },
        {
          id: 'hospital-based-care',
          title: 'Hospital-Based Care',
          icon: 'mdi-hospital-building',
          iconColor: 'accent',
          description: 'When hospital-based care becomes necessary.',
          list: [
            'More frequent monitoring appointments',
            'Specialized testing and investigations',
            'Admission for observation or treatment',
            'Planning for delivery in hospital setting',
            'Access to neonatal intensive care if needed',
            'Coordinated postnatal care planning'
          ]
        }
      ]
    },
    {
      id: 'care-planning',
      title: 'Care Planning and Communication',
      icon: 'mdi-clipboard-text',
      iconColor: 'success',
      items: [
        {
          id: 'individualized-care',
          title: 'Individualized Care Plans',
          icon: 'mdi-account-edit',
          iconColor: 'primary',
          description: 'How care plans are tailored to your specific needs and circumstances.',
          list: [
            'Assessment of your specific risk factors',
            'Regular review and updating of care plans',
            'Consideration of your preferences and values',
            'Cultural and social factors incorporated',
            'Family circumstances and support systems',
            'Clear documentation of care decisions'
          ]
        },
        {
          id: 'communication-strategies',
          title: 'Enhanced Communication',
          icon: 'mdi-message-text',
          iconColor: 'info',
          description: 'How communication improves when care becomes more complex.',
          list: [
            'More frequent contact with your healthcare team',
            'Clear explanation of why care is changing',
            'Written information and care plans provided',
            'Opportunity to ask questions and express concerns',
            'Involvement of partner or support person',
            'Access to interpreter services if needed'
          ]
        },
        {
          id: 'emergency-planning',
          title: 'Emergency Planning',
          icon: 'mdi-phone-alert',
          iconColor: 'error',
          description: 'Planning for emergency situations when care is more complex.',
          list: [
            'Clear instructions on when to seek help',
            'Emergency contact numbers provided',
            'Hospital admission protocols established',
            'Delivery planning for emergency situations',
            'Communication with emergency services',
            'Family notification procedures'
          ]
        }
      ]
    },
    {
      id: 'support-resources',
      title: 'Additional Support and Resources',
      icon: 'mdi-hands-helping',
      iconColor: 'accent',
      items: [
        {
          id: 'emotional-support',
          title: 'Emotional and Psychological Support',
          icon: 'mdi-heart',
          iconColor: 'error',
          description: 'Support services to help cope with changes in your care.',
          list: [
            'Counseling services for anxiety or stress',
            'Peer support groups for similar conditions',
            'Social work support for practical issues',
            'Mental health services if needed',
            'Chaplaincy or spiritual care services',
            'Family support and education programs'
          ]
        },
        {
          id: 'practical-support',
          title: 'Practical Support Services',
          icon: 'mdi-tools',
          iconColor: 'warning',
          description: 'Practical help to manage the challenges of complex pregnancy care.',
          list: [
            'Transport assistance for frequent appointments',
            'Accommodation support if traveling for care',
            'Financial assistance programs if available',
            'Childcare support for other children',
            'Work and employment guidance',
            'Disability and accessibility services'
          ]
        },
        {
          id: 'information-resources',
          title: 'Information and Education Resources',
          icon: 'mdi-book-open-variant',
          iconColor: 'info',
          description: 'Resources to help you understand your condition and care.',
          list: [
            'Written information about your specific condition',
            'Educational materials about treatments and procedures',
            'Access to reliable online resources',
            'Connection with condition-specific organizations',
            'Preparation classes for complex delivery',
            'Resources for partners and family members'
          ]
        }
      ]
    }
  ]
};