Pages Structure
==============

.. image:: images/05_pages.jpg
.. include:: ../style.rst

:green:`PAGES`

Overview
--------

The pregnancy app uses a dynamic routing system with content-driven pages. The main entry point redirects to a landing page, while all topic pages are generated dynamically through a slug-based routing system.

Page Organization
----------------

.. code-block:: text

    frontend/pages/
    ├── index.vue                    # Root entry point (redirects to landing)
    ├── landing/                     # Landing page components
    │   └── index.vue               # Main landing page
    ├── about/                       # About page
    └── _slug/                       # Dynamic route handler
        ├── index.vue                # Dynamic page component
        └── pageData/                # Content data files
            ├── index.js             # Content mapping
            ├── pregnancy-*.js       # Pregnancy-related content
            ├── conditions-*.js      # Medical condition content
            ├── ultrasound-*.js      # Ultrasound-related content
            ├── clinical-*.js        # Clinical care content
            └── support-*.js         # Support services content

Routing System
--------------

Dynamic Routes
~~~~~~~~~~~~~~

- **Slug-based routing**: All topic pages use `_slug/index.vue` for dynamic content
- **Route generation**: Routes are created by concatenating topic and subtopic keys with '-' character
- **Content mapping**: `pageData/index.js` maps slugs to content data files
- **Fallback handling**: 404 errors for invalid slugs

Route Examples
~~~~~~~~~~~~~

.. code-block:: text

    /pregnancy-changes          # Pregnancy body changes
    /pregnancy-placenta         # Placenta information
    /conditions-fetal           # Fetal conditions
    /ultrasound-doppler         # Doppler ultrasound
    /clinical-mid-wife          # Midwife care
    /support-services           # Support services

Content Management
-----------------

Page Data Structure
~~~~~~~~~~~~~~~~~~~

Each page data file contains:

.. code-block:: javascript

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
      title: "Fetal Development",
      icon: "mdi-baby-face",
      iconColor: "var(--v-primary-base)",
      component: "PregnancyFetalDev" // the name of the component, stored in the ``frontend/components/content`` folder
    }
    ]
  };

Component Selection
~~~~~~~~~~~~~~~~~~

The system automatically selects components based on:

1. **Model pages**: `showModel: true` → `RightPane` component
2. **Custom components**: `component` specification, will use a component from `frontend/components/content` folder
3. **Default fallback**: `ContentPane` component

Contents
-------------

Pregnancy Topics
~~~~~~~~~~~~~~~

- **pregnancy-changes.js**: Body changes during pregnancy, 
- **pregnancy-placenta.js**: Placenta development and function
- **pregnancy-baby.js**: Baby development information
- **pregnancy-fetal-dev.js**: Fetal development stages
- **pregnancy-keep-baby-healthy.js**: Health maintenance tips
- **pregnancy-interact.js**: Interactive pregnancy content

Medical Conditions
~~~~~~~~~~~~~~~~~

- **conditions-fetal.js**: Fetal growth restriction (FGR)
- **conditions-birth.js**: Birth-related conditions
- **conditions-care.js**: Care for medical conditions

Ultrasound Information
~~~~~~~~~~~~~~~~~~~~~~

- **ultrasound-what-is-ultrasound.js**: Basic ultrasound concepts
- **ultrasound-doppler.js**: Doppler ultrasound technology
- **ultrasound-metric.js**: Ultrasound measurements
- **ultrasound-what-ultrasound-means.js**: Ultrasound interpretation

Clinical Care
~~~~~~~~~~~~

- **clinical-mid-wife.js**: Midwife care information
- **clinical-when-care-changes.js**: Care pathway changes

Support Services
~~~~~~~~~~~~~~~

- **support.js**: General support information
- **support-specialist.js**: Specialist support services

Key Features
-----------

Content Flexibility
~~~~~~~~~~~~~~~~~~

- **HTML support**: Content can include HTML for rich formatting
- **Dynamic components**: Automatic component selection based on content type
- **Modular structure**: Easy to add new topics and content

Navigation Integration
~~~~~~~~~~~~~~~~~~~~

- **Menu generation**: Navigation automatically reflects available content
- **Breadcrumb support**: Hierarchical navigation structure
- **Content state management**: Vuex store integration for content state

Performance Optimization
~~~~~~~~~~~~~~~~~~~~~~~

- **Lazy loading**: Components loaded on demand
- **Content caching**: Efficient content retrieval system
- **Static generation**: Pre-built pages for production deployment