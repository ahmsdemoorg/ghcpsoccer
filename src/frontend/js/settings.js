/**
 * Settings module for Soccer Team Management application
 * Handles the settings modal and API configuration
 */

// DOM Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = settingsModal.querySelector('.close-btn');
const apiTypeSelect = document.getElementById('api-type');
const apiUrlInput = document.getElementById('api-url');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const testApiBtn = document.getElementById('test-api-btn');
const apiStatusElement = document.getElementById('api-status');
const statusDot = apiStatusElement.querySelector('.status-dot');
const statusText = apiStatusElement.querySelector('.status-text');

// Event Listeners
settingsBtn.addEventListener('click', openSettingsModal);
closeSettingsBtn.addEventListener('click', closeSettingsModal);
saveSettingsBtn.addEventListener('click', saveSettings);
testApiBtn.addEventListener('click', testConnection);

// Load current settings when modal opens
function openSettingsModal() {
    const config = loadConfig();
    apiTypeSelect.value = config.apiType;
    apiUrlInput.value = config.apiBaseUrl;
    settingsModal.style.display = 'block';
    
    // Reset status indicator
    updateStatusIndicator('pending', 'Click "Test Connection" to check API availability');
}

// Close the modal
function closeSettingsModal() {
    settingsModal.style.display = 'none';
}

// Save settings
function saveSettings() {
    const newConfig = {
        apiType: apiTypeSelect.value,
        apiBaseUrl: apiUrlInput.value.trim()
    };
    
    // Validate URL format
    if (!isValidUrl(newConfig.apiBaseUrl)) {
        alert('Please enter a valid URL for the API Base URL');
        return;
    }
    
    // Save and update configuration
    saveConfig(newConfig);
    
    // Show confirmation and reload to apply changes
    alert('Settings saved successfully! The application will reload to apply changes.');
    window.location.reload();
}

// Test API connection
async function testConnection() {
    const baseUrl = apiUrlInput.value.trim();
    
    // Validate URL format
    if (!isValidUrl(baseUrl)) {
        updateStatusIndicator('error', 'Invalid URL format');
        return;
    }
    
    updateStatusIndicator('pending', 'Testing connection...');
    
    const result = await testApiConnection(baseUrl);
    
    if (result.success) {
        updateStatusIndicator('success', result.message);
    } else {
        updateStatusIndicator('error', result.message);
    }
}

// Update status indicator
function updateStatusIndicator(status, message) {
    statusDot.className = 'status-dot';
    statusDot.classList.add(status);
    statusText.textContent = message;
    
    apiStatusElement.className = 'status-indicator';
    apiStatusElement.classList.add(status);
}

// Validate URL format
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        closeSettingsModal();
    }
});

// Initialize - check API connection on page load
document.addEventListener('DOMContentLoaded', async () => {
    const config = loadConfig();
    const result = await testApiConnection(config.apiBaseUrl);
    
    if (!result.success) {
        // If connection fails, show notification
        setTimeout(() => {
            alert(`Warning: Could not connect to API at ${config.apiBaseUrl}. Please check your settings.`);
        }, 1000);
    }
});
