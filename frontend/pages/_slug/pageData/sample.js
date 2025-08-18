export default {
    title: 'Sample',
    description: 'Sample',
    showModel: false, // if true, the model will be shown in the content pane
    contentSections: [
        {
            id: "1", //id must be unique
            title: "Sample",
            icon: "mdi-heart-plus", //icon must be a valid mdi icon
            iconColor: "var(--v-primary-base)", //iconColor must be a valid css color or a variable
            content: "Sample"
        },
        {
            id: "2",
            title: "Sample",
            icon: "mdi-heart-plus",
            iconColor: "var(--v-primary-base)",
            content: "Sample"
        }
    ]
  };