/**
 * Hospital Data API Service
 * Clean, reusable service for fetching hospital data from catalogue.data.govt.nz
 */

class HospitalApiService {
  constructor() {
    this.baseUrl = 'https://catalogue.data.govt.nz/api/3/action/datastore_search';
    this.resourceIds = {
      publicHospitals: 'dccdddd8-708d-4798-adaf-609c31f93414',
      ngoHospitals: '1c3bc030-57cd-4a4e-ba22-4496f4ded0b1',
      fertilityClinic: 'ef9242b0-cac1-4d26-82a1-6273d41beaa2'
    };
    
    // Filter criteria for different hospital types (simplified since we have separate datasets)
    this.typeFilters = {
      publicHospitals: null, // No filter needed - dedicated dataset
      ngoHospitals: null,    // No filter needed - dedicated dataset  
      fertilityClinic: (record) => {
        const type = record['Certification Service Type'] || '';
        const name = record['Premises Name'] || '';
        return type.toLowerCase().includes('fertility') || 
               name.toLowerCase().includes('fertility') ||
               type.toLowerCase().includes('reproductive') ||
               type.toLowerCase().includes('ivf');
      }
    };
    this.defaultLimit = 100;
    this.requestTimeout = 30000;
  }

  /**
   * Fetch all records from a specific resource with pagination
   * @param {string} resourceType - Type of resource (publicHospitals, ngoHospitals, fertilityClinic)
   * @param {string} query - Optional search query
   * @returns {Promise<Array>} Array of hospital records
   */
  async fetchAllRecords(resourceType, query = '') {
    const resourceId = this.resourceIds[resourceType];
    if (!resourceId) {
      throw new Error(`Unknown resource type: ${resourceType}`);
    }

    let allRecords = [];
    let offset = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      try {
        const response = await this.fetchPage(resourceId, this.defaultLimit, offset, query);
        const records = response.result.records || [];
        
        allRecords = allRecords.concat(records);
        
        // Check if we got fewer records than requested
        if (records.length < this.defaultLimit) {
          hasMoreData = false;
        } else {
          offset += this.defaultLimit;
          // Add small delay to avoid rate limiting
          await this.delay(100);
        }
      } catch (error) {
        console.error(`Error fetching page at offset ${offset}:`, error);
        hasMoreData = false;
      }
    }

    return this.transformRecords(allRecords, resourceType);
  }

  /**
   * Fetch a single page of data using JSONP
   * @param {string} resourceId - Resource ID
   * @param {number} limit - Number of records per page
   * @param {number} offset - Starting offset
   * @param {string} query - Search query
   * @returns {Promise<Object>} API response
   */
  fetchPage(resourceId, limit, offset, query = '') {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        resource_id: resourceId,
        limit: limit,
        offset: offset
      });

      if (query) {
        params.append('q', query);
      }

      // Generate unique callback name
      const callbackName = `jsonp_callback_${Math.round(100000 * Math.random())}`;
      const script = document.createElement('script');
      
      // Set up the callback
      window[callbackName] = (response) => {
        this.cleanupJsonp(callbackName, script);
        
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(`API error: ${response.error?.message || 'Unknown error'}`));
        }
      };

      // Handle errors
      script.onerror = () => {
        this.cleanupJsonp(callbackName, script);
        reject(new Error('Network error occurred'));
      };

      // Create the JSONP request
      script.src = `${this.baseUrl}?${params.toString()}&callback=${callbackName}`;
      document.body.appendChild(script);
      
      // Set timeout
      setTimeout(() => {
        if (window[callbackName]) {
          this.cleanupJsonp(callbackName, script);
          reject(new Error('Request timeout'));
        }
      }, this.requestTimeout);
    });
  }

  /**
   * Transform API records to standardized format
   * @param {Array} records - Raw API records
   * @param {string} resourceType - Type of resource for filtering
   * @returns {Array} Transformed hospital records
   */
  transformRecords(records, resourceType) {
    // Apply type-specific filter if available
    let filteredRecords = records;
    if (this.typeFilters[resourceType]) {
      filteredRecords = records.filter(this.typeFilters[resourceType]);
    }

    return filteredRecords.map((record, index) => ({
      id: `${resourceType}-${record._id || index}`,
      name: this.getFieldValue(record, ['Premises Name']),
      addr1: this.getFieldValue(record, ['Premises Address Other']),
      addr2: this.getFieldValue(record, ['Premises Address']),
      suburb: this.getFieldValue(record, ['Premises Address Suburb']),
      city: this.getFieldValue(record, ['Premises Address Town/City', 'Premises Address Town', 'Premises Address City']),
      postcode: this.getFieldValue(record, ['Premises Address Post Code']),
      website: this.getFieldValue(record, ['Premises Website']),
      type: this.getFieldValue(record, ['Certification Service Type']) || resourceType,
      serviceTypes: this.getFieldValue(record, ['Service Types']),
      beds: this.getFieldValue(record, ['Total Beds']),
      region: this.getFieldValue(record, ['Premises Address Town/City', 'Premises Address Town', 'Premises Address City']),
    })).filter(hospital => hospital.name && hospital.name.trim() !== '');
  }

  /**
   * Get field value from record, trying multiple possible field names
   * @param {Object} record - API record
   * @param {Array<string>} fieldNames - Possible field names to try
   * @returns {string} Field value or empty string
   */
  getFieldValue(record, fieldNames) {
    for (const fieldName of fieldNames) {
      if (record[fieldName]) {
        return record[fieldName].toString().trim();
      }
    }
    return '';
  }

  /**
   * Clean up JSONP callback and script element
   * @param {string} callbackName - Callback function name
   * @param {HTMLElement} script - Script element
   */
  cleanupJsonp(callbackName, script) {
    if (window[callbackName]) {
      delete window[callbackName];
    }
    if (script && script.parentNode) {
      document.body.removeChild(script);
    }
  }

  /**
   * Simple delay utility
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get all hospital types available
   * @returns {Array<string>} Available hospital types
   */
  getAvailableTypes() {
    return Object.keys(this.resourceIds);
  }

  /**
   * Update resource ID for a specific type
   * @param {string} type - Hospital type
   * @param {string} resourceId - New resource ID
   */
  updateResourceId(type, resourceId) {
    if (this.resourceIds.hasOwnProperty(type)) {
      this.resourceIds[type] = resourceId;
    } else {
      throw new Error(`Unknown hospital type: ${type}`);
    }
  }
}

// Export singleton instance
export default new HospitalApiService();
