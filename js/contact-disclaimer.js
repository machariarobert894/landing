document.addEventListener('DOMContentLoaded', function() {
    // Wait a short moment before showing the popup for better UX
    setTimeout(function() {
        // Always show the popup on page load, regardless of previous dismissal
        showContactDisclaimer();
    }, 1500);

    function showContactDisclaimer() {
        // Create the popup HTML structure
        const disclaimerPopup = document.createElement('div');
        disclaimerPopup.className = 'contact-disclaimer-overlay';
        disclaimerPopup.innerHTML = `
            <div class="contact-disclaimer-popup">
                <div class="disclaimer-header">
                    <h3><i class="fas fa-shield-alt"></i> Official Contact Channels</h3>
                    <button class="disclaimer-close" id="close-disclaimer">&times;</button>
                </div>
                <div class="disclaimer-content">
                    <p class="disclaimer-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>IMPORTANT:</strong> To avoid scams, please only contact us through these official channels:
                    </p>
                    <div class="official-channels">
                        <div class="channel-item">
                            <div class="channel-icon"><i class="fas fa-envelope"></i></div>
                            <div class="channel-details">
                                <h4>Email</h4>
                                <p><a href="mailto:admin@derivlite.com">admin@derivlite.com</a></p>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon"><i class="fab fa-whatsapp"></i></div>
                            <div class="channel-details">
                                <h4>WhatsApp</h4>
                                <p><a href="https://wa.me/254714653438" target="_blank">+254714653438</a></p>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon"><i class="fab fa-telegram"></i></div>
                            <div class="channel-details">
                                <h4>Telegram</h4>
                                <p><a href="https://t.me/deriv_insider" target="_blank">@deriv_insider</a></p>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon"><i class="fab fa-instagram"></i></div>
                            <div class="channel-details">
                                <h4>Instagram</h4>
                                <p><a href="https://instagram.com/derivlite.com_" target="_blank">@derivlite.com_</a></p>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon"><i class="fab fa-tiktok"></i></div>
                            <div class="channel-details">
                                <h4>TikTok</h4>
                                <p><a href="https://www.tiktok.com/@derivlite.com" target="_blank">@derivlite.com</a></p>
                            </div>
                        </div>
                    </div>
                    <div class="disclaimer-footer">
                        <p>Be vigilant of impersonators. We will never ask for your account password or private keys.</p>
                        <div class="disclaimer-actions">
                            <label class="dont-show-again">
                                <input type="checkbox" id="dont-show-again">
                                <span>Don't show again</span>
                            </label>
                            <button class="btn-primary btn-dismiss" id="dismiss-disclaimer">I Understand</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append popup to the body
        document.body.appendChild(disclaimerPopup);

        // Add animation class after a brief delay (for animation to work)
        setTimeout(() => {
            disclaimerPopup.classList.add('active');
        }, 10);

        // Close button event
        document.getElementById('close-disclaimer').addEventListener('click', dismissDisclaimer);
        
        // Dismiss button event
        document.getElementById('dismiss-disclaimer').addEventListener('click', dismissDisclaimer);

        // Function to close the disclaimer
        function dismissDisclaimer() {
            // Check if "don't show again" is checked
            if (document.getElementById('dont-show-again').checked) {
                localStorage.setItem('disclaimerDismissed', 'true');
            }
            
            // Remove the active class first (for animation)
            disclaimerPopup.classList.remove('active');
            
            // Remove the popup after animation completes
            setTimeout(() => {
                document.body.removeChild(disclaimerPopup);
            }, 300);
        }

        // Close when clicking outside
        disclaimerPopup.addEventListener('click', function(e) {
            if (e.target === disclaimerPopup) {
                dismissDisclaimer();
            }
        });
    }

    // Create the contact disclaimer element
    const createContactDisclaimer = () => {
        const container = document.createElement('div');
        container.className = 'contact-disclaimer-container';
        
        container.innerHTML = `
            <div class="contact-disclaimer">
                <div class="contact-disclaimer-header">
                    <h3><i class="fas fa-headset"></i> Need Help?</h3>
                    <button class="close-disclaimer"><i class="fas fa-times"></i></button>
                </div>
                <div class="contact-disclaimer-body">
                    <p>Have questions or need assistance? Contact our support team:</p>
                    <div class="contact-channels">
                        <a href="https://t.me/deriv_insider" class="contact-channel" target="_blank">
                            <i class="fab fa-telegram"></i> Telegram Support
                        </a>
                        <a href="mailto:admin@derivlite.com" class="contact-channel">
                            <i class="fas fa-envelope"></i> Email Support
                        </a>
                        <a href="https://wa.me/254714653438" class="contact-channel" target="_blank">
                            <i class="fab fa-whatsapp"></i> WhatsApp Support
                        </a>
                        <a href="https://instagram.com/derivlite.com_" class="contact-channel" target="_blank">
                            <i class="fab fa-instagram"></i> Instagram
                        </a>
                    </div>
                    <div class="disclaimer-text">
                        <p><strong>Disclaimer:</strong> Trading derivatives involves significant risk. Past performance is not indicative of future results. Only trade with capital you can afford to lose.</p>
                    </div>
                </div>
                <div class="contact-disclaimer-footer">
                    <a href="${window.location.pathname.includes('/blog-posts/') ? '../' : ''}privacy-policy.html">Privacy Policy</a>
                    <a href="${window.location.pathname.includes('/blog-posts/') ? '../' : ''}terms-of-service.html">Terms of Service</a>
                </div>
            </div>
            <button class="contact-disclaimer-trigger">
                <i class="fas fa-headset"></i> Support
            </button>
        `;
        
        document.body.appendChild(container);
        
        // Add event listeners
        const trigger = container.querySelector('.contact-disclaimer-trigger');
        const closeBtn = container.querySelector('.close-disclaimer');
        const disclaimer = container.querySelector('.contact-disclaimer');
        
        trigger.addEventListener('click', () => {
            disclaimer.classList.add('active');
        });
        
        closeBtn.addEventListener('click', () => {
            disclaimer.classList.remove('active');
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!disclaimer.contains(e.target) && e.target !== trigger) {
                disclaimer.classList.remove('active');
            }
        });
    };
    
    // Check if the contact disclaimer already exists
    if (!document.querySelector('.contact-disclaimer-container')) {
        createContactDisclaimer();
    }
});
