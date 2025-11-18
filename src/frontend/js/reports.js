/**
 * Reports module for Soccer Team Management application
 */

// DOM Elements
const reportTypeSelect = document.getElementById('report-type');
const reportTeamSelect = document.getElementById('report-team');
const runReportBtn = document.getElementById('run-report-btn');
const reportResults = document.getElementById('report-results');
const reportContent = document.getElementById('report-content');
const exportReportBtn = document.getElementById('export-report-btn');
const teamFilterContainer = document.getElementById('team-filter-container');

// Bootstrap API endpoints if global config not yet loaded (defensive)
if (!window.API_ENDPOINTS) {
    const fallbackBase = (localStorage.getItem('soccerApp.api.baseUrl') || 'http://localhost:5000').replace(/\/+$/, '');
    window.API_ENDPOINTS = {
        teams: `${fallbackBase}/api/teams`,
        players: `${fallbackBase}/api/players`,
        reports: `${fallbackBase}/api/reports`,
        teamComposition: (id) => `${fallbackBase}/api/reports/team-composition?team_id=${id}`,
        playerPerformance: (id) => `${fallbackBase}/api/reports/player-performance?team_id=${id}`,
        valueReport: (id) => `${fallbackBase}/api/reports/value-report?team_id=${id}`,
        injuryReport: (id) => `${fallbackBase}/api/reports/injury-report?team_id=${id}`
    };
    console.warn('[reports.js] Fallback API_ENDPOINTS created', window.API_ENDPOINTS);
}

// Event Listeners
if (runReportBtn) runReportBtn.addEventListener('click', generateReport);
if (exportReportBtn) exportReportBtn.addEventListener('click', exportReportToCSV);
if (reportTypeSelect) reportTypeSelect.addEventListener('change', handleReportTypeChange);

/**
 * Setup Reports Section - Called when the reports section is shown
 */
function setupReportsSection() {
    console.log('Setting up reports section');
    loadTeamsForReports();
    handleReportTypeChange(); // Initialize filters based on report type
}

/**
 * Load teams for the report selector
 */
async function loadTeamsForReports() {
    try {
        showLoading();
        console.log('Fetching teams for report selector from:', API_ENDPOINTS.teams);
        const response = await fetch(API_ENDPOINTS.teams);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
        }
        
        const teams = await response.json();
        console.log('Teams loaded:', teams);
        
        // Clear existing options (except the first one)
        while (reportTeamSelect.options.length > 1) {
            reportTeamSelect.remove(1);
        }
        
        // Add team options
        teams.forEach(team => {
            const option = document.createElement('option');
            // Handle both property naming conventions (id or ID)
            option.value = team.id || team.ID || '';
            option.textContent = team.name || team.Name || 'Unknown team';
            reportTeamSelect.appendChild(option);
            console.log(`Added team option: ${option.textContent} (ID: ${option.value})`);
        });
    } catch (error) {
        console.error('Error loading teams for reports:', error);
        alert('Failed to load teams. Please check the console for details.');
    } finally {
        hideLoading();
    }
}

/**
 * Handle report type change to show/hide relevant filters
 */
function handleReportTypeChange() {
    const reportType = reportTypeSelect.value;
    
    // Hide all filters first
    teamFilterContainer.classList.remove('hidden');
    
    // Show relevant filters based on report type
    switch (reportType) {
        case 'team-composition':
            teamFilterContainer.classList.remove('hidden');
            break;
        case 'player-performance':
            teamFilterContainer.classList.remove('hidden');
            break;
        case 'value-report':
            teamFilterContainer.classList.remove('hidden');
            break;
        case 'injury-report':
            teamFilterContainer.classList.remove('hidden');
            break;
    }
    
    // Reset report results
    reportResults.classList.add('hidden');
    reportContent.innerHTML = '';
}

/**
 * Generate report based on selected options
 */
