/**
 * API Configuration
 * This module handles the API configuration and provides a way to switch between backends
 */

// Default configuration
const DEFAULT_CONFIG = {
    apiType: 'python',
    apiBaseUrl: 'http://localhost:5000/api'
};

// Load configuration from localStorage or use defaults
function loadConfig() {
    const savedConfig = localStorage.getItem('soccerAppConfig');
    if (savedConfig) {
        try {
            return JSON.parse(savedConfig);
        } catch (e) {
            console.error('Error parsing saved config:', e);
            return DEFAULT_CONFIG;
        }
    }
    return DEFAULT_CONFIG;
}

// Save configuration to localStorage
function saveConfig(config) {
    localStorage.setItem('soccerAppConfig', JSON.stringify(config));
    updateApiEndpoints(config);
    return config;
}

// Initialize configuration
const CONFIG = loadConfig();
const API_TYPE = CONFIG.apiType;
const API_BASE_URL = CONFIG.apiBaseUrl;

// Update API endpoints based on configuration
function updateApiEndpoints(config) {
    const baseUrl = config.apiBaseUrl;
    
    // Update global API_ENDPOINTS object
    API_ENDPOINTS.teams = `${baseUrl}/teams`;
    API_ENDPOINTS.players = `${baseUrl}/players`;
    API_ENDPOINTS.reports.teamComposition = `${baseUrl}/reports/team-composition`;
    API_ENDPOINTS.reports.playerPerformance = `${baseUrl}/reports/player-performance`;
    API_ENDPOINTS.reports.valueReport = `${baseUrl}/reports/value-report`;
    API_ENDPOINTS.reports.injuryReport = `${baseUrl}/reports/injury-report`;
    
    console.log(`API endpoints updated to use ${config.apiType} backend at ${baseUrl}`);
}

// API Endpoints
const API_ENDPOINTS = {
    teams: `${API_BASE_URL}/teams`,
    players: `${API_BASE_URL}/players`,
    reports: {
        teamComposition: `${API_BASE_URL}/reports/team-composition`,
        playerPerformance: `${API_BASE_URL}/reports/player-performance`,
        valueReport: `${API_BASE_URL}/reports/value-report`,
        injuryReport: `${API_BASE_URL}/reports/injury-report`
    }
};

// Test API connection
async function testApiConnection(baseUrl) {
    try {
        const response = await fetch(`${baseUrl}/teams`);
        if (response.ok) {
            const data = await response.json();
            console.log(`API connection successful. Found ${data.length} teams.`);
            return { success: true, message: `Connected successfully. Found ${data.length} teams.` };
        } else {
            console.error('API connection failed:', response.status, response.statusText);
            return { success: false, message: `Connection failed: ${response.status} ${response.statusText}` };
        }
    } catch (error) {
        console.error('API connection error:', error);
        return { success: false, message: `Connection error: ${error.message}` };
    }
}

console.log(`Using ${API_TYPE} API backend at ${API_BASE_URL}`);
