Pages
=====

Landing Page
------------
The landing page is the first page that users see when they access the app, where there are 3 sections:

- Five Cards: By Clicking the card, user can be navigated to the corresponding page, the title/background/icon/content is stored in the ``landingPageData.js``, by adding/updating this file, the card will be updated to the landing page.
- Menu: on the left up corner, there is a menu button, including all the main topics and the sub-topics of each main topic, the item in menu is rendered based on the ``topics.json`` file, which also used in the Navigation.vue file.
- Left part: The title and description of the app.

Main App
--------
The core features of the app are:

- Pregnancy Journey: The main topic of the app, including the body changes, fetal growth, placenta roles, and baby health.
- Pregnancy Complications: The sub-topics of the pregnancy journey, including the fetal growth, birth, and cares.
- Ultrasound: The ultrasound related information, including the what is an ultrasound, ultrasound waveforms, detecting pregnancy concerns, and an interactive tool for ultrasound waveform.
- Care Pathways: The care pathways of the pregnancy, including the midwife lead care pathways, when care changes, and support.

The data of above topics are stored in the ``topics.json`` file.

Support
-------

The support page is the page that users can find the support resources, the tab of support page is sepreately from the main app, the data of support page is stored in the ``supportData.js`` file. The component of support page is stored in the ``Support.vue`` file, which showcase the left side of the support page.

About
-----

The about page is the page that users can find the about information of the app, now this page can only been find at Menu.