async function generateReport() {
    console.clear();
    const reportType = reportTypeSelect.value;
    const rawTeamId = reportTeamSelect.value;
    console.log(`Generating report: ${reportType} for team ID: ${rawTeamId} (type: ${typeof rawTeamId})`);
    if (!rawTeamId) {
        alert('Please select a team for the report.');
        return;
    }
    const teamId = String(rawTeamId);
    try {
        showLoading();
        
        // Call the appropriate API endpoint based on the report type
        let reportData = null;
        
        console.log(`Fetching data for ${reportType} report...`);
        
        switch (reportType) {
            case 'team-composition':
                reportData = await generateTeamCompositionReport(teamId);
                break;
            case 'player-performance':
                reportData = await generatePlayerPerformanceReport(teamId);
                break;
            case 'value-report':
                reportData = await generateValueReport(teamId);
                break;
            case 'injury-report':
                reportData = await generateInjuryReport(teamId);
                break;
            default:
                throw new Error(`Unsupported report type: ${reportType}`);
        }
        
        console.log(`Report data received:`, reportData);
        
        // Render report if data was returned
        if (reportData) {
            renderReport(reportType, reportData);
            reportResults.classList.remove('hidden');
            console.log(`Report rendered successfully`);
        } else {
            throw new Error('No data returned from the report generator');
        }
        
    } catch (error) {
        console.error('Error generating report:', error);
        let errorMessage = 'Failed to generate report. ';
        
        if (error.message) {
            if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Could not connect to the server. Please check if the backend service is running.';
            } else {
                errorMessage += error.message;
            }
        } else {
            errorMessage += 'Please try again.';
        }
        
        console.error(errorMessage);
        alert(errorMessage);
        reportResults.classList.add('hidden');
    } finally {
        hideLoading();
    }
}

/**
 * Generate Team Composition Report
 * @param {string} teamId - The team ID to generate the report for
 * @returns {Object} - Report data
 */
async function generateTeamCompositionReport(teamId) {
    try {
        const url = `${API_ENDPOINTS.reports.teamComposition}?team_id=${teamId}`;
        console.log('Fetching team composition report from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`Failed to fetch team composition report: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error in generateTeamCompositionReport:', error);
        throw error;
    }
}

/**
 * Generate Player Performance Report
 * @param {string} teamId - The team ID to generate the report for
 * @returns {Object} - Report data
 */
async function generatePlayerPerformanceReport(teamId) {
    try {
        // Get team data using the teams endpoint
        const teamsResponse = await fetch(API_ENDPOINTS.teams);
        const teams = await teamsResponse.json();
        console.log('All teams:', teams);
        
        // Handle different property naming conventions
        const team = teams.find(t => (t.id == teamId) || (t.ID == teamId));
        console.log('Selected team:', team);
        
        if (!team) {
            throw new Error(`Team with ID ${teamId} not found in the list of ${teams.length} teams`);
        }
        
        // Get all players for the team
        const playersResponse = await fetch(API_ENDPOINTS.players);
        const allPlayers = await playersResponse.json();
        console.log('All players:', allPlayers);
        
        // Match by team_id or teamId (handle both formats)
        const teamPlayers = allPlayers.filter(player => {
            // Check all possible property naming conventions
            const playerTeamId = player.team_id || player.teamId || player.TeamId || player.team_ID || null;
            return playerTeamId == teamId;
        });
        
        if (teamPlayers.length === 0) {
            throw new Error('No players found for this team');
        }
        
        // Sort by rating (handle both property naming conventions)
        teamPlayers.sort((a, b) => {
            const ratingA = a.rating || a.Rating || 0;
            const ratingB = b.rating || b.Rating || 0;
            return ratingB - ratingA;
        });
        
        // Calculate average rating (handle both property naming conventions)
        const averageRating = teamPlayers.length > 0 ? 
            teamPlayers.reduce((sum, player) => {
                return sum + parseFloat(player.rating || player.Rating || 0);
            }, 0) / teamPlayers.length : 0;
        
        // Safety check for edge cases
        if (teamPlayers.length === 0) {
            return {
                team: team,
                players: [],
                highestRated: { name: 'None', rating: 0 },
                lowestRated: { name: 'None', rating: 0 },
                averageRating: 0
            };
        }
        
        return {
            team: team,
            players: teamPlayers,
            highestRated: teamPlayers[0],
            lowestRated: teamPlayers[teamPlayers.length - 1],
            averageRating: averageRating
        };
    } catch (error) {
        console.error('Error generating player performance report:', error);
        throw error;
    }
}

