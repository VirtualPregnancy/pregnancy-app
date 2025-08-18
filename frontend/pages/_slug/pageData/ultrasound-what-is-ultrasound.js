export default {
  title: 'What is ultrasound, and what does it measure?',
  description: 'Ultrasound is a safe and widely used imaging technique during pregnancy that uses high-frequency sound waves to create real-time pictures of the baby inside the womb. Unlike X-rays, it doesn’t use radiation, making it ideal for monitoring fetal development throughout pregnancy. <br />Ultrasound allows healthcare providers to measure and assess several key aspects of pregnancy:',
  showModel: false,
  // Content sections are the expandable sections in the content pane
  contentSections: [
    {
      id: "0",
      title: "Gestational age and due date",
      icon: "mdi-calendar-clock",
      iconColor: "var(--v-primary-base)",
      content: "Ultrasound is often used in early pregnancy to measure the size of the embryo and/or ‘gestational sac’ (the fluid filled structure within which the baby grows), which they can use to date the pregnancy and determine how far along the pregnancy is, and when your baby is likely to be born (the estimated due date or ‘EDD’).  "
    },
    {
      id: "1",
      title: "Fetal growth and development",
      icon: "mdi-baby-face-outline",
      iconColor: "var(--v-primary-base)",
      // Use a custom component for complex content with images and interactions
      component: "UltrasoundWhatIsFetalDevelopment"
    },
    {
      id: "2",
      title: "3D or 4D ultrasound",
      icon: "mdi-video-3d",
      iconColor: "var(--v-primary-base)",
      content:"Some clinics may offer 3D or 4D ultrasound as an optional add on (not covered by public funding in New Zealand), but these are not generally used for medical or diagnostic purposes. <br /> <br /> In 3D ultrasound, multiple angles of flat 2D images are captured and used to create a more lifelike and detailed 3D image of your baby.  <br /> <br />4D ultrasound builds on this by creating a live video of your baby in the womb, allowing you to see your baby’s movements in real time, such as yawning, stretching, or smiling.  "

    },
    {
      id: "3",
      title: "Placental position",
      icon: "mdi-bowl-outline",
      iconColor: "var(--v-primary-base)",
      component: "UltrasoundWhatIsPlacentaPosition"
    },
    {
      id: "4",
      title: "Blood flow to the placenta",
      icon: "mdi-water-plus",
      iconColor: "var(--v-primary-base)",
      content:"A special type of ultrasound called Doppler ultrasound is used to assess how maternal blood is flowing to the placenta (by measuring flow in the uterine artery – the large blood vessel that runs up the side of the uterus through which blood being delivered to the placenta passes) and how blood is flowing between the fetus and the placenta (by measuring flow in the umbilical artery within the cord). Doppler ultrasound produces a signal in the form of a wave. <a href='/ultrasound-doppler'> Interpreting the shape of that wave provides information about fetal health </a>."
    }
  ],
  // Cards are the cards in the content pane
  cards: [
    // {
    //   title: "Learn More On Our Website",
    //   icon: "mdi-book-open",
    //   backgroundColor: "var(--v-success-base)",
    //   textColor: "white",
    //   iconColor: "var(--v-primary-base)",
    //   content: "Explore detailed information about pregnancy care and development."
    // },
    // {
    //   title: "Get Support",
    //   icon: "mdi-phone",
    //   backgroundColor: "var(--v-primary-base)",
    //   iconColor: "var(--v-success-base)",
    //   textColor: "white",
    //   content: "Connect with healthcare providers and support services."
    // }
  ]
};