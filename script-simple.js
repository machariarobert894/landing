// Simple JavaScript for DerivLite
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.classList.add('loading');
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                alert('Thank you for your message! We\'ll get back to you soon.');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitButton.classList.remove('loading');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
    
    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll('.card, .section-title, .stat-item');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // Simple analytics (optional)
    function trackEvent(eventName, properties = {}) {
        // Replace with your analytics tracking code
        console.log('Event:', eventName, properties);
    }
    
    // Track button clicks
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('button_click', {
                text: this.textContent.trim(),
                href: this.href || 'no-href'
            });
        });
    });
    
    // Track form submissions
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            trackEvent('contact_form_submit');
        });
    }
});

// Simple utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
const handleResize = debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const nav = document.querySelector('nav');
        const mobileToggle = document.querySelector('.mobile-toggle');
        if (nav && mobileToggle) {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    }
}, 250);

window.addEventListener('resize', handleResize);
