Data Management
=================

Overview
--------

The application uses a lightweight JSON-based data management system that eliminates database complexity while ensuring fast, reliable content delivery.

Data Structure
--------------

**Core Data Files** (``assets/data/``):
   - ``topics.json`` - Navigation structure and topic hierarchy
   - ``landingPageData.json`` - Homepage content and features
   - ``modelData.json`` - 3D model configurations and medical data
   - ``supportData.json`` - Support services information

**Page Content** (``pages/_slug/pageData/json/``):
   - Individual JSON files for each content page
   - Examples: ``pregnancy-changes.json``, ``ultrasound-doppler.json``

**Static Assets** (``static/``):
   - ``model/`` - VTK 3D model files
   - ``waveforms/`` - CSV data for medical visualizations
   - ``environment/`` - HDR files for 3D rendering

Key Features
------------

- **Dynamic Loading**: Content loaded on-demand for optimal performance
- **State Management**: Vuex store manages current content across components
- **Content Validation**: Built-in validation for topic completeness
- **Deployment Support**: Automatic path correction for different environments

Advantages
----------

1. **Performance**: Fast loading without database queries
2. **Simplicity**: Easy content updates without database administration
3. **Version Control**: All content tracked through Git
4. **Static Generation**: Perfect for CDN delivery and static hosting

Technical Implementation
------------------------

**Plugins**:
   - ``topics.js`` - Topic navigation and content loading
   - ``current-content.js`` - Content state management
   - ``copper.js`` - 3D model data integration

**Integration**:
   - Vuex store for state management
   - Nuxt.js plugins for global content access
   - Dynamic slug-to-content mapping

**State Management**:
   - Centralized 3D model state in dedicated Vuex module
   - Reactive data synchronization between components
   - Unified error handling and loading states

This approach ensures lightweight, maintainable, and fast content delivery.

For detailed implementation, see the :ref:`03_implementation_structure/02_assets:Data Assets` and :ref:`03_implementation_structure/04_store:Store` documentation.