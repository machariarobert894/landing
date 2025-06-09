document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('nav');
    const body = document.body;
    
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }
    
    // Handle menu toggle
    function toggleMenu() {
        nav.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (nav.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
    
    mobileToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', () => {
        nav.classList.remove('active');
        mobileToggle.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    });
    
    // Close menu when pressing escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Enhanced dropdown behavior for mobile
    const dropdownLinks = document.querySelectorAll('.dropdown > a');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Create toggle buttons for dropdowns
    dropdowns.forEach(dropdown => {
        if (window.innerWidth <= 992) {
            // Check if toggle button already exists
            let toggleBtn = dropdown.querySelector('.dropdown-toggle');
            
            if (!toggleBtn) {
                toggleBtn = document.createElement('span');
                toggleBtn.className = 'dropdown-toggle';
                toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
                dropdown.appendChild(toggleBtn);
                
                // Handle toggle click
                toggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const content = dropdown.querySelector('.dropdown-content');
                    const isOpen = content.style.display === 'block';
                    
                    // Close all other dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            const c = d.querySelector('.dropdown-content');
                            const t = d.querySelector('.dropdown-toggle i');
                            if (c) c.style.display = 'none';
                            if (t) t.className = 'fas fa-chevron-down';
                        }
                    });
                    
                    // Toggle current dropdown
                    content.style.display = isOpen ? 'none' : 'block';
                    toggleBtn.querySelector('i').className = isOpen ? 
                        'fas fa-chevron-down' : 'fas fa-chevron-up';
                });
            }
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            const isDropdownClick = e.target.closest('.dropdown');
            if (!isDropdownClick) {
                dropdowns.forEach(dropdown => {
                    const content = dropdown.querySelector('.dropdown-content');
                    const toggle = dropdown.querySelector('.dropdown-toggle i');
                    if (content) content.style.display = 'none';
                    if (toggle) toggle.className = 'fas fa-chevron-down';
                });
            }
        }
    });
    
    // Prevent dropdown links from navigating on mobile
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const dropdown = link.parentElement;
                const content = dropdown.querySelector('.dropdown-content');
                const toggle = dropdown.querySelector('.dropdown-toggle i');
                
                // Close all other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        const c = d.querySelector('.dropdown-content');
                        const t = d.querySelector('.dropdown-toggle i');
                        if (c) c.style.display = 'none';
                        if (t) t.className = 'fas fa-chevron-down';
                    }
                });
                
                // Toggle current dropdown
                const isOpen = content.style.display === 'block';
                content.style.display = isOpen ? 'none' : 'block';
                if (toggle) toggle.className = isOpen ? 
                    'fas fa-chevron-down' : 'fas fa-chevron-up';
            }
        });
    });
    
    // Enhanced smooth scrolling with proper offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip dropdown parent links
            if (window.innerWidth <= 992 && this.parentElement.classList.contains('dropdown')) {
                return;
            }
            
            if (targetId === '#' || targetId === '#markets') {
                return;
            }
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    overlay.classList.remove('active');
                    body.style.overflow = '';
                }
                
                // Calculate proper offset based on header height
                const headerHeight = document.querySelector('header').offsetHeight;
                const offsetTop = targetElement.offsetTop - headerHeight - 10;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle window resize events
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            // Reset for larger screens
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
            
            // Show dropdown content normally
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.style.display = '';
            });
        } else {
            // Setup for mobile screens
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                if (!dropdown.querySelector('.dropdown-toggle')) {
                    const toggleBtn = document.createElement('span');
                    toggleBtn.className = 'dropdown-toggle';
                    toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
                    dropdown.appendChild(toggleBtn);
                    
                    toggleBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const content = dropdown.querySelector('.dropdown-content');
                        const isOpen = content.style.display === 'block';
                        content.style.display = isOpen ? 'none' : 'block';
                        toggleBtn.querySelector('i').className = isOpen ? 
                            'fas fa-chevron-down' : 'fas fa-chevron-up';
                    });
                }
            });
        }
    });
    
    // Sticky header handling
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
    
    // Initialize sticky header state
    if (window.scrollY > 50) {
        header.classList.add('sticky');
    }
    
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
