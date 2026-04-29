// Route Service (Mock for demo)
// Provides route data and calculations for future AI integration

import { MOCK_ROUTES } from '../data/mockRoutes';

/**
 * Get route options based on origin, destination, and user profile
 * @param {string} origin - Starting location name
 * @param {Object} originCoords - {latitude, longitude}
 * @param {string} destination - Ending location name
 * @param {Object} destCoords - {latitude, longitude}
 * @param {Object} userProfile - User preferences
 * @returns {Promise<Array>} Array of route options
 */
export const getRoutes = async (origin, originCoords, destination, destCoords, userProfile) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter and customize routes based on user profile
  const routes = MOCK_ROUTES.map(route => {
    // Calculate personalized comfort score based on user preferences
    const personalizedScore = calculatePersonalizedScore(route, userProfile);
    
    return {
      ...route,
      comfortScore: personalizedScore,
    };
  });
  
  // Sort by user preference
  const sortedRoutes = sortRoutesByPreference(routes, userProfile);
  
  return sortedRoutes;
};

/**
 * Get detailed route information
 * @param {string} routeId - Route identifier
 * @returns {Promise<Object>} Detailed route data
 */
export const getRouteDetails = async (routeId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const route = MOCK_ROUTES.find(r => r.id === routeId);
  if (!route) {
    throw new Error('Route not found');
  }
  
  return route;
};

/**
 * Calculate personalized comfort score based on user profile
 * @param {Object} route - Route data
 * @param {Object} userProfile - User preferences
 * @returns {number} Personalized score (0-100)
 */
export const calculatePersonalizedScore = (route, userProfile) => {
  if (!userProfile) return route.comfortScore;
  
  let score = route.comfortScore;
  const avoid = userProfile.avoidPreferences || [];
  
  // Adjust score based on user avoid preferences
  if (avoid.includes('noisy_areas') && route.noiseLevel === 'high') {
    score -= 20;
  }
  if (avoid.includes('crowded_areas') && route.crowdLevel === 'high') {
    score -= 20;
  }
  if (avoid.includes('poor_lighting') && route.warnings.includes('poor_lighting')) {
    score -= 15;
  }
  if (avoid.includes('stairs') && route.warnings.includes('stairs')) {
    score -= 25;
  }
  if (avoid.includes('unsafe_crossings') && route.warnings.includes('dangerous_crossing')) {
    score -= 20;
  }
  
  // Adjust for sensitivity level
  if (userProfile.sensitivityLevel === 'high') {
    if (route.noiseLevel !== 'low') score -= 10;
    if (route.crowdLevel !== 'low') score -= 10;
  }
  
  // Ensure score stays within bounds
  return Math.max(0, Math.min(100, score));
};

/**
 * Sort routes based on user preferences
 * @param {Array} routes - Array of routes
 * @param {Object} userProfile - User preferences
 * @returns {Array} Sorted routes
 */
const sortRoutesByPreference = (routes, userProfile) => {
  const preferredMode = userProfile?.preferredMode || 'walking';
  
  return routes.sort((a, b) => {
    // Prioritize preferred mode
    if (a.mode === preferredMode && b.mode !== preferredMode) return -1;
    if (b.mode === preferredMode && a.mode !== preferredMode) return 1;
    
    // Then sort by comfort score (higher first)
    return b.comfortScore - a.comfortScore;
  });
};

/**
 * Get turn-by-turn navigation instructions
 * @param {string} routeId - Route identifier
 * @returns {Promise<Array>} Array of navigation steps
 */
export const getNavigationSteps = async (routeId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const route = MOCK_ROUTES.find(r => r.id === routeId);
  if (!route) {
    throw new Error('Route not found');
  }
  
  return route.steps || [];
};

/**
 * Check for environmental warnings along route
 * @param {string} routeId - Route identifier
 * @returns {Promise<Array>} Array of warning objects
 */
export const getRouteWarnings = async (routeId) => {
  const route = MOCK_ROUTES.find(r => r.id === routeId);
  if (!route) return [];
  
  return route.warnings.map(warning => ({
    type: warning,
    message: getWarningMessage(warning),
    severity: getWarningSeverity(warning),
  }));
};

/**
 * Get human-readable warning message
 * @param {string} warningType - Warning type
 * @returns {string} Warning message
 */
const getWarningMessage = (warningType) => {
  const messages = {
    high_noise: 'High noise area ahead',
    crowded_zone: 'Crowded area - proceed with caution',
    poor_lighting: 'Poor lighting in this area',
    stairs: 'Stairs ahead - alternative route available',
    dangerous_crossing: 'Busy crossing - use crosswalk',
    narrow_sidewalk: 'Narrow sidewalk ahead',
  };
  
  return messages[warningType] || 'Caution advised';
};

/**
 * Get warning severity level
 * @param {string} warningType - Warning type
 * @returns {string} Severity level
 */
const getWarningSeverity = (warningType) => {
  const severityMap = {
    high_noise: 'medium',
    crowded_zone: 'medium',
    poor_lighting: 'high',
    stairs: 'medium',
    dangerous_crossing: 'high',
    narrow_sidewalk: 'low',
  };
  
  return severityMap[warningType] || 'medium';
};
