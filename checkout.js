document.addEventListener('DOMContentLoaded', function() {
    // Bot products database
    const products = {
        'precision-hunter': {
            name: 'Precision Hunter',
            price: 250,
            description: 'Tactical bot that hunts down optimal entry points and captures market trends with precision',
            icon: 'fa-robot',
            binanceLink: 'https://s.binance.com/LDIzxZqD', // Updated link
            features: [
                'Advanced trend detection',
                'Automated stop losses',
                'Optimized for Deriv platform',
                'Lifetime updates included'
            ],
            reviews: [
                { rating: 5, text: "Made $12k in my first month using this bot. The trend detection is spot on!", author: "Mike T." },
                { rating: 4, text: "Very reliable for capturing short-term market movements. Worth every penny.", author: "Sarah J." },
                { rating: 5, text: "Simply amazing precision on entries. My win rate jumped from 62% to 81%.", author: "Alex M." }
            ]
        },
        'alpha-gorilla': {
            name: 'Alpha Gorilla AI',
            price: 800,
            description: 'Aggressive AI-powered beast that dominates the market, crushing competition and extracting maximum profits',
            icon: 'fa-brain',
            binanceLink: 'https://s.binance.com/8TMuHn0m', // Updated link
            features: [
                'Advanced AI algorithms',
                'Pattern recognition',
                'Sentiment analysis',
                'Proprietary Deriv strategies',
                'Custom strategy builder'
            ],
            reviews: [
                { rating: 5, text: "The AI pattern recognition is unlike anything I've ever seen. Generated $43k last month.", author: "David L." },
                { rating: 5, text: "This is the Rolls Royce of trading bots. The sentiment analysis gives an incredible edge.", author: "Jennifer W." },
                { rating: 4, text: "Premium price but premium performance. Averaging 34% monthly returns.", author: "Robert K." }
            ]
        },
        'market-scout': {
            name: 'Market Scout',
            price: 100,
            description: 'Entry-level Deriv bot with reliable strategies for beginners entering the market',
            icon: 'fa-seedling',
            binanceLink: 'https://s.binance.com/05Q0NFL0', // Updated link
            features: [
                'Simple setup for Deriv',
                'Educational resources',
                'Lower risk strategies',
                'Email notifications'
            ],
            reviews: [
                { rating: 5, text: "Perfect for beginners like me. Easy to set up and already making consistent profits.", author: "Emma L." },
                { rating: 4, text: "Great entry point into automated trading. The educational resources are invaluable.", author: "Tom B." },
                { rating: 4, text: "Reliable and straightforward. Making about $1,200/month with minimal risk.", author: "Susan R." }
            ]
        },
        'momentum-crusher': {
            name: 'Momentum Crusher',
            price: 300,
            description: 'Powerful Deriv bot that crushes the competition by capitalizing on momentum in market swings',
            icon: 'fa-chart-line',
            binanceLink: 'https://s.binance.com/xhN7qcvD', // Updated link
            features: [
                'Multi-timeframe analysis',
                'Technical indicator suite',
                'Risk management tools',
                'Deriv-optimized algorithms'
            ],
            reviews: [
                { rating: 5, text: "Incredible at catching momentum shifts. I've never seen entries this precise.", author: "Mark D." },
                { rating: 4, text: "The multi-timeframe analysis gives a complete market picture. Very profitable.", author: "Katherine P." },
                { rating: 5, text: "Made back the investment in just 3 days. Averaging $9,500/month now.", author: "James T." }
            ]
        },
        'volatility-dominator': {
            name: 'Volatility Dominator',
            price: 500,
            description: 'High-frequency Deriv trading bot that dominates volatile markets for maximum profit extraction',
            icon: 'fa-bolt',
            binanceLink: 'https://s.binance.com/qAbue8aO', // Updated link
            features: [
                'Ultra-fast execution',
                'Micro-profit optimization',
                'Deriv API integration',
                'Multi-pair trading'
            ],
            reviews: [
                { rating: 5, text: "This bot thrives in volatile conditions when others fail. Exceptional execution speed.", author: "Peter C." },
                { rating: 5, text: "Turned $10k into $37k in one month during extreme market volatility.", author: "Olivia S." },
                { rating: 4, text: "The multi-pair trading capability gives incredible diversification. Very impressed.", author: "Nathan H." }
            ]
        }
    };

    // Default product if none is selected
    const defaultProduct = 'precision-hunter';

    // Get elements
    const productName = document.getElementById('product-name');
    const productDescription = document.getElementById('product-description');
    const productFeatures = document.getElementById('product-features');
    const productImage = document.getElementById('product-image');
    const basePrice = document.getElementById('base-price');
    const totalPrice = document.getElementById('total-price');
    const payButton = document.getElementById('pay-button');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentModal = document.getElementById('payment-modal');
    const closeModal = document.querySelector('.close-modal');
    const continueBtn = document.getElementById('continue-btn');
    const retryBtn = document.getElementById('retry-btn');
    const reviewsContainer = document.getElementById('reviews-container');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    // Check if returning from payment
    const paymentStatus = urlParams.get('status');
    if (paymentStatus === 'success') {
        showPaymentSuccess();
        paymentModal.classList.add('show');
    } else if (paymentStatus === 'cancel') {
        showPaymentError();
        paymentModal.classList.add('show');
    }    // Select product based on URL parameter or default
    let selectedProduct = products[productId] || products[defaultProduct];
    
    // Ensure we always have a valid product with a price
    if (!selectedProduct || typeof selectedProduct.price !== 'number') {
        console.warn('Invalid product or price, falling back to default product');
        selectedProduct = products[defaultProduct];
        
        // If even the default product is invalid, create a backup product
        if (!selectedProduct || typeof selectedProduct.price !== 'number') {
            selectedProduct = {
                name: 'Precision Hunter',
                price: 250,
                description: 'Tactical bot that hunts down optimal entry points',
                icon: 'fa-robot',
                binanceLink: 'https://s.binance.com/LDIzxZqD',
                features: ['Advanced trend detection', 'Automated stop losses']
            };
        }
    }

    // Update product information in the UI
    function updateProductUI(product) {
        if (!product) return;
        
        // Update product details
        productName.textContent = product.name;
        productDescription.textContent = product.description;
        productImage.innerHTML = `<i class="fas ${product.icon} product-icon-${productId || defaultProduct}"></i>`;
        basePrice.textContent = `$${product.price.toFixed(2)}`;
        totalPrice.textContent = `$${product.price.toFixed(2)}`;

        // Update product features
        productFeatures.innerHTML = '';
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
            productFeatures.appendChild(li);
        });

        // Update payment button
        payButton.innerHTML = `<i class="fas fa-wallet"></i> Pay $${product.price.toFixed(2)} with Binance Pay`;

        // Update product reviews
        updateReviews(product.reviews);
    }

    // Update reviews section
    function updateReviews(reviews) {
        reviewsContainer.innerHTML = '';
        
        // Set review count and average rating
        document.getElementById('review-count').textContent = reviews.length;
        
        // Calculate average rating
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);
        document.getElementById('average-rating').textContent = averageRating;
        
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-item';
            
            // Create stars based on rating
            let stars = '';
            for (let i = 0; i < 5; i++) {
                if (i < review.rating) {
                    stars += '<i class="fas fa-star"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            
            reviewElement.innerHTML = `
                <div class="review-stars">${stars}</div>
                <p class="review-text">"${review.text}"</p>
                <div class="review-author">- ${review.author}</div>
            `;
            
            reviewsContainer.appendChild(reviewElement);
        });
    }

    // Initialize with the selected product
    updateProductUI(selectedProduct);    // Payment option selection
    let selectedPaymentMethod = 'binance'; // Default payment method
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const paymentMethod = this.dataset.payment;
            
            // Skip disabled payment methods
            if (this.classList.contains('disabled')) {
                return;
            }
            
            // Update active payment method
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedPaymentMethod = paymentMethod;
              // Update payment button text
            if (paymentMethod === 'binance') {
                payButton.innerHTML = `<i class="fas fa-wallet"></i> Pay $${selectedProduct.price.toFixed(2)} with Binance Pay`;
                document.querySelector('.secure-payment').innerHTML = `<i class="fas fa-shield-alt"></i> Secure payment provided by Binance`;            } else if (paymentMethod === 'mpesa') {
                const kesRate = 128; 
                const productPrice = selectedProduct.price || 250; // Default to 250 if price is undefined
                const kesAmount = (productPrice * kesRate).toFixed(2);
                const formattedKesAmount = kesAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                
                payButton.innerHTML = `<i class="fas fa-mobile-alt"></i> Pay Kes ${formattedKesAmount} with M-Pesa`;
                document.querySelector('.secure-payment').innerHTML = `<i class="fas fa-shield-alt"></i> Secure mobile money payment via M-Pesa (1 USD = 128 Kes)`;
            }
        });
    });    // Pay button click handler
    payButton.addEventListener('click', function() {
        // Form validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const termsCheckbox = document.getElementById('terms');
        
        if (!nameInput.value.trim()) {
            alert('Please enter your name');
            nameInput.focus();
            return;
        }
        
        if (!emailInput.value.trim()) {
            alert('Please enter your email');
            emailInput.focus();
            return;
        }
        
        if (!termsCheckbox.checked) {
            alert('Please agree to the Terms & Conditions');
            return;
        }
        
        // Show payment modal
        paymentModal.classList.add('show');
        
        // Generate a unique order ID (timestamp + random numbers)
        const orderId = new Date().getTime().toString().slice(-6) + Math.floor(Math.random() * 1000);
        
        // Process payment based on selected method
        if (selectedPaymentMethod === 'binance') {
            // Get binance pay link for the selected product
            const paymentLink = selectedProduct.binanceLink;
              // Update modal content to say we're connecting to Binance
            document.getElementById('payment-processing').querySelector('p').innerHTML = '<i class="fab fa-bitcoin" style="color: #f0b90b; margin-right: 8px;"></i> Connecting to Binance Pay...';
            
            // Simulate payment processing
            setTimeout(() => {
                document.getElementById('payment-processing').style.display = 'none';
                document.getElementById('payment-qr').style.display = 'flex';
                document.getElementById('payment-mpesa').style.display = 'none';
                
                // Update the QR code with the specific Binance Pay link
                document.getElementById('qr-code').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentLink)}`;
                
                // Add direct payment link option
                const paymentLinks = document.getElementById('payment-links');
                if (!paymentLinks) {
                    const qrSection = document.getElementById('payment-qr');
                    const newPaymentLinks = document.createElement('div');
                    newPaymentLinks.id = 'payment-links';
                    qrSection.appendChild(newPaymentLinks);
                }
                document.getElementById('payment-links').innerHTML = `
                    <p class="payment-note">Scan the QR code with your Binance app or click the button below</p>
                    <a href="${paymentLink}" target="_blank" class="btn-secondary btn-sm">
                        <i class="fas fa-external-link-alt"></i> Open Binance Pay
                    </a>
                    <p class="payment-amount">Amount: ${selectedProduct.price} USDT</p>`;
                
                // Start countdown
                startCountdown('countdown');
            }, 2000);
        } else if (selectedPaymentMethod === 'mpesa') {            // Update modal content to say we're preparing M-Pesa payment
            document.getElementById('payment-processing').querySelector('p').innerHTML = '<i class="fas fa-mobile-alt" style="color: #1a73e8; margin-right: 8px;"></i> Preparing M-Pesa payment instructions...';
            
            // Simulate payment processing
            setTimeout(() => {                document.getElementById('payment-processing').style.display = 'none';
                document.getElementById('payment-qr').style.display = 'none';
                document.getElementById('payment-mpesa').style.display = 'block';
                
                // Force UI update to ensure amounts are shown
                updateMpesaAmounts();
                  
                // Update M-Pesa payment details
                const productCode = productId || defaultProduct;
                document.getElementById('mpesa-id').textContent = orderId;
                document.getElementById('mpesa-account-display').textContent = `BOT-${orderId}`;
                
                // Convert USD to Kenyan Shillings (KES) at rate of 1:128
                const kesRate = 128;
                const productPrice = selectedProduct.price || 250; // Default to 250 if price is undefined
                const kesAmount = (productPrice * kesRate).toFixed(2);
                
                // Format the amounts with thousand separators
                const formattedKesAmount = kesAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  // Check if elements exist before updating them
                console.log('Updating M-Pesa amounts:', {
                    productPrice,
                    kesAmount,
                    formattedKesAmount
                });
                
                // Get references to all elements that need updating
                const mpesaAmount = document.getElementById('mpesa-amount');
                const mpesaAmountDisplay = document.getElementById('mpesa-amount-display');
                const mpesaKesAmount = document.getElementById('mpesa-kes-amount');
                
                // Check if elements exist and update with error handling
                if (mpesaAmount) {
                    mpesaAmount.textContent = `Kes ${formattedKesAmount}`;
                    console.log('Updated mpesa-amount:', mpesaAmount.textContent);
                } else {
                    console.error('Error: mpesa-amount element not found!');
                }
                
                if (mpesaAmountDisplay) {
                    mpesaAmountDisplay.textContent = `Kes ${formattedKesAmount}`;
                    console.log('Updated mpesa-amount-display:', mpesaAmountDisplay.textContent);
                } else {
                    console.error('Error: mpesa-amount-display element not found!');
                }
                
                if (mpesaKesAmount) {
                    mpesaKesAmount.textContent = `(USD $${productPrice.toFixed(2)})`;
                    console.log('Updated mpesa-kes-amount:', mpesaKesAmount.textContent);
                } else {
                    console.error('Error: mpesa-kes-amount element not found!');
                }
                
                // Add a direct update to the elements by trying an alternative approach
                try {
                    document.querySelector('#mpesa-amount').innerHTML = `Kes ${formattedKesAmount}`;
                    document.querySelector('#mpesa-amount-display').innerHTML = `Kes ${formattedKesAmount}`;
                } catch (e) {
                    console.error('Error using querySelector:', e);
                }
                // Start countdown for M-Pesa
                startCountdown('mpesa-countdown');
                
                // Add event listener for M-Pesa confirmation button
                document.getElementById('mpesa-confirm-btn').addEventListener('click', function() {
                    showPaymentSuccess();
                });
            }, 2000);
        }
    });

    // Close modal button
    closeModal.addEventListener('click', function() {
        paymentModal.classList.remove('show');
        resetPaymentState();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            paymentModal.classList.remove('show');
            resetPaymentState();
        }
    });
    
    // Continue button after successful payment
    continueBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
      // Retry button after failed payment
    retryBtn.addEventListener('click', function() {
        resetPaymentState();
        document.getElementById('payment-processing').style.display = 'flex';
        
        // Update retry process according to selected payment method
        setTimeout(() => {
            document.getElementById('payment-processing').style.display = 'none';
            
            if (selectedPaymentMethod === 'binance') {
                document.getElementById('payment-qr').style.display = 'flex';
                document.getElementById('payment-mpesa').style.display = 'none';
                
                // Update the QR code with the selected product's payment link
                const paymentLink = selectedProduct.binanceLink;
                document.getElementById('qr-code').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentLink)}`;
                
                // Update the payment links
                const paymentLinks = document.getElementById('payment-links');
                if (!paymentLinks) {
                    const qrSection = document.getElementById('payment-qr');
                    const newPaymentLinks = document.createElement('div');
                    newPaymentLinks.id = 'payment-links';
                    qrSection.appendChild(newPaymentLinks);
                }
                document.getElementById('payment-links').innerHTML = `
                    <p class="payment-note">Scan the QR code with your Binance app or click the button below</p>
                    <a href="${paymentLink}" target="_blank" class="btn-secondary btn-sm">
                        <i class="fas fa-external-link-alt"></i> Open Binance Pay
                    </a>
                    <p class="payment-amount">Amount: ${selectedProduct.price} USDT</p>`;
                
                startCountdown('countdown');
            } else if (selectedPaymentMethod === 'mpesa') {
                document.getElementById('payment-qr').style.display = 'none';
                document.getElementById('payment-mpesa').style.display = 'block';
                
                // Generate a new order ID
                const orderId = new Date().getTime().toString().slice(-6) + Math.floor(Math.random() * 1000);
                
                // Update M-Pesa payment details
                document.getElementById('mpesa-id').textContent = orderId;
                document.getElementById('mpesa-account-display').textContent = `BOT-${orderId}`;
                
                // Force update M-Pesa amounts
                updateMpesaAmounts();
                
                // Start countdown for M-Pesa
                startCountdown('mpesa-countdown');
            }
        }, 1500);
    });
      // Countdown timer for payment window
    function startCountdown(elementId) {
        let timeLeft = 600; // 10 minutes
        
        function updateCountdown() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById(elementId).textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                showPaymentError();
            }
            
            timeLeft--;
        }
        
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
        
        // Store the interval ID for cleanup
        if (!window.countdownIntervals) {
            window.countdownIntervals = {};
        }
        window.countdownIntervals[elementId] = countdownInterval;
    }
      // Show payment success UI
    function showPaymentSuccess() {
        // Clear all countdown intervals
        if (window.countdownIntervals) {
            Object.values(window.countdownIntervals).forEach(interval => {
                clearInterval(interval);
            });
        }
        if (window.countdownInterval) clearInterval(window.countdownInterval);
        
        document.getElementById('payment-processing').style.display = 'none';
        document.getElementById('payment-qr').style.display = 'none';
        document.getElementById('payment-mpesa').style.display = 'none';
        document.getElementById('payment-error').style.display = 'none';
        document.getElementById('payment-success').style.display = 'flex';
    }
    
    // Show payment error UI
    function showPaymentError() {
        // Clear all countdown intervals
        if (window.countdownIntervals) {
            Object.values(window.countdownIntervals).forEach(interval => {
                clearInterval(interval);
            });
        }
        if (window.countdownInterval) clearInterval(window.countdownInterval);
        
        document.getElementById('payment-processing').style.display = 'none';
        document.getElementById('payment-qr').style.display = 'none';
        document.getElementById('payment-mpesa').style.display = 'none';
        document.getElementById('payment-success').style.display = 'none';
        document.getElementById('payment-error').style.display = 'flex';
    }
    
    // Reset payment state
    function resetPaymentState() {
        // Clear all countdown intervals
        if (window.countdownIntervals) {
            Object.values(window.countdownIntervals).forEach(interval => {
                clearInterval(interval);
            });
            window.countdownIntervals = {};
        }
        if (window.countdownInterval) clearInterval(window.countdownInterval);
          document.getElementById('payment-processing').style.display = 'flex';
        document.getElementById('payment-qr').style.display = 'none';
        document.getElementById('payment-mpesa').style.display = 'none';
        document.getElementById('payment-success').style.display = 'none';
        document.getElementById('payment-error').style.display = 'none';
    }
    
    // Add a function to update M-Pesa amounts in the UI directly
    function updateMpesaAmounts() {
        // Wait a bit for the DOM to fully render
        setTimeout(() => {
            try {
                const productPrice = selectedProduct.price || 250;
                const kesRate = 128;
                const kesAmount = (productPrice * kesRate).toFixed(2);
                const formattedKesAmount = kesAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                
                console.log('Force-updating M-Pesa amounts with:', {
                    productPrice,
                    kesAmount,
                    formattedKesAmount
                });
                
                // Direct DOM manipulation
                const elements = [
                    document.getElementById('mpesa-amount'),
                    document.getElementById('mpesa-amount-display')
                ];
                
                elements.forEach(el => {
                    if (el) {
                        console.log(`Element ${el.id} before update: ${el.textContent}`);
                        el.textContent = `Kes ${formattedKesAmount}`;
                        el.innerHTML = `Kes ${formattedKesAmount}`;
                        console.log(`Element ${el.id} after update: ${el.textContent}`);
                    }
                });
                
                const kesAmountEl = document.getElementById('mpesa-kes-amount');
                if (kesAmountEl) {
                    kesAmountEl.textContent = `(USD $${productPrice.toFixed(2)})`;
                }
            } catch (err) {
                console.error('Error in updateMpesaAmounts:', err);
            }
        }, 500);
    }
    
    // Initialize dynamic M-Pesa amount elements that have default values in HTML
    function initDynamicMpesaElements() {
        const dynamicElements = document.querySelectorAll('.mpesa-dynamic-amount');
        
        dynamicElements.forEach(el => {
            const kesRate = parseFloat(el.dataset.kesRate || 128);
            const basePrice = parseFloat(el.dataset.basePrice || 250);
            const kesAmount = (basePrice * kesRate).toFixed(2);
            const formattedKesAmount = kesAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            // Set initial values
            if (el.id === 'mpesa-amount' || el.id === 'mpesa-amount-display') {
                el.textContent = `Kes ${formattedKesAmount}`;
            }
        });
        
        // Also set the USD equivalent
        const kesAmountEl = document.getElementById('mpesa-kes-amount');
        if (kesAmountEl) {
            const basePrice = 250; // Default value
            kesAmountEl.textContent = `(USD $${basePrice.toFixed(2)})`;
        }
    }
    
    // Call this on page load
    initDynamicMpesaElements();
});
