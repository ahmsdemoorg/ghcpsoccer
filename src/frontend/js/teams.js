/**
 * Teams management module
 */

// DOM Elements
const teamsTable = document.getElementById('teams-table');
const teamsList = document.getElementById('teams-list');
const newTeamBtn = document.getElementById('new-team-btn');
const teamSearch = document.getElementById('team-search');
const countryFilter = document.getElementById('country-filter');
const leagueFilter = document.getElementById('league-filter');

// Team modal elements
const teamModal = document.getElementById('team-modal');
const teamModalTitle = document.getElementById('team-modal-title');
const teamForm = document.getElementById('team-form');
const teamIdInput = document.getElementById('team-id');
const teamNameInput = document.getElementById('team-name');
const teamYearInput = document.getElementById('team-year');
const teamStadiumInput = document.getElementById('team-stadium');
const teamColorsInput = document.getElementById('team-colors');
const teamCountryInput = document.getElementById('team-country');
const teamLeagueInput = document.getElementById('team-league');
const teamPositionInput = document.getElementById('team-position');
const teamValueInput = document.getElementById('team-value');
const teamDescriptionInput = document.getElementById('team-description');
const teamWikiInput = document.getElementById('team-wiki');
const saveTeamBtn = document.getElementById('save-team-btn');
const cancelTeamBtn = document.getElementById('cancel-team-btn');
const closeTeamBtn = teamModal.querySelector('.close-btn');

// Event listeners
newTeamBtn.addEventListener('click', openTeamModal);
teamForm.addEventListener('submit', saveTeam);
cancelTeamBtn.addEventListener('click', closeTeamModal);
closeTeamBtn.addEventListener('click', closeTeamModal);
teamSearch.addEventListener('input', filterTeams);
countryFilter.addEventListener('change', filterTeams);
leagueFilter.addEventListener('change', filterTeams);

// Teams data
let teamsData = [];

/**
 * Load teams from API
 */
async function loadTeams() {
    showLoading();
    try {
        const response = await fetch(API_ENDPOINTS.teams);
        teamsData = await response.json();
        populateTeamsTable(teamsData);
        populateFilters(teamsData);
    } catch (error) {
        console.error('Error loading teams:', error);
    } finally {
        hideLoading();
    }
}

/**
 * Populate teams table with data
 * @param {Array} teams - Array of team objects
 */
function populateTeamsTable(teams) {
    teamsList.innerHTML = '';
    
    if (teams.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5">No teams found</td>';
        teamsList.appendChild(row);
        return;
    }
    
    teams.forEach(team => {
        const row = document.createElement('tr');
        
        // Handle different property naming conventions (snake_case or camelCase)
        const id = team.id;
        const name = team.name || team.team_name || '';
        const country = team.country || '';
        const league = team.league || '';
        const value = team.team_value || team.teamValue || 0;
        
        row.innerHTML = `
            <td>${name}</td>
            <td>${country}</td>
            <td>${league}</td>
            <td>$${numberWithCommas(value)}</td>
            <td>
                <button class="edit-team-btn" data-id="${id}">Edit</button>
                <button class="delete-team-btn" data-id="${id}">Delete</button>
            </td>
        `;
        
        teamsList.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-team-btn').forEach(button => {
        button.addEventListener('click', () => {
            const teamId = parseInt(button.getAttribute('data-id'));
            openTeamModal(teamId);
        });
    });
    
    document.querySelectorAll('.delete-team-btn').forEach(button => {
        button.addEventListener('click', () => {
            const teamId = parseInt(button.getAttribute('data-id'));
            deleteTeam(teamId);
        });
    });
}

/**
 * Populate filters with unique values
 * @param {Array} teams - Array of team objects
 */
function populateFilters(teams) {
    // Clear existing options (except first one)
    countryFilter.innerHTML = '<option value="">All Countries</option>';
    leagueFilter.innerHTML = '<option value="">All Leagues</option>';
    
    // Get unique countries and leagues
    const countries = [...new Set(teams.map(team => team.country))].filter(Boolean).sort();
    const leagues = [...new Set(teams.map(team => team.league))].filter(Boolean).sort();
    
    // Add options to filters
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
    
    leagues.forEach(league => {
        const option = document.createElement('option');
        option.value = league;
        option.textContent = league;
        leagueFilter.appendChild(option);
    });
}

