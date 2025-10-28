// Intent recognition system for pregnancy chatbot
// Analyzes user queries to determine intent and extract entities
// Uses configuration-based patterns and bidirectional synonyms

import chatbotConfig from '~/assets/data/chatbotConfig.json';

// Constants
const PRIORITY_INTENTS = ['emergency', 'healthy_lifestyle', 'emotional_wellbeing'];
const CONFIDENCE_WEIGHTS = { PATTERN: 0.5, SYNONYM: 0.3, QUESTION: 0.15, PRIORITY: 0.2, MULTI: 0.1 };

// Cache for bidirectional synonym matching
const synonymCache = new Map();

/**
 * Build bidirectional synonym map: smoking ↔ smoke ↔ cigarettes
 * @param {Object} synonyms - Synonyms object
 * @returns {Map} Bidirectional map
 */
function buildBidirectionalMap(synonyms) {
  if (!synonyms) return new Map();
  
  const key = JSON.stringify(synonyms);
  if (synonymCache.has(key)) return synonymCache.get(key);
  
  const map = new Map();
  
  Object.entries(synonyms).forEach(([term, list]) => {
    const allTerms = [term, ...list].map(t => t.toLowerCase());
    
    // Each term can match any other term in the group
    allTerms.forEach(current => {
      const matches = map.get(current) || new Set();
      allTerms.forEach(other => {
        if (other !== current) matches.add(other);
      });
      map.set(current, matches);
    });
  });
  
  synonymCache.set(key, map);
  return map;
}

/**
 * Check if query contains term or its synonyms (bidirectional)
 * @param {string} query - Normalized query
 * @param {string} term - Term to check
 * @param {Map} bidirMap - Bidirectional synonym map
 * @returns {boolean} Match found
 */
function matchesBidirectional(query, term, bidirMap) {
  const normalized = term.toLowerCase();
  
  // Direct match
  if (query.includes(normalized)) return true;
  
  // Check if any synonym of this term matches
  const synonyms = bidirMap.get(normalized);
  if (synonyms) {
    for (const syn of synonyms) {
      if (query.includes(syn)) return true;
    }
  }
  
  return false;
}

/**
 * Analyze user query to determine intent (supports multiple intents)
 * @param {string} query - User input
 * @returns {Object} Intent result with possible multiple intents
 */
export function analyzeIntent(query) {
  if (!query?.trim()) {
    return { intent: 'unknown', confidence: 0, entities: [], originalQuery: query, allIntents: [] };
  }

  const normalizedQuery = query.toLowerCase().trim();
  const intentScores = [];

  Object.entries(chatbotConfig.intents).forEach(([intentKey, intent]) => {
    let confidence = 0;
    const entities = [];
    let patternMatches = 0;

    // Build bidirectional synonym map for this intent
    const bidirMap = buildBidirectionalMap(intent.synonyms);

    // Check patterns
    intent.patterns.forEach(pattern => {
      if (matchesBidirectional(normalizedQuery, pattern, bidirMap)) {
        confidence += CONFIDENCE_WEIGHTS.PATTERN;
        patternMatches++;
        entities.push({ type: 'pattern', value: pattern, intent: intentKey });
      }
    });

    // Check synonyms with bidirectional matching
    if (intent.synonyms) {
      Object.entries(intent.synonyms).forEach(([term, list]) => {
        const allTerms = [term, ...list];
        allTerms.forEach(synonym => {
          if (matchesBidirectional(normalizedQuery, synonym, bidirMap)) {
            confidence += CONFIDENCE_WEIGHTS.SYNONYM;
            entities.push({ type: 'synonym', value: synonym, original: term, intent: intentKey });
          }
        });
      });
    }

    // Check question types
    Object.entries(chatbotConfig.questionTypes).forEach(([qType, config]) => {
      config.patterns.forEach(pattern => {
        if (normalizedQuery.includes(pattern.toLowerCase())) {
          confidence += CONFIDENCE_WEIGHTS.QUESTION;
          entities.push({ type: 'question', value: pattern, questionType: qType, intent: intentKey });
        }
      });
    });

    // Apply bonuses
    if (PRIORITY_INTENTS.includes(intentKey) && confidence > 0) {
      confidence += CONFIDENCE_WEIGHTS.PRIORITY;
    }
    if (patternMatches > 1) {
      confidence += CONFIDENCE_WEIGHTS.MULTI * (patternMatches - 1);
    }

    // Store all intents with confidence > 0
    if (confidence > 0) {
      intentScores.push({ intentKey, confidence, entities });
    }
  });

  // Sort by confidence
  intentScores.sort((a, b) => {
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    // Priority intents win on tie
    if (PRIORITY_INTENTS.includes(a.intentKey)) return -1;
    if (PRIORITY_INTENTS.includes(b.intentKey)) return 1;
    return 0;
  });

  const bestIntent = intentScores[0]?.intentKey || 'unknown';
  const bestConfidence = intentScores[0]?.confidence || 0;
  const bestEntities = intentScores[0]?.entities || [];
  
  // Collect all entities from all matched intents
  const allEntities = intentScores.flatMap(s => s.entities);
  
  // Get top intents (up to 3)
  const topIntents = intentScores.slice(0, 3).map(s => ({ 
    intent: s.intentKey, 
    confidence: s.confidence 
  }));
  
  // Debug log for multi-intent detection
  if (topIntents.length > 1) {
    console.log('Multiple intents detected:', topIntents);
  }

  return {
    intent: bestIntent,
    confidence: Math.min(bestConfidence, 1.0),
    entities: bestEntities,
    originalQuery: query,
    allIntents: topIntents,
    allEntities
  };
}

