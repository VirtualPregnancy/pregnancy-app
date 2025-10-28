// Chatbot response utilities
// Centralized logic for generating intelligent responses

import { analyzeIntent, generateResponse } from './intentRecognition.js';
import chatbotConfig from '~/assets/data/chatbotConfig.json';

// Constants
const MAX_SEARCH_RESULTS = 5;
const MIN_WORD_LENGTH = 2;
const MATCH_SCORES = { EXACT: 100, WORD: 80, PARTIAL: 60, CATEGORY_EXACT: 70, CATEGORY_WORD: 50, CATEGORY_PARTIAL: 35, DESC_WORD: 25, DESC_PARTIAL: 15 };
const MATCH_TYPE_BONUS = { topic: 20, pattern: 18, intent: 15, synonym: 12, keyword: 8 };

/**
 * Calculate relevance score for page
 * @param {Object} page - Page object
 * @param {string} term - Search term
 * @param {string} matchType - Match type
 * @returns {number} Relevance score
 */
function calculateScore(page, term, matchType) {
  let score = 0;
  const t = term.toLowerCase();
  const title = page.title.toLowerCase();
  const category = page.category.toLowerCase();
  const desc = (page.description || '').toLowerCase();
  
  // Title matching
  if (title === t) score += MATCH_SCORES.EXACT;
  else if (title.split(/\s+/).includes(t)) score += MATCH_SCORES.WORD;
  else if (title.includes(t)) score += MATCH_SCORES.PARTIAL;
  
  // Category matching
  if (category === t) score += MATCH_SCORES.CATEGORY_EXACT;
  else if (category.split(/\s+/).includes(t)) score += MATCH_SCORES.CATEGORY_WORD;
  else if (category.includes(t)) score += MATCH_SCORES.CATEGORY_PARTIAL;
  
  // Description matching
  if (desc.split(/\s+/).includes(t)) score += MATCH_SCORES.DESC_WORD;
  else if (desc.includes(t)) score += MATCH_SCORES.DESC_PARTIAL;
  
  // Match type bonus
  score += MATCH_TYPE_BONUS[matchType] || 5;
  
  // Occurrence count bonus
  const occurrences = (title.match(new RegExp(t, 'g')) || []).length +
                     (category.match(new RegExp(t, 'g')) || []).length +
                     (desc.match(new RegExp(t, 'g')) || []).length;
  score += occurrences * 3;
  
  return score;
}

/**
 * Search pages by entities
 * @param {Array} allPages - All pages
 * @param {Array} entities - Extracted entities
 * @returns {Array} Filtered results
 */
function searchByEntities(allPages, entities) {
  const resultsMap = new Map();
  
  entities.forEach(entity => {
    if (['topic', 'pattern', 'synonym'].includes(entity.type)) {
      const term = entity.value || entity.keyword;
      
      allPages
        .filter(page => 
          page.category.toLowerCase().includes(term) ||
          page.title.toLowerCase().includes(term) ||
          (page.description || '').toLowerCase().includes(term)
        )
        .forEach(page => {
          const score = calculateScore(page, term, entity.type);
          const existing = resultsMap.get(page.slug);
          resultsMap.set(page.slug, {
            page,
            score: existing ? existing.score + score : score
          });
        });
    }
    
    // Intent-based filtering
    if (entity.intent) {
      const intentConfig = chatbotConfig.intents[entity.intent];
      const searchCategory = intentConfig?.response?.searchCategory;
      
      if (searchCategory) {
        allPages
          .filter(page => page.category.toLowerCase().includes(searchCategory.toLowerCase()))
          .forEach(page => {
            const score = calculateScore(page, searchCategory, 'intent');
            const existing = resultsMap.get(page.slug);
            resultsMap.set(page.slug, {
              page,
              score: existing ? existing.score + score : score
            });
          });
      }
    }
  });
  
  // Broader matching if no results
  if (resultsMap.size === 0 && entities.length > 0) {
    entities
      .map(e => e.value || e.keyword)
      .filter(Boolean)
      .forEach(term => {
        allPages
          .filter(page =>
            page.title.toLowerCase().includes(term.toLowerCase()) ||
            (page.description || '').toLowerCase().includes(term.toLowerCase()) ||
            page.category.toLowerCase().includes(term.toLowerCase())
          )
          .forEach(page => {
            const score = calculateScore(page, term, 'keyword');
            const existing = resultsMap.get(page.slug);
            resultsMap.set(page.slug, {
              page,
              score: existing ? existing.score + score : score
            });
          });
      });
  }
  
  return Array.from(resultsMap.values())
    .sort((a, b) => b.score - a.score)
    .map(item => item.page)
    .slice(0, MAX_SEARCH_RESULTS);
}

/**
 * Search pages by intent category
 * @param {Array} allPages - All pages
 * @param {string} category - Category term
 * @returns {Array} Filtered results
 */
function searchByIntent(allPages, category) {
  const resultsMap = new Map();
  
  allPages
    .filter(page => page.category.toLowerCase().includes(category))
    .forEach(page => {
      const score = calculateScore(page, category, 'intent');
      resultsMap.set(page.slug, { page, score });
    });
  
  return Array.from(resultsMap.values())
    .sort((a, b) => b.score - a.score)
    .map(item => item.page)
    .slice(0, MAX_SEARCH_RESULTS);
}

/**
 * Search pages by keywords
 * @param {Array} allPages - All pages
 * @param {string} query - Query string
 * @returns {Array} Filtered results
 */
