/**
 * Main Application JavaScript
 */

// DOM Elements
const dashboardLink = document.getElementById('dashboard-link');
const teamsLink = document.getElementById('teams-link');
const playersLink = document.getElementById('players-link');
const reportsLink = document.getElementById('reports-link');

const dashboardSection = document.getElementById('dashboard-section');
const teamsSection = document.getElementById('teams-section');
const playersSection = document.getElementById('players-section');
const reportsSection = document.getElementById('reports-section');

const totalTeamsElement = document.getElementById('total-teams');
const totalPlayersElement = document.getElementById('total-players');
const injuredPlayersElement = document.getElementById('injured-players');
const avgPlayerValueElement = document.getElementById('avg-player-value');

const addTeamBtn = document.getElementById('add-team-btn');
const addPlayerBtn = document.getElementById('add-player-btn');
const generateReportBtn = document.getElementById('generate-report-btn');

const loadingOverlay = document.getElementById('loading-overlay');

// Navigation
dashboardLink.addEventListener('click', () => showSection(dashboardSection));
teamsLink.addEventListener('click', () => showSection(teamsSection));
playersLink.addEventListener('click', () => showSection(playersSection));
reportsLink.addEventListener('click', () => showSection(reportsSection));

// Quick action buttons
addTeamBtn.addEventListener('click', () => {
    showSection(teamsSection);
    openTeamModal();
});

addPlayerBtn.addEventListener('click', () => {
    showSection(playersSection);
    openPlayerModal();
});

generateReportBtn.addEventListener('click', () => {
    showSection(reportsSection);
});

/**
 * Show the selected section and hide others
 * @param {HTMLElement} section - The section to show
 */
function showSection(section) {
    // Hide all sections
    dashboardSection.classList.remove('active');
    teamsSection.classList.remove('active');
    playersSection.classList.remove('active');
    reportsSection.classList.remove('active');
    
    // Remove active class from nav links
    dashboardLink.classList.remove('active');
    teamsLink.classList.remove('active');
    playersLink.classList.remove('active');
    reportsLink.classList.remove('active');
    
    // Show the selected section
    section.classList.add('active');
    
    // Add active class to the corresponding link
    if (section === dashboardSection) {
        dashboardLink.classList.add('active');
        loadDashboardData();
    } else if (section === teamsSection) {
        teamsLink.classList.add('active');
        loadTeams();
    } else if (section === playersSection) {
        playersLink.classList.add('active');
        if (typeof loadPlayers === 'function') {
            loadPlayers();
        } else {
            console.warn('[app.js] loadPlayers not ready yet; retrying up to 5 times');
            let attempts = 0;
            const retry = () => {
                attempts++;
                if (typeof window.loadPlayers === 'function') {
                    window.loadPlayers();
                } else if (attempts < 5) {
                    setTimeout(retry, 150 * attempts);
                } else {
                    console.error('[app.js] Could not initialize players after retries');
                }
            };
            setTimeout(retry, 150);
        }
    } else if (section === reportsSection) {
        reportsLink.classList.add('active');
        setupReportsSection();
    }
}

/**
 * Load dashboard data
 */
async function loadDashboardData() {
    showLoading();
    try {
        // Fetch teams
        const teamsResponse = await fetch(API_ENDPOINTS.teams);
        const teams = await teamsResponse.json();
        totalTeamsElement.textContent = teams.length;
        
        // Fetch players
        const playersResponse = await fetch(API_ENDPOINTS.players);
        const players = await playersResponse.json();
        totalPlayersElement.textContent = players.length;
        
        // Calculate injured players
        const injured = players.filter(player => player.is_injured || player.isInjured);
        injuredPlayersElement.textContent = injured.length;
        
        // Calculate average player value
        let totalValue = 0;
        players.forEach(player => {
            totalValue += parseFloat(player.player_value || player.playerValue || 0);
        });
        
        const avgValue = players.length ? (totalValue / players.length).toFixed(2) : 0;
        avgPlayerValueElement.textContent = `$${numberWithCommas(avgValue)}`;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    } finally {
        hideLoading();
    }
}

/**
 * Format number with commas for thousands
 * @param {number} x - The number to format
 * @returns {string} - Formatted number
 */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Show loading overlay
 */
function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

// Initialize the application
function initializeApp() {
    // Show dashboard by default
    showSection(dashboardSection);
}

// Call when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
