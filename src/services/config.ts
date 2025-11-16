/**
 * Service Configuration
 * Toggle between Mock and API data service
 */

/**
 * Set to true to use mock data (for development/testing)
 * Set to false to use real API endpoints
 */
export const USE_MOCK_DATA = true;

/**
 * API Base URL (only used when USE_MOCK_DATA is false)
 * Can be overridden by VITE_API_BASE_URL environment variable
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
