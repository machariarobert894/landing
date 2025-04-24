document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('nav');
    
    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth < 992) {
                    nav.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Sticky header with improved animation
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > headerHeight) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
    
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.service-card, .about-content, .testimonial-item, .bot-card');
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if(elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Initial check for elements in view
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values (in a real application, you would send this data to a server)
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Example validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Display success message (in a real app, this would happen after AJAX)
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your message. We will get back to you soon!';
                
                contactForm.appendChild(successMessage);
                contactForm.reset();
                
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // In a real application, you would send this to your server
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for subscribing to our newsletter!';
                
                newsletterForm.appendChild(successMessage);
                newsletterForm.reset();
                
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            } else {
                emailInput.classList.add('error');
            }
        });
    }
    
    // Simple email validation
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Login functionality
    async function login() {
        const identifier = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        if (!identifier || !password) {
            errorMessage.textContent = 'Please enter both username/email and password.';
            return;
        }

        try {
            const response = await fetch('users.json');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const users = await response.json();

            // Find user by username
            const user = users.find(u => u.username === identifier);

            if (user && user.password === password) {
                // Successful login
                errorMessage.textContent = '';
                alert('Login successful!');
                // Redirect or perform other actions upon successful login
                // window.location.href = 'dashboard.html'; // Example redirect
            } else {
                // Invalid credentials
                errorMessage.textContent = 'Invalid username or password.';
            }
        } catch (error) {
            console.error('Error during login process:', error);
            errorMessage.textContent = 'An error occurred during login. Please try again.';
        }
    }

    // Example: Comment out code that might check login status from localStorage on page load
    /*
    document.addEventListener('DOMContentLoaded', () => {
        // const loggedInUser = localStorage.getItem('loggedInUser');
        // if (loggedInUser) {
        //     console.log('User already logged in:', loggedInUser);
        //     // Potentially redirect or update UI
        // }
    });
});
