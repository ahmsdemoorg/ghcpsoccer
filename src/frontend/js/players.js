/**
 * Players management module
 */

// DOM Elements for players
const playersTable = document.getElementById('players-table');
const playersList = document.getElementById('players-list');
const newPlayerBtn = document.getElementById('new-player-btn');
const playerSearch = document.getElementById('player-search');
const teamFilter = document.getElementById('team-filter');
const positionFilter = document.getElementById('position-filter');
const injuryFilter = document.getElementById('injury-filter');

// Player modal elements
const playerModal = document.getElementById('player-modal');
const playerModalTitle = document.getElementById('player-modal-title');
const playerForm = document.getElementById('player-form');
const playerIdInput = document.getElementById('player-id');
const playerNameInput = document.getElementById('player-name');
const playerDobInput = document.getElementById('player-dob');
const playerNationalityInput = document.getElementById('player-nationality');
const playerPositionInput = document.getElementById('player-position');
const playerNumberInput = document.getElementById('player-number');
const playerHeightInput = document.getElementById('player-height');
const playerWeightInput = document.getElementById('player-weight');
const playerTeamSelect = document.getElementById('player-team');
const playerValueInput = document.getElementById('player-value');
const playerInjuredSelect = document.getElementById('player-injured');
const injuryDetailsGroup = document.querySelector('.injury-details');
const injuryDetailsInput = document.getElementById('injury-details');
const playerRatingInput = document.getElementById('player-rating');
const savePlayerBtn = document.getElementById('save-player-btn');
const cancelPlayerBtn = document.getElementById('cancel-player-btn');
const closePlayerBtn = playerModal ? playerModal.querySelector('.close-btn') : null;

// Data store
let playersData = [];
let teamsCache = [];

// Event listeners
if (newPlayerBtn) newPlayerBtn.addEventListener('click', openPlayerModal);
if (playerForm) playerForm.addEventListener('submit', savePlayer);
if (cancelPlayerBtn) cancelPlayerBtn.addEventListener('click', closePlayerModal);
if (closePlayerBtn) closePlayerBtn.addEventListener('click', closePlayerModal);
if (playerSearch) playerSearch.addEventListener('input', filterPlayers);
if (teamFilter) teamFilter.addEventListener('change', filterPlayers);
if (positionFilter) positionFilter.addEventListener('change', filterPlayers);
if (injuryFilter) injuryFilter.addEventListener('change', filterPlayers);
if (playerInjuredSelect) playerInjuredSelect.addEventListener('change', () => {
    if (playerInjuredSelect.value === 'true') {
        injuryDetailsGroup.classList.remove('hidden');
    } else {
        injuryDetailsGroup.classList.add('hidden');
        injuryDetailsInput.value = '';
    }
});

/**
 * Load players from API
 */
async function loadPlayers() {
    console.log('[players.js] loadPlayers start');
    showLoading();
    try {
        await loadTeamsForPlayers();
        const data = await fetchPlayers();
        // If backend does not join team names, map from loaded teams
        const teamMap = {}; (document.getElementById('team-filter')?.querySelectorAll('option')||[]).forEach(o=>{ if(o.value) teamMap[o.value]=o.textContent; });
        data.forEach(p=>{ if(!p.team_name && (p.team_id||p.teamId)) p.team_name = teamMap[String(p.team_id||p.teamId)] || ''; });
        renderPlayers(data);
        window.__playersCache = data;
        console.log('[players.js] loadPlayers complete', data.length);
    } catch(e){
        console.error('loadPlayers failed', e);
    } finally {
        hideLoading();
    }
}

async function loadTeamsForPlayers(){
    try {
      if(!window.API_ENDPOINTS || !API_ENDPOINTS.teams){ throw new Error('API_ENDPOINTS.teams not defined'); }
      const teamsUrl = API_ENDPOINTS.teams; // e.g. http://localhost:5000/api/teams
      const res = await fetch(teamsUrl);
      if(!res.ok) throw new Error('Teams fetch failed '+res.status);
      const teams = await res.json();
      const filterSel = document.getElementById(teamFilterId);
      const modalSel = document.getElementById('player-team');
      if(filterSel){ filterSel.querySelectorAll('option:not([value=""])').forEach(o=>o.remove()); }
      if(modalSel){ modalSel.querySelectorAll('option').forEach(o=>o.remove()); }
      teams.forEach(t=>{
        const opt1=document.createElement('option'); opt1.value=t.id||t.Id; opt1.textContent=t.name||t.Name; filterSel && filterSel.appendChild(opt1);
        const opt2=document.createElement('option'); opt2.value=t.id||t.Id; opt2.textContent=t.name||t.Name; modalSel && modalSel.appendChild(opt2);
      });
      teamsCache = teams; // keep a cache
    } catch(e){
      console.error('Failed loading teams for players', e);
    }
  }