function searchByKeywords(allPages, query) {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > MIN_WORD_LENGTH);
  const resultsMap = new Map();
  
  allPages.forEach(page => {
    let totalScore = 0;
    words.forEach(word => {
      if (page.title.toLowerCase().includes(word) ||
          (page.description || '').toLowerCase().includes(word) ||
          page.category.toLowerCase().includes(word)) {
        totalScore += calculateScore(page, word, 'keyword');
      }
    });
    
    if (totalScore > 0) {
      resultsMap.set(page.slug, { page, score: totalScore });
    }
  });
  
  return Array.from(resultsMap.values())
    .sort((a, b) => b.score - a.score)
    .map(item => item.page)
    .slice(0, MAX_SEARCH_RESULTS);
}

/**
 * Generate intelligent chatbot response
 * @param {string} query - User query
 * @param {Array} allPages - All pages
 * @returns {Object} Response object
 */
export function generateChatbotResponse(query, allPages) {
  const intentResult = analyzeIntent(query);
  
  // Try different search strategies
  let searchResults = [];
  
  if (intentResult.entities.length > 0) {
    searchResults = searchByEntities(allPages, intentResult.entities);
  }
  
  if (searchResults.length === 0 && intentResult.intent !== 'unknown') {
    const intentConfig = chatbotConfig.intents[intentResult.intent];
    const searchCategory = intentConfig?.response?.searchCategory;
    if (searchCategory) {
      searchResults = searchByIntent(allPages, searchCategory.toLowerCase());
    }
  }
  
  if (searchResults.length === 0) {
    searchResults = searchByKeywords(allPages, query);
  }
  
  const response = generateResponse(intentResult, searchResults);
  
  return {
    message: response.message,
    searchResults,
    actions: response.actions || [],
    summary: response.summaryData || null,
    confidence: intentResult.confidence,
    intent: intentResult.intent,
    entities: intentResult.entities
  };
}

/**
 * Enhanced search with relevance scoring
 * @param {Array} allPages - All pages
 * @param {string} query - User query
 * @returns {Array} Sorted results
 */
export function searchPagesWithRelevance(allPages, query) {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > MIN_WORD_LENGTH);
  const resultsMap = new Map();
  
  allPages.forEach(page => {
    let totalScore = 0;
    words.forEach(word => {
      if (page.title.toLowerCase().includes(word) ||
          (page.description || '').toLowerCase().includes(word) ||
          page.category.toLowerCase().includes(word)) {
        totalScore += calculateScore(page, word, 'keyword');
      }
    });
    
    if (totalScore > 0) {
      resultsMap.set(page.slug, { ...page, relevanceScore: totalScore });
    }
  });
  
  return Array.from(resultsMap.values())
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Get top N relevant pages
 * @param {Array} allPages - All pages
 * @param {string} searchTerm - Search term
 * @param {number} limit - Result limit
 * @returns {Array} Top pages
 */
export function getTopRelevantPages(allPages, searchTerm, limit = MAX_SEARCH_RESULTS) {
  return searchPagesWithRelevance(allPages, searchTerm).slice(0, limit);
}

/**
 * Get all pages data from topics.json
 * @returns {Array} Pages array
 */
export function getAllPagesData() {
  const pages = [];
  const topicsData = require('~/assets/data/topics.json');
  
  Object.entries(topicsData).forEach(([topicKey, topic]) => {
    const categoryName = topic.heading;
    
    if (topic.subTopics) {
      Object.entries(topic.subTopics).forEach(([subTopicKey, subTopic]) => {
        pages.push({
          title: subTopic.heading,
          slug: `${topicKey}-${subTopicKey}`,
          category: categoryName,
          icon: subTopic.icon || 'mdi-file-document',
          heading: subTopic.heading,
          description: `Information about ${subTopic.heading}`,
          pageTitle: subTopic.heading
        });
      });
    }
  });
  
  return pages;
}

/**
 * Get support services data
 * @param {string} region - Region name
 * @param {string} type - Service type
 * @returns {Array} Services data
 */
export function getSupportServices(region = null, type = null) {
  const supportData = require('~/assets/data/supportData.json');
  
  if (region && supportData.regionalServices?.[region]) {
    return supportData.regionalServices[region];
  }
  
  const typeMap = {
    mental_health: supportData.mentalHealthServices?.National,
    pregnancy_complication: supportData.pregnancyComplicationSupport?.National,
    premature_birth: supportData.prematureBirthSupport?.National
  };
  
  if (type && typeMap[type]) return typeMap[type];
  
  return Object.keys(chatbotConfig.intents.regional_services?.synonyms || {});
}

/**
 * Get welcome message
 * @returns {Object} Welcome message
 */
export function getWelcomeMessage() {
  const greeting = chatbotConfig.intents.greeting;
  return {
    type: 'bot',
    content: greeting.response.message,
    actions: greeting.response.actions
  };
}

/**
 * Handle chatbot action
 * @param {Object} action - Action object
 * @param {Function} setUserInput - Set input function
 * @param {Function} sendMessage - Send message function
 * @param {Function} navigate - Navigate function
 * @param {Function} closeChatbot - Close function
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
 * Get available intents
 * @returns {Array} Intent names
 */
export function getAvailableIntents() {
  return Object.keys(chatbotConfig.intents);
}

/**
 * Get intent configuration
 * @param {string} intentName - Intent name
 * @returns {Object} Intent config
 */
export function getIntentConfig(intentName) {
  return chatbotConfig.intents[intentName] || null;
}

/**
 * Get fallback response
 * @returns {Object} Fallback response
 */
export function getFallbackResponse() {
  return chatbotConfig.fallback;
}
