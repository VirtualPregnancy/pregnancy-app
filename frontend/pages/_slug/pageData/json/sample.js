export default {
  "title": "Sample", // The title of the page at the right side of the page
  "description": "Sample", // The description of the page at the right side of the page under the title
  "showModel": false, // If the page is a model page, set to true
  "contentSections": [
    {
      "id": "1", // The id of the section, should be mapping with the index of content docs given by Dr.Jo
      "title": "Sample", // The title of the section displayed at the item when it not expanded
      "icon": "mdi-heart-plus", // The icon of the section
      "iconColor": "var(--v-primary-base)", // The color of the icon
      "content": "Sample" // The content of the section, show when it expanded
    },
    {
      "id": "2",
      "title": "Sample",
      "icon": "mdi-heart-plus",
      "iconColor": "var(--v-primary-base)",
      "content": "Sample"
    }
  ],
  "addtionalResources": [
    {
      "title": "Health New Zealand Te Whatu Ora - Information", // The title of the resource
      "description": "Pregnancy and maternity, Te haputanga me te whanautanga. <br /> Find out about pregnancy, labour and birth.", // The description of the resource
      "icon": "mdi-web", // The icon of the resource
      "iconColor": "var(--v-accent-base)", // The color of the icon
      "link": "https://info.health.nz/pregnancy-maternity" // The link of the resource
    },
    {
      "title": "Health New Zealand Te Whatu Ora - Government Website",
      "description": "Information for primary maternity care.",
      "icon": "mdi-domain",
      "iconColor": "var(--v-accent-base)",
      "link": "https://www.tewhatuora.govt.nz/for-health-providers/primary-maternity-care"
    }
  ]
}