/**
 * Filter teams based on search and filter values
 */
function filterTeams() {
    const searchValue = teamSearch.value.toLowerCase();
    const countryValue = countryFilter.value;
    const leagueValue = leagueFilter.value;
    
    const filteredTeams = teamsData.filter(team => {
        // Search filter
        const nameMatch = (team.name || team.team_name || '').toLowerCase().includes(searchValue);
        
        // Country filter
        const countryMatch = !countryValue || team.country === countryValue;
        
        // League filter
        const leagueMatch = !leagueValue || team.league === leagueValue;
        
        return nameMatch && countryMatch && leagueMatch;
    });
    
    populateTeamsTable(filteredTeams);
}

/**
 * Open team modal for adding or editing a team
 * @param {number} teamId - ID of the team to edit (undefined for new team)
 */
function openTeamModal(teamId) {
    if (teamId) {
        // Edit existing team
        teamModalTitle.textContent = 'Edit Team';
        const team = teamsData.find(t => t.id === teamId);
        
        if (team) {
            teamIdInput.value = team.id;
            teamNameInput.value = team.name || team.team_name || '';
            teamYearInput.value = team.established_year || team.establishedYear || '';
            teamStadiumInput.value = team.home_stadium || team.homeStadium || '';
            teamColorsInput.value = team.club_colors || team.clubColors || '';
            teamCountryInput.value = team.country || '';
            teamLeagueInput.value = team.league || '';
            teamPositionInput.value = team.current_season_position || team.currentSeasonPosition || '';
            teamValueInput.value = team.team_value || team.teamValue || '';
            teamDescriptionInput.value = team.description || '';
            teamWikiInput.value = team.wikipedia_link || team.wikipediaLink || '';
        }
    } else {
        // Add new team
        teamModalTitle.textContent = 'Add Team';
        teamForm.reset();
        teamIdInput.value = '';
    }
    
    teamModal.style.display = 'block';
}

/**
 * Close the team modal
 */
function closeTeamModal() {
    teamModal.style.display = 'none';
}

/**
 * Save team (create or update)
 * @param {Event} event - Form submit event
 */
async function saveTeam(event) {
    event.preventDefault();
    
    const teamId = teamIdInput.value ? parseInt(teamIdInput.value) : null;
    
    const teamData = {
        name: teamNameInput.value,
        established_year: parseInt(teamYearInput.value),
        home_stadium: teamStadiumInput.value,
        club_colors: teamColorsInput.value,
        country: teamCountryInput.value,
        league: teamLeagueInput.value,
        current_season_position: parseInt(teamPositionInput.value),
        team_value: parseFloat(teamValueInput.value),
        description: teamDescriptionInput.value,
        wikipedia_link: teamWikiInput.value
    };
    
    // Add ID if editing existing team
    if (teamId) {
        teamData.id = teamId;
    }
    
    showLoading();
    try {
        let response;
        
        if (teamId) {
            // Update existing team
            response = await fetch(`${API_ENDPOINTS.teams}/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamData)
            });
        } else {
            // Create new team
            response = await fetch(API_ENDPOINTS.teams, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamData)
            });
        }
        
        if (!response.ok) {
            throw new Error('Failed to save team');
        }
        
        // Reload teams
        await loadTeams();
        
        // Close modal
        closeTeamModal();
    } catch (error) {
        console.error('Error saving team:', error);
    } finally {
        hideLoading();
    }
}

/**
 * Delete a team
 * @param {number} teamId - ID of the team to delete
 */
async function deleteTeam(teamId) {
    if (!confirm('Are you sure you want to delete this team?')) {
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_ENDPOINTS.teams}/${teamId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete team');
        }
        
        // Reload teams
        await loadTeams();
    } catch (error) {
        console.error('Error deleting team:', error);
    } finally {
        hideLoading();
    }
}
