document.addEventListener('DOMContentLoaded', function() {
    // Cookie consent elements
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('accept-cookies');
    const customizeBtn = document.getElementById('customize-cookies');
    
    // Check if user has already made a cookie choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    // Show the banner if no consent has been given
    if (!cookieConsent) {
        setTimeout(() => {
            cookieBanner.style.display = 'block';
        }, 1000); // Small delay before showing
    }
    
    // Accept all cookies
    acceptBtn.addEventListener('click', function() {
        acceptCookies();
    });
    
    // Open cookie preferences modal
    customizeBtn.addEventListener('click', function() {
        showPreferencesModal();
    });
    
    // Function to accept all cookies
    function acceptCookies() {
        // Store consent in localStorage
        const consent = {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true,
            accepted: new Date().toISOString(),
        };
        
        localStorage.setItem('cookieConsent', JSON.stringify(consent));
        
        // Hide the banner with animation
        cookieBanner.style.animation = 'slideUp 0.5s reverse forwards';
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 500);
    }
    
    // Function to show preferences modal
    function showPreferencesModal() {
        // Create modal if it doesn't exist
        if (!document.querySelector('.cookie-preferences')) {
            createPreferencesModal();
        }
        
        // Show the modal
        const preferencesModal = document.querySelector('.cookie-preferences');
        preferencesModal.style.display = 'flex';
        preferencesModal.style.animation = 'fadeIn 0.3s forwards';
    }
    
    // Function to create the preferences modal
    function createPreferencesModal() {
        const modal = document.createElement('div');
        modal.className = 'cookie-preferences';
        
        // Get current settings or defaults
        let currentSettings = JSON.parse(localStorage.getItem('cookieConsent')) || {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true
        };
        
        modal.innerHTML = `
            <div class="preferences-content">
                <div class="preferences-header">
                    <h3>Cookie Preferences</h3>
                    <button class="close-preferences">&times;</button>
                </div>
                <div class="preferences-options">
                    <div class="preference-option">
                        <div class="option-info">
                            <h4>Necessary Cookies</h4>
                            <p>Essential for the website to function properly.</p>
                        </div>
                        <div class="option-toggle">
                            <input type="checkbox" id="necessary-cookies" checked disabled>
                        </div>
                    </div>
                    <div class="preference-option">
                        <div class="option-info">
                            <h4>Functional Cookies</h4>
                            <p>Enable personalized features and preferences.</p>
                        </div>
                        <div class="option-toggle">
                            <input type="checkbox" id="functional-cookies" ${currentSettings.functional ? 'checked' : ''}>
                        </div>
                    </div>
                    <div class="preference-option">
                        <div class="option-info">
                            <h4>Analytics Cookies</h4>
                            <p>Help us improve by tracking how you use the site.</p>
                        </div>
                        <div class="option-toggle">
                            <input type="checkbox" id="analytics-cookies" ${currentSettings.analytics ? 'checked' : ''}>
                        </div>
                    </div>
                    <div class="preference-option">
                        <div class="option-info">
                            <h4>Marketing Cookies</h4>
                            <p>Used to deliver relevant ads and marketing campaigns.</p>
                        </div>
                        <div class="option-toggle">
                            <input type="checkbox" id="marketing-cookies" ${currentSettings.marketing ? 'checked' : ''}>
                        </div>
                    </div>
                </div>
                <div class="preferences-footer">
                    <button class="btn-cookie-customize" id="save-preferences">Save Preferences</button>
                    <button class="btn-cookie-accept" id="accept-all-preferences">Accept All</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button handler
        const closeBtn = modal.querySelector('.close-preferences');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Accept all button handler
        const acceptAllBtn = document.getElementById('accept-all-preferences');
        acceptAllBtn.addEventListener('click', function() {
            acceptCookies();
            modal.style.display = 'none';
        });
        
        // Save preferences button handler
        const saveBtn = document.getElementById('save-preferences');
        saveBtn.addEventListener('click', function() {
            savePreferences();
            modal.style.display = 'none';
        });
        
        // Click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Function to save cookie preferences
    function savePreferences() {
        const consent = {
            necessary: true, // Always required
            functional: document.getElementById('functional-cookies').checked,
            analytics: document.getElementById('analytics-cookies').checked,
            marketing: document.getElementById('marketing-cookies').checked,
            accepted: new Date().toISOString(),
        };
        
        localStorage.setItem('cookieConsent', JSON.stringify(consent));
        
        // Hide the banner
        cookieBanner.style.animation = 'slideUp 0.5s reverse forwards';
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 500);
    }
});