/**
 * Generate Value Report
 * @param {string} teamId - The team ID to generate the report for
 * @returns {Object} - Report data
 */
async function generateValueReport(teamId) {
    try {
        // Get team data using the teams endpoint
        const teamsResponse = await fetch(API_ENDPOINTS.teams);
        const teams = await teamsResponse.json();
        console.log('All teams:', teams);
        
        // Handle different property naming conventions
        const team = teams.find(t => (t.id == teamId) || (t.ID == teamId));
        console.log('Selected team:', team);
        
        if (!team) {
            throw new Error(`Team with ID ${teamId} not found in the list of ${teams.length} teams`);
        }
        
        // Get all players for the team
        const playersResponse = await fetch(API_ENDPOINTS.players);
        const allPlayers = await playersResponse.json();
        console.log('All players:', allPlayers);
        
        // Match by team_id or teamId (handle both formats)
        const teamPlayers = allPlayers.filter(player => {
            // Check all possible property naming conventions
            const playerTeamId = player.team_id || player.teamId || player.TeamId || player.team_ID || null;
            return playerTeamId == teamId;
        });
        
        if (teamPlayers.length === 0) {
            throw new Error('No players found for this team');
        }
        
        // Sort by value (handle both property naming conventions)
        teamPlayers.sort((a, b) => {
            const valueA = a.player_value || a.playerValue || 0;
            const valueB = b.player_value || b.playerValue || 0;
            return valueB - valueA;
        });
        
        // Calculate total and average values (handle both property naming conventions)
        const totalValue = teamPlayers.reduce((sum, player) => {
            return sum + parseFloat(player.player_value || player.playerValue || 0);
        }, 0);
        
        const averageValue = teamPlayers.length > 0 ? totalValue / teamPlayers.length : 0;
        
        // Safety check for edge cases
        if (teamPlayers.length === 0) {
            return {
                team: team,
                players: [],
                totalValue: 0,
                mostValuable: { name: 'None', player_value: 0 },
                leastValuable: { name: 'None', player_value: 0 },
                averageValue: 0
            };
        }
        
        return {
            team: team,
            players: teamPlayers,
            totalValue: totalValue,
            mostValuable: teamPlayers[0],
            leastValuable: teamPlayers[teamPlayers.length - 1],
            averageValue: averageValue
        };
    } catch (error) {
        console.error('Error generating value report:', error);
        throw error;
    }
}

/**
 * Generate Injury Report
 * @param {string} teamId - The team ID to generate the report for
 * @returns {Object} - Report data
 */
async function generateInjuryReport(teamId) {
    try {
        // Get team data using the teams endpoint
        const teamsResponse = await fetch(API_ENDPOINTS.teams);
        const teams = await teamsResponse.json();
        console.log('All teams:', teams);
        
        // Handle different property naming conventions
        const team = teams.find(t => (t.id == teamId) || (t.ID == teamId));
        console.log('Selected team:', team);
        
        if (!team) {
            throw new Error(`Team with ID ${teamId} not found in the list of ${teams.length} teams`);
        }
        
        // Get all players for the team
        const playersResponse = await fetch(API_ENDPOINTS.players);
        const allPlayers = await playersResponse.json();
        console.log('All players:', allPlayers);
        
        // Match by team_id or teamId (handle both formats)
        const teamPlayers = allPlayers.filter(player => {
            // Check all possible property naming conventions
            const playerTeamId = player.team_id || player.teamId || player.TeamId || player.team_ID || null;
            return playerTeamId == teamId;
        });
        
        // Filter injured players (handle both property naming conventions)
        const injuredPlayers = teamPlayers.filter(player => 
            player.is_injured === true || player.isInjured === true
        );
        
        return {
            team: team,
            totalPlayers: teamPlayers.length,
            injuredPlayers: injuredPlayers,
            injuryRate: teamPlayers.length > 0 ? (injuredPlayers.length / teamPlayers.length) * 100 : 0
        };
    } catch (error) {
        console.error('Error generating injury report:', error);
        throw error;
    }
}

