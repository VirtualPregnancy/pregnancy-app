// Chatbot response utilities
// Centralized logic for generating intelligent responses based on user queries

import { analyzeIntent, generateResponse } from './intentRecognition.js';
import chatbotConfig from '~/assets/data/chatbotConfig.json';

/**
 * Generate intelligent response based on user query using intent recognition
 * @param {string} query - User input query
 * @param {Array} allPages - Available pages data
 * @returns {Object} Response object with message, searchResults, and actions
 */
export function generateChatbotResponse(query, allPages) {
  // Use intent recognition system
  const intentResult = analyzeIntent(query);
  
  // Filter search results based on intent
  let searchResults = [];
  if (intentResult.entities.length > 0) {
    searchResults = filterSearchResults(allPages, intentResult.entities);
  }
  
  // If no specific results found, try intent-based search
  if (searchResults.length === 0 && intentResult.intent !== 'unknown') {
    const intentConfig = chatbotConfig.intents[intentResult.intent];
    if (intentConfig && intentConfig.response && intentConfig.response.searchCategory) {
      searchResults = allPages.filter(page => 
        page.category.toLowerCase().includes(intentConfig.response.searchCategory.toLowerCase())
      ).slice(0, 5);
    }
  }
  
  // If still no results, try keyword matching
  if (searchResults.length === 0) {
    const queryWords = query.toLowerCase().split(' ');
    searchResults = allPages.filter(page => 
      queryWords.some(word => 
        page.title.toLowerCase().includes(word) ||
        page.description.toLowerCase().includes(word) ||
        page.category.toLowerCase().includes(word)
      )
    ).slice(0, 5);
  }
  
  // Generate response using intent recognition
  const response = generateResponse(intentResult, searchResults);
  
  return {
    message: response.message,
    searchResults: searchResults,
    actions: response.actions || [],
    confidence: intentResult.confidence,
    intent: intentResult.intent,
    entities: intentResult.entities
  };
}

/**
 * Filter search results based on extracted entities
 * @param {Array} allPages - All available pages
 * @param {Array} entities - Extracted entities from query
 * @returns {Array} Filtered search results
 */
function filterSearchResults(allPages, entities) {
  const results = [];
  
  entities.forEach(entity => {
    // Handle different entity types
    if (entity.type === 'topic' || entity.type === 'pattern' || entity.type === 'synonym') {
      const searchTerm = entity.value || entity.keyword;
      const topicResults = allPages.filter(page => 
        page.category.toLowerCase().includes(searchTerm) ||
        page.title.toLowerCase().includes(searchTerm) ||
        page.description.toLowerCase().includes(searchTerm)
      );
      results.push(...topicResults);
    }
    
    // Handle intent-based filtering
    if (entity.intent) {
      const intentConfig = chatbotConfig.intents[entity.intent];
      if (intentConfig && intentConfig.response && intentConfig.response.searchCategory) {
        const categoryResults = allPages.filter(page => 
          page.category.toLowerCase().includes(intentConfig.response.searchCategory.toLowerCase())
        );
        results.push(...categoryResults);
      }
    }
  });
  
  // If no specific results found, try broader matching
  if (results.length === 0 && entities.length > 0) {
    const searchTerms = entities.map(e => e.value || e.keyword).filter(Boolean);
    searchTerms.forEach(term => {
      const broadResults = allPages.filter(page => 
        page.title.toLowerCase().includes(term.toLowerCase()) ||
        page.description.toLowerCase().includes(term.toLowerCase()) ||
        page.category.toLowerCase().includes(term.toLowerCase())
      );
      results.push(...broadResults);
    });
  }
  
  // Remove duplicates and return top results
  const uniqueResults = results.filter((result, index, self) => 
    index === self.findIndex(r => r.slug === result.slug)
  );
  
  return uniqueResults.slice(0, 5);
}

/**
 * Get all available pages data from topics.json
 * @returns {Array} Array of page objects
 */
export function getAllPagesData() {
  const pages = [];
  
  // Import topics data from the actual JSON file
  const topicsData = require('~/assets/data/topics.json');
  
  Object.keys(topicsData).forEach(topicKey => {
    const topic = topicsData[topicKey];
    const categoryName = topic.heading;
    
    if (topic.subTopics) {
      Object.keys(topic.subTopics).forEach(subTopicKey => {
        const subTopic = topic.subTopics[subTopicKey];
        const slug = `${topicKey}-${subTopicKey}`;
        
        const page = {
          title: subTopic.heading,
          slug: slug,
          category: categoryName,
          icon: subTopic.icon || 'mdi-file-document',
          heading: subTopic.heading,
          description: `Information about ${subTopic.heading}`,
          pageTitle: subTopic.heading
        };
        
        pages.push(page);
      });
    }
  });
  
  return pages;
}

/**
 * Get support services data for specific regions or types using configuration
 * @param {string} region - Region name (optional)
 * @param {string} type - Service type (optional)
 * @returns {Array} Support services data
 */
export function getSupportServices(region = null, type = null) {
  // Import support data from the actual JSON file
  const supportData = require('~/assets/data/supportData.json');
  
  if (region && supportData.regionalServices[region]) {
    return supportData.regionalServices[region];
  }
  
  if (type === 'mental_health') {
    return supportData.mentalHealthServices.National || [];
  }
  
  if (type === 'pregnancy_complication') {
    return supportData.pregnancyComplicationSupport.National || [];
  }
  
  if (type === 'premature_birth') {
    return supportData.prematureBirthSupport.National || [];
  }
  
  // Return all available regions from configuration
  const regionalConfig = chatbotConfig.intents.regional_services;
  return Object.keys(regionalConfig.synonyms) || [];
}

/**
 * Get welcome message for chatbot using configuration
 * @returns {Object} Welcome message with actions
 */
export function getWelcomeMessage() {
  const greetingConfig = chatbotConfig.intents.greeting;
  return {
    type: 'bot',
    content: greetingConfig.response.message,
    actions: greetingConfig.response.actions
  };
}

/**
 * Handle action execution
 * @param {Object} action - Action object
 * @param {Function} setUserInput - Function to set user input
 * @param {Function} sendMessage - Function to send message
 * @param {Function} navigate - Function to navigate to page
 * @param {Function} closeChatbot - Function to close chatbot
 */
export function handleChatbotAction(action, setUserInput, sendMessage, navigate, closeChatbot) {
  if (action.type === 'suggestion') {
    setUserInput(action.query);
    sendMessage();
  } else if (action.type === 'navigate') {
    navigate(action.path);
    closeChatbot();
  }
}

/**
 * Get action configuration from chatbot config
 * @param {string} actionType - Type of action
 * @returns {Object} Action configuration
 */
export function getActionConfig(actionType) {
  return chatbotConfig.actions[actionType] || {
    description: 'Unknown action',
    icon: 'mdi-help',
    color: 'grey'
  };
}

/**
 * Get all available intents from configuration
 * @returns {Array} Array of intent names
 */
export function getAvailableIntents() {
  return Object.keys(chatbotConfig.intents);
}

/**
 * Get intent configuration by name
 * @param {string} intentName - Name of the intent
 * @returns {Object} Intent configuration
 */
export function getIntentConfig(intentName) {
  return chatbotConfig.intents[intentName] || null;
}

/**
 * Get fallback response from configuration
 * @returns {Object} Fallback response
 */
export function getFallbackResponse() {
  return chatbotConfig.fallback;
}
