// Intent recognition system for pregnancy chatbot
// Analyzes user queries to determine intent and extract entities
// Uses configuration-based patterns and synonyms

import chatbotConfig from '~/assets/data/chatbotConfig.json';

/**
 * Analyze user query to determine intent using configuration
 * @param {string} query - User input query
 * @returns {Object} Intent analysis result
 */
export function analyzeIntent(query) {
  if (!query || query.trim() === '') {
    return {
      intent: 'unknown',
      confidence: 0,
      entities: [],
      originalQuery: query
    };
  }

  const normalizedQuery = query.toLowerCase().trim();
  let bestIntent = 'unknown';
  let bestConfidence = 0;
  const entities = [];

  // Check each intent configuration
  Object.keys(chatbotConfig.intents).forEach(intentKey => {
    const intent = chatbotConfig.intents[intentKey];
    let confidence = 0;
    const intentEntities = [];

    // Check patterns
    intent.patterns.forEach(pattern => {
      if (normalizedQuery.includes(pattern.toLowerCase())) {
        confidence += 0.4;
        intentEntities.push({
          type: 'pattern',
          value: pattern,
          intent: intentKey
        });
      }
    });

    // Check synonyms
    if (intent.synonyms) {
      Object.keys(intent.synonyms).forEach(term => {
        const synonyms = intent.synonyms[term];
        synonyms.forEach(synonym => {
          if (normalizedQuery.includes(synonym.toLowerCase())) {
            confidence += 0.3;
            intentEntities.push({
              type: 'synonym',
              value: synonym,
              original: term,
              intent: intentKey
            });
          }
        });
      });
    }

    // Check question types
    Object.keys(chatbotConfig.questionTypes).forEach(questionType => {
      const questionPatterns = chatbotConfig.questionTypes[questionType].patterns;
      questionPatterns.forEach(pattern => {
        if (normalizedQuery.includes(pattern.toLowerCase())) {
          confidence += 0.2;
          intentEntities.push({
            type: 'question',
            value: pattern,
            questionType: questionType,
            intent: intentKey
          });
        }
      });
    });

    if (confidence > bestConfidence) {
      bestIntent = intentKey;
      bestConfidence = confidence;
      entities.push(...intentEntities);
    }
  });

  return {
    intent: bestIntent,
    confidence: Math.min(bestConfidence, 1.0),
    entities,
    originalQuery: query
  };
}

/**
 * Extract entities from query
 * @param {string} query - Normalized query
 * @returns {Array} Array of extracted entities
 */
export function extractEntities(query) {
  const entities = [];
  
  // Extract entities from all intents
  Object.keys(chatbotConfig.intents).forEach(intentKey => {
    const intent = chatbotConfig.intents[intentKey];
    
    // Check patterns
    intent.patterns.forEach(pattern => {
      if (query.includes(pattern.toLowerCase())) {
        entities.push({
          type: 'topic',
          value: intentKey,
          keyword: pattern
        });
      }
    });
    
    // Check synonyms
    if (intent.synonyms) {
      Object.keys(intent.synonyms).forEach(term => {
        const synonyms = intent.synonyms[term];
        synonyms.forEach(synonym => {
          if (query.includes(synonym.toLowerCase())) {
            entities.push({
              type: 'topic',
              value: intentKey,
              keyword: synonym
            });
          }
        });
      });
    }
  });
  
  return entities;
}

/**
 * Generate contextual response based on intent
 * @param {Object} intentResult - Result from analyzeIntent
 * @param {Array} searchResults - Search results from query
 * @returns {Object} Response object with message and actions
 */
export function generateResponse(intentResult, searchResults = []) {
  const { intent, entities, originalQuery } = intentResult;
  
  // Get intent configuration
  const intentConfig = chatbotConfig.intents[intent];
  
  if (intentConfig && intentConfig.response) {
    const response = { ...intentConfig.response };
    
    // Add search results if available
    if (searchResults.length > 0) {
      response.searchResults = searchResults.slice(0, 5);
    }
    
    // Customize response based on entities
    if (entities.length > 0) {
      const regionEntities = entities.filter(e => e.type === 'synonym' && e.intent === 'regional_services');
      if (regionEntities.length > 0) {
        const region = regionEntities[0].value;
        response.message = `I found services in ${region}. Here are the available options:`;
        response.actions = [
          {
            type: 'suggestion',
            text: `Maternity services in ${region}`,
            query: `maternity services ${region}`
          },
          {
            type: 'suggestion',
            text: `Find midwife in ${region}`,
            query: `find midwife ${region}`
          }
        ];
      }
    }
    
    return response;
  }
  
  // Handle question types
  const questionEntities = entities.filter(e => e.type === 'question');
  if (questionEntities.length > 0) {
    const questionType = questionEntities[0].questionType;
    const questionConfig = chatbotConfig.questionTypes[questionType];
    
    if (questionConfig && questionConfig.response) {
      const response = { ...questionConfig.response };
      if (searchResults.length > 0) {
        response.searchResults = searchResults.slice(0, 3);
      }
      return response;
    }
  }
  
  // Fallback response
  return chatbotConfig.fallback;
}

/**
 * Get confidence score for intent matching
 * @param {string} query - User query
 * @param {string} intent - Intent to check
 * @returns {number} Confidence score (0-1)
 */
export function getConfidenceScore(query, intent) {
  const normalizedQuery = query.toLowerCase();
  const intentConfig = chatbotConfig.intents[intent];
  
  if (!intentConfig) return 0;
  
  let confidence = 0;
  
  // Check patterns
  intentConfig.patterns.forEach(pattern => {
    if (normalizedQuery.includes(pattern.toLowerCase())) {
      confidence += 0.4;
    }
  });
  
  // Check synonyms
  if (intentConfig.synonyms) {
    Object.keys(intentConfig.synonyms).forEach(term => {
      const synonyms = intentConfig.synonyms[term];
      synonyms.forEach(synonym => {
        if (normalizedQuery.includes(synonym.toLowerCase())) {
          confidence += 0.3;
        }
      });
    });
  }
  
  return Math.min(confidence, 1.0);
}