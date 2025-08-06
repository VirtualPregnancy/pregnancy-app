export default {
  title: 'About Us',
  description: 'Support services available for pregnant people and their whānau. Find out about available support services and how to access them.',
  showModel: false,
  contentSections: [
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
};