Pregnancy App Frontend
=====================

A Nuxt.js 2.x application for pregnancy education and visualization, featuring 3D medical models and interactive content.

Technology Stack
----------------

- **Framework**: Nuxt.js 2.15.8
- **Frontend**: Vue.js 2.6.14
- **UI Framework**: Vuetify 2.6.1
- **Styling**: Sass/SCSS with custom variables
- **3D Visualization**: Copper3D 2.2.2
- **Charts**: Chart.js 4.5.0, ECharts 5.4.3, D3.js 7.9.0
- **Build Tool**: Webpack 4.46.0

Build Setup
-----------

.. code:: bash

   # install dependencies
   $ yarn install

   # serve with hot reload at localhost:3000
   $ yarn dev

   # build for production and launch server
   $ yarn build
   $ yarn start

   # generate static project
   $ yarn generate

   # build for GitHub Pages deployment
   $ yarn build:gh-pages
   $ yarn generate:gh-pages

Project Structure
-----------------

``assets/``
~~~~~~~~~~~

Contains uncompiled assets including:

- **data/**: JSON configuration files for landing page, models, support content, and topics
- **images/**: Project images and team photos
- **sass/**: SCSS stylesheets with global styles, variables, and component-specific styles

``components/``
~~~~~~~~~~~~~~~

Vue.js components organized by functionality:

- **content/**: Content display components for pregnancy education
- **landing/**: Landing page specific components
- **model/**: 3D model visualization and control components
- **navigation/**: Navigation and layout components
- **topics/**: Topic panel components

``layouts/``
~~~~~~~~~~~~

Nuxt.js layout templates:

- **default.vue**: Main application layout
- **empty.vue**: Minimal layout for specific pages
- **error.vue**: Error page layout

``pages/``
~~~~~~~~~~

Application routes and views:

- **Dynamic routing**: ``_slug/`` directory with JSON data files
- **Static pages**: About, landing, and index pages
- **Content pages**: Pregnancy, complications, clinical, support, and ultrasound topics

``plugins/``
~~~~~~~~~~~~

JavaScript plugins:

- **copper.js**: Copper3D integration (client-side only)
- **current-content.js**: Content management utilities
- **topics.js**: Topic navigation functionality

``static/``
~~~~~~~~~~~

Static assets served directly:

- **model/**: VTK 3D model files (diabetes.vtk, fgr.vtk, normal.vtk)
- **waveforms/**: CSV data files for different conditions
- **img/**: Static images and icons
- **js/**: External JavaScript libraries (TailwindCSS)

``store/``
~~~~~~~~~~

Vuex store for state management.

``utils/``
~~~~~~~~~~

Utility functions including VTK model loading.

Configuration
-------------

The application supports multiple deployment environments:

- **Local development**: Standard Nuxt.js development server
- **GitHub Pages**: Static generation with ``/pregnancy-app/`` base path
- **Production**: Static generation with custom routing

Key features:

- **3D Medical Models**: Interactive VTK model visualization
- **Responsive Design**: Mobile and desktop optimized layouts
- **Content Management**: JSON-driven content system
- **Analytics**: Google Analytics integration
- **SEO**: Meta tags and structured content