/**
 * Extract entities from query
 * @param {string} query - Query string
 * @returns {Array} Extracted entities
 */
export function extractEntities(query) {
  if (!query) return [];
  
  const normalizedQuery = query.toLowerCase();
  const entities = [];
  const seen = new Set();
  
  Object.entries(chatbotConfig.intents).forEach(([intentKey, intent]) => {
    const bidirMap = buildBidirectionalMap(intent.synonyms);
    
    // Check patterns
    intent.patterns.forEach(pattern => {
      if (matchesBidirectional(normalizedQuery, pattern, bidirMap)) {
        const key = `${intentKey}-${pattern}`;
        if (!seen.has(key)) {
          seen.add(key);
          entities.push({ type: 'topic', value: intentKey, keyword: pattern });
        }
      }
    });
    
    // Check synonyms
    if (intent.synonyms) {
      Object.entries(intent.synonyms).forEach(([term, list]) => {
        [term, ...list].forEach(synonym => {
          if (matchesBidirectional(normalizedQuery, synonym, bidirMap)) {
            const key = `${intentKey}-${synonym}`;
            if (!seen.has(key)) {
              seen.add(key);
              entities.push({ type: 'topic', value: intentKey, keyword: synonym });
            }
          }
        });
      });
    }
  });
  
  return entities;
}

/**
 * Filter summary by relevance to query
 * @param {Object} summary - Summary object
 * @param {string} query - Original query
 * @param {Array} entities - Extracted entities
 * @returns {Object|null} Filtered summary
 */
function filterRelevantSummary(summary, query, entities) {
  if (!summary) return null;
  
  const keywords = new Set();
  const normalizedQuery = query.toLowerCase();
  
  // Extract keywords from entities
  entities.forEach(e => {
    if (e.value) keywords.add(e.value.toLowerCase());
    if (e.keyword) keywords.add(e.keyword.toLowerCase());
    if (e.original) keywords.add(e.original.toLowerCase());
  });
  
  // Extract keywords from query (words > 3 chars)
  normalizedQuery.split(/\s+/).forEach(word => {
    if (word.length > 3) keywords.add(word);
  });
  
  const filtered = {};
  let hasMatches = false;
  
  // Check each summary item for relevance
  Object.entries(summary).forEach(([key, text]) => {
    if (key === 'general') return; // Skip general
    
    const keyLower = key.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Check if key or text matches any keyword
    const isRelevant = Array.from(keywords).some(kw => 
      keyLower.includes(kw) || 
      textLower.includes(kw) ||
      kw.includes(keyLower)
    );
    
    if (isRelevant) {
      filtered[key] = text;
      hasMatches = true;
    }
  });
  
  // If no matches, include general
  if (!hasMatches && summary.general) {
    filtered.general = summary.general;
  }
  
  return Object.keys(filtered).length > 0 ? filtered : null;
}

/**
 * Merge multiple intent responses
 * @param {Array} intents - Array of intent objects
 * @param {Object} intentResult - Intent analysis result
 * @returns {Object} Merged response
 */
