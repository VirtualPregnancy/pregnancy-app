API Services
=============

Overview
--------

The application uses a clean, reusable API service architecture for fetching hospital data from New Zealand's government data catalogue (catalogue.data.govt.nz). This service completely replaces CSV-based data loading with real-time API calls.

**Data License**: All hospital data is provided under open data principles as defined by the `Open Definition 2.1 <https://opendefinition.org/od/2.1/en/>`_, allowing free access, use, modification, and sharing while preserving provenance and openness.

Service Architecture
--------------------

**Service Layer** (``services/hospitalApi.js``):
   - **Single Responsibility**: Handles all hospital data API interactions
   - **Clean Interface**: Simple methods for fetching different hospital types
   - **Error Handling**: Robust error handling with automatic retries
   - **Rate Limiting**: Built-in delays to respect API limits
   - **JSONP Support**: Cross-origin requests without CORS issues

Resource Configuration
----------------------

**API Endpoints**:
   - **Public Hospitals**: ``dccdddd8-708d-4798-adaf-609c31f93414``
   - **NGO Hospitals**: ``1c3bc030-57cd-4a4e-ba22-4496f4ded0b1``
   - **Fertility Clinics**: ``ef9242b0-cac1-4d26-82a1-6273d41beaa2``

**Base URL**: ``https://catalogue.data.govt.nz/api/3/action/datastore_search``

Key Features
------------

- **Complete Data Fetching**: Automatically fetches ALL records using pagination (no 5-record limit)
- **Data Transformation**: Standardizes API responses to consistent format
- **Performance**: Parallel requests for multiple hospital types
- **Type Safety**: JSDoc annotations for better IDE support
- **Clean Code**: Follows SOLID principles and DRY methodology

Usage Example
-------------

.. code-block:: javascript

   import hospitalApiService from '~/services/hospitalApi.js';

   // Fetch all public hospitals
   const publicHospitals = await hospitalApiService.fetchAllRecords('publicHospitals');

   // Fetch all hospital types in parallel
   const [publicHospitals, ngoHospitals, fertilityClinic] = await Promise.all([
     hospitalApiService.fetchAllRecords('publicHospitals'),
     hospitalApiService.fetchAllRecords('ngoHospitals'),
     hospitalApiService.fetchAllRecords('fertilityClinic')
   ]);

Data Structure
--------------

Each hospital record contains standardized fields:

.. code-block:: javascript

   {
     id: string,           // Unique identifier
     name: string,         // Hospital name
     addr1: string,        // Address line 1
     addr2: string,        // Address line 2
     suburb: string,       // Suburb
     city: string,         // City/Town
     postcode: string,     // Postal code
     website: string,      // Website URL
     type: string,         // Hospital type
     serviceTypes: string, // Available services
     beds: string,         // Number of beds
     region: string        // Region (same as city)
   }

Configuration Management
------------------------

Resource IDs can be updated dynamically:

.. code-block:: javascript

   hospitalApiService.updateResourceId('publicHospitals', 'new-resource-id');

Technical Benefits
------------------

1. **Real-time Data**: Always fetches the latest hospital information
2. **Complete Coverage**: Gets ALL records, not just 5 samples
3. **Performance**: Parallel API calls reduce loading time
4. **Maintainability**: Single service for all hospital data
5. **Scalability**: Easy to add new hospital types
6. **Clean Code**: Follows SOLID principles and DRY methodology
7. **No Dependencies**: Pure JavaScript implementation without jQuery

Implementation Details
----------------------

**JSONP Implementation**:
   - Uses dynamic script injection for cross-origin requests
   - Automatic callback cleanup to prevent memory leaks
   - Built-in timeout handling (30 seconds)

**Pagination Strategy**:
   - Automatic pagination to fetch complete datasets
   - Configurable page size (default: 100 records)
   - Built-in rate limiting to respect API constraints

**Data Transformation Pipeline**:
   - Standardized field mapping across different hospital types
   - Flexible field name resolution for API variations
   - Consistent data structure output

**Error Handling**:
   - Comprehensive error catching and reporting
   - Meaningful error messages for debugging
   - Graceful degradation on network failures

Integration
-----------

The API service integrates seamlessly with Vue.js components:

.. code-block:: javascript

   export default {
     data() {
       return {
         hospitals: [],
         loading: false,
         error: null,
       };
     },
     async mounted() {
       await this.loadHospitals();
     },
     methods: {
       async loadHospitals() {
         this.loading = true;
         try {
           const allHospitals = await Promise.all([
             hospitalApiService.fetchAllRecords('publicHospitals'),
             hospitalApiService.fetchAllRecords('ngoHospitals'),
             hospitalApiService.fetchAllRecords('fertilityClinic')
           ]);
           this.hospitals = allHospitals.flat();
         } catch (error) {
           this.error = 'Failed to load hospital data';
         } finally {
           this.loading = false;
         }
       }
     }
   };

This architecture ensures clean separation of concerns, maintainable code, and optimal performance for real-time data fetching.

Data Attribution and Licensing
-------------------------------

**Source**: `NZ Government Open Data - Certified Health Care Providers <https://catalogue.data.govt.nz/dataset/certified-health-care-providers>`_

**License**: `Open Definition 2.1 <https://opendefinition.org/od/2.1/en/>`_ - Free to access, use, modify, and share

For implementation examples, see the :ref:`04_pregnancy_app/00_pages:Hospital Data Integration` documentation.
