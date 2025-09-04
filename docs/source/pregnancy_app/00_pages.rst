Pages
=====

This document describes the different pages and their structure in the pregnancy application.

Landing Page
-----------

The landing page is the first page that users see when they access the app. It consists of three main sections:

**Five Cards**
    By clicking a card, users can navigate to the corresponding page. The title, background, icon, and content are stored in ``landingPageData.json``. Adding or updating this file will automatically update the cards on the landing page.

**Menu**
    Located in the upper left corner, there is a menu button that includes all main topics and their sub-topics. Menu items are rendered based on the ``topics.json`` file, which is also used in the Navigation.vue file.

**Left Section**
    Contains the title and description of the app.

Main Application
----------------

The main application is divided into three parts:

**Left Side**
    The left side of the page contains the menu and introduction, rendered based on the ``topics.json`` file.

**Right Side**
    The right side displays the main content of the page, rendered based on the ``pageData`` folder.

**Bottom**
    The bottom of the page contains the main navigation, rendered based on the ``topics.json`` file.

Core Features
~~~~~~~~~~~~

The application includes the following core features:

- Pregnancy Journey
- Ultrasound
- Care Pathways
- Pregnancy Complications
- Support

Data Configuration
~~~~~~~~~~~~~~~~~~

The data for the above topics is stored and configured in the ``topics.json`` file with the following structure:

.. code-block:: javascript

    "pregnancy": { // the key of the main topic
        "title": "Pregnancy Journey", // the title of the main topic, shows in the menu
        "component": "none", // the component of the main topic, if want the left side show a component, set the name of the component here
        "heading": "What is Happening in Pregnancy?", // the heading of the main topic, shows in the left side of the page
        "content": "xxx.", // the content of the main topic, shows in the left side of the page
        "icon": "/img/landing/pregnancy.svg", // the icon of the main topic, shows in the menu
        "subTopics": { // the sub-topics of the main topic
          "changes": { // the key of the sub-topic
            "title": "Your Body", // the title of the sub-topic, shows in the menu
            "component": "none", // the component of the sub-topic, if want the left side show a component, set the name of the component here
            "heading": "Changes To Your Body", // the heading of the sub-topic, shows in the left side of the page
            "icon": "mdi-radar", // the icon of the sub-topic, shows in the menu
            "category": "success", // the category of the sub-topic, shows in the menu
            "subTitle": "subSuccess", // the sub-title of the sub-topic, shows in the left side of the page
            "model": {
              "name": "NoInfarct" // the name of the model
            }
          },
          ...
        }
      }

Content Rendering
~~~~~~~~~~~~~~~~

The right side of the page is rendered based on the ``pageData`` folder. Each page (at the sub-topic level) has its own data file and is rendered using the ``ContentPane.vue`` file.

Basic Data Structure
^^^^^^^^^^^^^^^^^^^

A typical data file looks like this:

.. code-block:: json

    {
        "title": "Sample",
        "description": "Sample",
        "showModel": false,
        "contentSections": [
            {
                "id": "1",
                "title": "Sample",
                "icon": "mdi-heart-plus",
                "iconColor": "var(--v-primary-base)",
                "content": "Sample"
            },
            {
                "id": "2",
                "title": "Sample",
                "icon": "mdi-heart-plus",
                "iconColor": "var(--v-primary-base)",
                "content": "Sample"
            }
        ]
    }

Component-Based Content
^^^^^^^^^^^^^^^^^^^^^^^

If HTML text alone is insufficient, you can also use components to render content:

.. code-block:: json

    {
        "title": "Sample",
        "description": "Sample",
        "showModel": false,
        "contentSections": [
            {
                "id": "1",
                "title": "Sample",
                "icon": "mdi-heart-plus",
                "iconColor": "var(--v-primary-base)",
                "component": "PregnancyPersonalisedAssessment"
            }
        ]
    }

**Note:** If contentSections contains only one item, it will display as an article. Otherwise, it will display as expandable sections.

About Page
----------

The about page provides users with information about the application. Currently, this page can only be accessed through the Menu.