/**
 * Render the report based on type and data
 * @param {string} reportType - The type of report to render
 * @param {Object} data - The report data
 */
function renderReport(reportType, data) {
    reportContent.innerHTML = '';
    
    switch (reportType) {
        case 'team-composition':
            renderTeamCompositionReport(data);
            break;
        case 'player-performance':
            renderPlayerPerformanceReport(data);
            break;
        case 'value-report':
            renderValueReport(data);
            break;
        case 'injury-report':
            renderInjuryReport(data);
            break;
    }
}

/**
 * Render Team Composition Report
 * @param {Object} data - Report data
 */
function renderTeamCompositionReport(data) {
    // Helper functions to handle different property naming conventions
    const getPlayerValue = (player) => player.player_value || player.playerValue || 0;
    const getPlayerPosition = (player) => player.position || player.Position || '';
    const getPlayerName = (player) => player.name || player.Name || 'Unknown';
    
    // Handle different property naming between C# and Python backends
    const totalPlayers = data.total_players || data.totalPlayers || 0;
    const averageRating = data.average_rating || data.averageRating || 0;
    const totalValue = data.total_value || data.totalValue || 0;
    const injuredPlayers = data.injured_players || data.injuredPlayers || [];
    const positions = data.positions || {};
    const nationalities = data.nationalities || {};
    
    const html = `
        <div class="report-header">
            <h3>${data.team.name} Team Composition Report</h3>
            <p>Total Players: ${totalPlayers}</p>
        </div>
        
        <div class="report-section">
            <h4>Position Distribution</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(positions).map(([position, count]) => `
                        <tr>
                            <td>${position}</td>
                            <td>${count}</td>
                            <td>${totalPlayers ? ((count / totalPlayers) * 100).toFixed(1) : 0}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="report-section">
            <h4>Nationality Distribution</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Country</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(nationalities).map(([country, count]) => `
                        <tr>
                            <td>${country}</td>
                            <td>${count}</td>
                            <td>${totalPlayers ? ((count / totalPlayers) * 100).toFixed(1) : 0}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="report-section">
            <h4>Performance & Value</h4>
            <p>Average Player Rating: ${averageRating.toFixed(1)}</p>
            <p>Total Team Value: $${numberWithCommas(totalValue)}</p>
        </div>
        
        <div class="report-section">
            <h4>Injured Players (${injuredPlayers.length})</h4>
            ${injuredPlayers.length > 0 ? `
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${injuredPlayers.map(player => `
                            <tr>
                                <td>${getPlayerName(player)}</td>
                                <td>${getPlayerPosition(player)}</td>
                                <td>$${numberWithCommas(getPlayerValue(player))}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<p>No injured players</p>'}
        </div>
    `;
    
    reportContent.innerHTML = html;
}

/**
 * Render Player Performance Report
 * @param {Object} data - Report data
 */
function renderPlayerPerformanceReport(data) {
    // Helper functions to handle different property naming conventions
    const getPlayerRating = (player) => player.rating || player.Rating || 0;
    const getPlayerPosition = (player) => player.position || player.Position || '';
    const getPlayerName = (player) => player.name || player.Name || 'Unknown';
    
    const html = `
        <div class="report-header">
            <h3>${data.team.name} Player Performance Report</h3>
        </div>
        
        <div class="report-section">
            <h4>Performance Overview</h4>
            <p>Average Player Rating: ${data.averageRating.toFixed(1)}</p>
            <p>Highest Rated Player: ${getPlayerName(data.highestRated)} (${getPlayerRating(data.highestRated)})</p>
            <p>Lowest Rated Player: ${getPlayerName(data.lowestRated)} (${getPlayerRating(data.lowestRated)})</p>
        </div>
        
        <div class="report-section">
            <h4>Player Ratings</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.players.map(player => `
                        <tr>
                            <td>${getPlayerName(player)}</td>
                            <td>${getPlayerPosition(player)}</td>
                            <td>${getPlayerRating(player)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    reportContent.innerHTML = html;
}

/**
 * Render Value Report
 * @param {Object} data - Report data
 */
function renderValueReport(data) {
    // Helper function to get the value regardless of property name
    const getPlayerValue = (player) => {
        const value = player.player_value || player.playerValue || 0;
        return parseFloat(value);
    };
    const getPlayerPosition = (player) => player.position || player.Position || '';
    const getPlayerName = (player) => player.name || player.Name || 'Unknown';
    
    // Debug the data we're working with
    console.log('Rendering value report with data:', data);
    console.log('Team name:', data.team?.name);
    console.log('Most valuable player:', data.mostValuable ? getPlayerName(data.mostValuable) : 'None');
    console.log('Players count:', data.players?.length || 0);
    
    // Safety checks
    if (!data.team || !data.players || !data.mostValuable || !data.leastValuable) {
        console.error('Missing required data for value report:', data);
        reportContent.innerHTML = '<div class="error-message">Error: Missing required data for this report.</div>';
        return;
    }
    
    const html = `
        <div class="report-header">
            <h3>${data.team.name} Value Report</h3>
        </div>
        
        <div class="report-section">
            <h4>Value Overview</h4>
            <p>Total Team Value: $${numberWithCommas(data.totalValue)}</p>
            <p>Average Player Value: $${numberWithCommas(data.averageValue.toFixed(2))}</p>
            <p>Most Valuable Player: ${getPlayerName(data.mostValuable)} ($${numberWithCommas(getPlayerValue(data.mostValuable))})</p>
            <p>Least Valuable Player: ${getPlayerName(data.leastValuable)} ($${numberWithCommas(getPlayerValue(data.leastValuable))})</p>
        </div>
        
        <div class="report-section">
            <h4>Player Values</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.players.map(player => `
                        <tr>
                            <td>${getPlayerName(player)}</td>
                            <td>${getPlayerPosition(player)}</td>
                            <td>$${numberWithCommas(getPlayerValue(player))}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    reportContent.innerHTML = html;
}

/**
 * Render Injury Report
 * @param {Object} data - Report data
 */
function renderInjuryReport(data) {
    // Helper functions to handle different property naming conventions
    const getPlayerValue = (player) => player.player_value || player.playerValue || 0;
    const getPlayerRating = (player) => player.rating || player.Rating || 0;
    const getPlayerPosition = (player) => player.position || player.Position || '';
    const getPlayerName = (player) => player.name || player.Name || 'Unknown';
    
    const html = `
        <div class="report-header">
            <h3>${data.team.name} Injury Report</h3>
        </div>
        
        <div class="report-section">
            <h4>Injury Overview</h4>
            <p>Total Players: ${data.totalPlayers}</p>
            <p>Injured Players: ${data.injuredPlayers.length}</p>
            <p>Injury Rate: ${data.injuryRate.toFixed(1)}%</p>
        </div>
        
        <div class="report-section">
            <h4>Injured Players</h4>
            ${data.injuredPlayers.length > 0 ? `
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Value</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.injuredPlayers.map(player => `
                            <tr>
                                <td>${getPlayerName(player)}</td>
                                <td>${getPlayerPosition(player)}</td>
                                <td>$${numberWithCommas(getPlayerValue(player))}</td>
                                <td>${getPlayerRating(player)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<p>No injured players</p>'}
        </div>
    `;
    
    reportContent.innerHTML = html;
}

/**
 * Export report to CSV
 */
function exportReportToCSV() {
    const reportType = reportTypeSelect.value;
    const teamName = reportTeamSelect.options[reportTeamSelect.selectedIndex].text;
    
    // Get table data
    const table = reportContent.querySelector('table');
    if (!table) {
        alert('No data to export');
        return;
    }
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add report title
    csvContent += `${teamName} - ${reportTypeSelect.options[reportTypeSelect.selectedIndex].text}\r\n\r\n`;
    
    // Add table headers
    const headers = Array.from(table.querySelectorAll('th'))
        .map(th => `"${th.textContent}"`);
    csvContent += headers.join(',') + '\r\n';
    
    // Add table rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'))
            .map(td => `"${td.textContent}"`);
        csvContent += cells.join(',') + '\r\n';
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportType}_${teamName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
}