function mergeIntentResponses(intents, intentResult) {
  const { originalQuery, allEntities } = intentResult;
  const mergedResponse = {
    message: '',
    actions: [],
    summaryData: null
  };
  
  const summaries = {};
  
  // Check if there's a specific region mentioned
  const regionEntity = allEntities?.find(e => e.type === 'region');
  const specificRegion = regionEntity?.value?.toLowerCase();
  
  intents.forEach(({ intent: intentKey }, index) => {
    const intentConfig = chatbotConfig.intents[intentKey];
    if (!intentConfig?.response) return;
    
    const response = intentConfig.response;
    
    // Only use message from the highest confidence intent (first one)
    if (index === 0 && response.message) {
      mergedResponse.message = response.message;
    }
    
    // Collect actions from all intents
    if (response.actions) {
      // Filter regional actions if specific region is mentioned
      if (intentKey === 'regional_services' && specificRegion) {
        // Only include actions that match the specific region
        const filteredActions = response.actions.filter(action => {
          const actionText = action.text.toLowerCase();
          return actionText.includes(specificRegion);
        });
        mergedResponse.actions.push(...filteredActions);
      } else {
        // Include all actions for non-regional intents
        mergedResponse.actions.push(...response.actions);
      }
    }
    
    // Collect summaries from all intents
    if (response.summary) {
      const filtered = filterRelevantSummary(response.summary, originalQuery, allEntities);
      if (filtered) {
        Object.assign(summaries, filtered);
      }
    }
  });
  
  // Merge summaries
  if (Object.keys(summaries).length > 0) {
    mergedResponse.summaryData = summaries;
  }
  
  // Remove duplicate actions
  const uniqueActions = [];
  const seen = new Set();
  mergedResponse.actions.forEach(action => {
    const key = `${action.type}-${action.text}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueActions.push(action);
    }
  });
  mergedResponse.actions = uniqueActions;
  
  return mergedResponse;
}

/**
 * Generate contextual response with multi-intent support
 * @param {Object} intentResult - Intent analysis result
 * @param {Array} searchResults - Search results
 * @returns {Object} Response object
 */
export function generateResponse(intentResult, searchResults = []) {
  const { intent, entities, originalQuery, allIntents = [], allEntities } = intentResult;
  
  // Multi-intent handling: use multiple strategies
  let topIntents = [];
  
  if (allIntents.length > 0) {
    // Strategy 1: Use intents with confidence >= 0.5 (absolute threshold)
    topIntents = allIntents.filter(i => i.confidence >= 0.5);
    
    // Strategy 2: If only one intent passes, use top 2-3 intents if they have reasonable confidence
    if (topIntents.length === 1 && allIntents.length > 1) {
      // Include second intent if it has at least 30% of the top confidence
      const secondIntent = allIntents[1];
      if (secondIntent && secondIntent.confidence >= allIntents[0].confidence * 0.3) {
        topIntents.push(secondIntent);
      }
    }
  }
  
  let response;
  
  // Check if we should merge multiple intents
  if (topIntents.length > 1) {
    console.log('Merging multiple intents:', topIntents.map(i => i.intent).join(', '));
    // Merge responses from multiple intents
    response = mergeIntentResponses(topIntents, intentResult);
  } else if (topIntents.length === 1) {
    // Single intent with good confidence
    const intentConfig = chatbotConfig.intents[topIntents[0].intent];
    
    if (intentConfig?.response) {
      response = { ...intentConfig.response };
      
      // Add filtered summary based on query relevance
      if (response.summary) {
        response.summaryData = filterRelevantSummary(response.summary, originalQuery, entities);
      }
    }
  } else {
    // No intents with sufficient confidence - try the best match anyway
    const intentConfig = chatbotConfig.intents[intent];
    
    if (intentConfig?.response && allIntents.length > 0 && allIntents[0].confidence > 0.2) {
      response = { ...intentConfig.response };
      
      // Add filtered summary based on query relevance
      if (response.summary) {
        response.summaryData = filterRelevantSummary(response.summary, originalQuery, entities);
      }
    }
  }
  
  // Add search results if available (show as "related pages")
  if (response && searchResults.length > 0) {
    response.searchResults = searchResults.slice(0, 5);
  }
  
  // Handle question types fallback
  if (!response || !response.message) {
    const questionEntity = entities.find(e => e.type === 'question');
    if (questionEntity) {
      const questionConfig = chatbotConfig.questionTypes[questionEntity.questionType];
      if (questionConfig?.response) {
        response = {
          ...questionConfig.response,
          searchResults: searchResults.slice(0, 3)
        };
      }
    }
  }
  
  // Fallback if still no response or confidence too low
  if (!response || !response.message) {
    console.log('Using fallback response - no intent matched with sufficient confidence');
    response = { ...chatbotConfig.fallback };
    
    // Add summary data from fallback
    if (response.summary) {
      response.summaryData = response.summary;
    }
  }
  
  return response;
}

/**
 * Get confidence score for intent matching
 * @param {string} query - User query
 * @param {string} intent - Intent to check
 * @returns {number} Confidence score
 */
export function getConfidenceScore(query, intent) {
  if (!query || !intent) return 0;
  
  const normalizedQuery = query.toLowerCase();
  const intentConfig = chatbotConfig.intents[intent];
  
  if (!intentConfig) return 0;
  
  let confidence = 0;
  const bidirMap = buildBidirectionalMap(intentConfig.synonyms);
  
  // Check patterns
  intentConfig.patterns.forEach(pattern => {
    if (matchesBidirectional(normalizedQuery, pattern, bidirMap)) {
      confidence += 0.4;
    }
  });
  
  // Check synonyms
  if (intentConfig.synonyms) {
    Object.entries(intentConfig.synonyms).forEach(([term, list]) => {
      [term, ...list].forEach(synonym => {
        if (matchesBidirectional(normalizedQuery, synonym, bidirMap)) {
          confidence += 0.3;
        }
      });
    });
  }
  
  return Math.min(confidence, 1.0);
}