async function fetchPlayers(){
    if(!window.API_ENDPOINTS || !API_ENDPOINTS.players){ throw new Error('API_ENDPOINTS.players not defined'); }
    const url = API_ENDPOINTS.players; // e.g. http://localhost:5000/api/players
    const res = await fetch(url);
    if(!res.ok) throw new Error(`Failed players fetch: ${res.status}`);
    return res.json();
  }

function passesFilters(p){
    const search = document.getElementById('player-search')?.value.trim().toLowerCase();
    const tf = document.getElementById('team-filter')?.value;
    const pos = document.getElementById('position-filter')?.value;
    const inj = document.getElementById('injury-filter')?.value; // backend may not yet implement injury fields
    const name = (p.full_name || p.fullName || '').toLowerCase();
    if(search && !name.includes(search)) return false;
    if(tf && String(p.team_id||p.teamId) !== tf) return false;
    if(pos && (p.position||'') !== pos) return false;
    if(inj){
      const injured = (p.is_injured!==undefined)?p.is_injured:p.isInjured;
      if(String(injured) !== inj) return false;
    }
    return true;
  }

function renderPlayers(list){
    const tbody = document.getElementById(playersTbodyId);
    if(!tbody) return;
    tbody.innerHTML='';
    list.forEach(p=>{
      if(!passesFilters(p)) return;
      const tr=document.createElement('tr');
      tr.innerHTML = `
        <td>${p.full_name || p.fullName || ''}</td>
        <td>${p.team_name || p.teamName || ''}</td>
        <td>${p.position || ''}</td>
        <td>${p.rating || p.player_rating || p.performance_rating || '-'}</td>
        <td>${formatCurrency(p.player_value || p.playerValue)}</td>
        <td>${(p.is_injured||p.isInjured)?'Yes':'No'}</td>
        <td>
          <button class="edit-player" data-id="${p.id || p.Id}">Edit</button>
          <button class="delete-player" data-id="${p.id || p.Id}">Del</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

function populatePlayersTable(players) {
    playersList.innerHTML = '';
    if (!players || players.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7">No players found</td>';
        playersList.appendChild(row);
        return;
    }
    players.forEach(p => {
        const row = document.createElement('tr');
        const teamName = (teamsCache.find(t => t.id === p.team_id || t.id === p.teamId) || {}).name || '';
        const value = p.player_value || p.playerValue || 0;
        const injured = p.is_injured || p.isInjured ? 'Yes' : 'No';
        row.innerHTML = `
            <td>${p.full_name || p.fullName || ''}</td>
            <td>${teamName}</td>
            <td>${p.position || ''}</td>
            <td>${p.rating || ''}</td>
            <td>$${numberWithCommas(value)}</td>
            <td>${injured}</td>
            <td>
                <button class="edit-player-btn" data-id="${p.id}">Edit</button>
                <button class="delete-player-btn" data-id="${p.id}">Delete</button>
            </td>`;
        playersList.appendChild(row);
    });
    document.querySelectorAll('.edit-player-btn').forEach(btn => btn.addEventListener('click', () => openPlayerModal(parseInt(btn.dataset.id))));
    document.querySelectorAll('.delete-player-btn').forEach(btn => btn.addEventListener('click', () => deletePlayer(parseInt(btn.dataset.id))));
}

function populatePlayerFilters(players, teams) {
    // Team filter
    teamFilter.innerHTML = '<option value="">All Teams</option>';
    teams.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name;
        teamFilter.appendChild(opt);
    });
}

function filterPlayers() {
    const searchValue = playerSearch.value.toLowerCase();
    const teamValue = teamFilter.value;
    const posValue = positionFilter.value;
    const injValue = injuryFilter.value;

    const filtered = playersData.filter(p => {
        const nameMatch = (p.full_name || p.fullName || '').toLowerCase().includes(searchValue);
        const teamMatch = !teamValue || (p.team_id || p.teamId) == teamValue;
        const posMatch = !posValue || p.position === posValue;
        const injMatch = !injValue || String(p.is_injured || p.isInjured) === injValue;
        return nameMatch && teamMatch && posMatch && injMatch;
    });
    populatePlayersTable(filtered);
}

function openPlayerModal(playerId) {
    playerModalTitle.textContent = playerId ? 'Edit Player' : 'Add Player';
    if (!playerId) {
        playerForm.reset();
        playerIdInput.value = '';
    } else {
        const p = playersData.find(pl => pl.id === playerId);
        if (p) {
            playerIdInput.value = p.id;
            playerNameInput.value = p.full_name || p.fullName || '';
            playerDobInput.value = (p.date_of_birth || p.dateOfBirth || '').substring(0,10);
            playerNationalityInput.value = p.nationality || '';
            playerPositionInput.value = p.position || '';
            playerNumberInput.value = p.jersey_number || p.jerseyNumber || '';
            playerHeightInput.value = p.height || '';
            playerWeightInput.value = p.weight || '';
            playerTeamSelect.value = p.team_id || p.teamId || '';
            playerValueInput.value = p.player_value || p.playerValue || '';
            playerInjuredSelect.value = (p.is_injured || p.isInjured) ? 'true' : 'false';
            if (p.is_injured || p.isInjured) {
                injuryDetailsGroup.classList.remove('hidden');
                injuryDetailsInput.value = p.injury_details || p.injuryDetails || '';
            }
            playerRatingInput.value = p.rating || '';
        }
    }
    // Populate team select if empty
    if (playerTeamSelect.options.length <= 1) {
        teamsCache.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name;
            playerTeamSelect.appendChild(opt);
        });
    }
    playerModal.style.display = 'block';
}

function closePlayerModal() { playerModal.style.display = 'none'; }

async function savePlayer(e) {
    e.preventDefault();
    const playerId = playerIdInput.value ? parseInt(playerIdInput.value) : null;
    const payload = {
        full_name: playerNameInput.value,
        date_of_birth: playerDobInput.value,
        nationality: playerNationalityInput.value,
        position: playerPositionInput.value,
        jersey_number: parseInt(playerNumberInput.value),
        height: parseFloat(playerHeightInput.value),
        weight: parseFloat(playerWeightInput.value),
        contract_start: playerDobInput.value,  // placeholder, could add separate inputs
        contract_end: playerDobInput.value,
        salary: 0,
        player_value: parseFloat(playerValueInput.value),
        team_id: parseInt(playerTeamSelect.value),
        photo_url: '',
        is_injured: playerInjuredSelect.value === 'true',
        injury_details: playerInjuredSelect.value === 'true' ? injuryDetailsInput.value : null,
        rating: parseInt(playerRatingInput.value)
    };
    showLoading();
    try {
        let resp;
        if (playerId) {
            resp = await fetch(`${API_ENDPOINTS.players}/${playerId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        } else {
            resp = await fetch(API_ENDPOINTS.players, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        }
        if (!resp.ok) throw new Error('Failed to save player');
        await loadPlayers();
        closePlayerModal();
    } catch (e) { console.error(e); } finally { hideLoading(); }
}

async function deletePlayer(playerId) {
    if (!confirm('Delete this player?')) return;
    showLoading();
    try {
        const resp = await fetch(`${API_ENDPOINTS.players}/${playerId}`, { method: 'DELETE' });
        if (!resp.ok) throw new Error('Failed to delete player');
        await loadPlayers();
    } catch (e) { console.error(e); } finally { hideLoading(); }
}

// Ensure helpers exist when referenced
function formatCurrency(v){ if(v===null||v===undefined||isNaN(v)) return '$0'; return '$'+Number(v).toLocaleString(); }
const playersTbodyId = 'players-list';
const teamFilterId = 'team-filter';

// Re-export loadPlayers in case of hoisting issues
window.loadPlayers = loadPlayers;
// Expose loadPlayers globally (already global due to function declaration)

// Ensure numberWithCommas exists if app.js hasn't defined it yet
if (typeof window.numberWithCommas !== 'function') {
  window.numberWithCommas = function(x){
    if(x===null||x===undefined) return '0';
    const s = String(x);
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  console.warn('[players.js] Provided fallback numberWithCommas');
}

// Global API configuration (must load before other scripts)

(function() {
  // Load persisted user selection or defaults
  const storedBase = localStorage.getItem('soccerApp.api.baseUrl');
  const storedBackend = localStorage.getItem('soccerApp.api.backendType');
  const baseUrl = (storedBase || 'http://localhost:5000').replace(/\/+$/,'');
  const backendType = storedBackend || 'python';

  window.API_CONFIG = { baseUrl, backendType };

  window.API_ENDPOINTS = {
    teams:    `${baseUrl}/api/teams`,
    players:  `${baseUrl}/api/players`,
    reports:  `${baseUrl}/api/reports`,
    teamComposition: (teamId) => `${baseUrl}/api/reports/team-composition?team_id=${teamId}`
  };

  console.log('[config] API configured', window.API_CONFIG, window.API_ENDPOINTS);
})();

// --- bootstrap API endpoints if config.js failed or was emptied ---
(function ensureApiEndpoints(){
  if (!window.API_ENDPOINTS) {
    const fallbackBase =
      (window.API_CONFIG && window.API_CONFIG.baseUrl) ||
      localStorage.getItem('soccerApp.api.baseUrl') ||
      'http://localhost:5000';
    window.API_ENDPOINTS = {
      teams: `${fallbackBase.replace(/\/+$/,'')}/api/teams`,
      players: `${fallbackBase.replace(/\/+$/,'')}/api/players`,
      reports: `${fallbackBase.replace(/\/+$/,'')}/api/reports`,
      teamComposition: (id)=>`${fallbackBase.replace(/\/+$/,'')}/api/reports/team-composition?team_id=${id}`
    };
    console.warn('[players.js] Reconstructed API_ENDPOINTS fallback', window.API_ENDPOINTS);
  }
})();
