Implementation
====================

.. include:: ../style.rst

Introduction:
--------------
This document provides a brief overview of the new heart vue.js app. The app will be built using Vue2. Basically, it will cover main components and data files of the application. There might be some other small components (to facilitate reusability) that I may not mention here, as this document is primarily aimed to show the way the data will be saved and the flow of information (called as props in vue.js) among main components. 

**Terminologies:**  Main tabs like (Pregnancy Journey, Pregnancy Complications etc) are referred to as “topics”.  The sub tabs like (Changes to your body, Placenta etc) are referred as “Subtopics”.

**Data Files:** The data will be saved in the following files:

- :red:`Topics.json`, containing information related to topics and their subtopics

    .. code-block:: bash
        :linenos:

        "pregnancy": {
            "title": "Pregnancy Journey",
            "component": "none",
            "heading": "What is Happening in Pregnancy?",
            "content": "During pregnancy your body undergoes a remarkable transformation to accommodate the growth of new life. Here, you can find information on what is happening to your body, how the fetus grows and is nourished by the placenta, and the different ways your midwife or doctor may check on your baby’s health during pregnancy.",
            "icon": "/img/landing/pregnancy.svg",
            "subTopics": {
            "changes": {
                "title": "Your Body",
                "component": "none",
                "heading": "Changes To Your Body",
                "icon": "mdi-radar",
                "category": "success",
                "subTitle": "subSuccess",
                "model": {
                "name": "NoInfarct"
                }
            },
            "placenta": {
                "title": "Placenta",
                "component": "none",
                "heading": "Roles of the Placenta",
                "icon": "mdi-bowl-outline",
                "category": "success",
                "subTitle": "subSuccess",
                "model": {
                "name": "NoInfarct"
                }
            },
        }


    
    - The topic name will consist of a route, under this case here, there would be one main route: :red:`pregnancy`. 
    - Content: the content for this topic and will display on frontend left panel.
    - SubTopics: the subtopics for this topic, also consist of a route, display on the left panel as menu item. 
    - Title: for topic will display on main navigation. For sub-topics, this is the main item title.
    - heading: the heading for this main-topic and will display on frontend left panel.
    - icon: the nav bar icon, you can find more on :red:`https://pictogrammers.com/library/mdi/`
    - category: the color for this topic. You can define your own color on :red:`nuxt.config.js` file Vuetify config.
    - component: the component for this topic, if want the left side show a component, set the name of the component here, for example, if the topic needs to include pregnancy conditions, set the component to :red:`ConditionSelector`.
    - model: model name.
    - You also can customise the key:value for yourself, but after this you need to setup it under :red:`./frontend/plugins/current-content.js`, then you can use it in vue files via :red:`this.$key()`, e.g. :red:`this.$category()`.

.. image:: images/07_topics.png
The main app will be split into left and right pane (as it is currently) 
--------------------------------------------------------------------------

The **left pane** includes:

-  Main Heading

-  Subheading

-  Panel (component), displaying contents of clicked subtopic from
   (either markdown or xml, as discussed above in data section)

-  Menu (the tabs and subtabs populated based on topics.json)

The **Right pane** will switch between two type of pages i.e. :red:`content` and :red:`Model`.

