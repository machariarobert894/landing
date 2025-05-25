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
    }

    // Select product based on URL parameter or default
    const selectedProduct = products[productId] || products[defaultProduct];

    // Update product information in the UI
    function updateProductUI(product) {
        if (!product) return;
        
        // Update product details
        productName.textContent = product.name;
        productDescription.textContent = product.description;
        productImage.innerHTML = `<i class="fas ${product.icon}"></i>`;
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
    updateProductUI(selectedProduct);

    // Payment option selection
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Only allow selecting Binance Pay for now
            if (this.dataset.payment === 'binance') {
                paymentOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                payButton.innerHTML = `<i class="fas fa-wallet"></i> Pay $${selectedProduct.price.toFixed(2)} with Binance Pay`;
            }
        });
    });

    // Pay button click handler
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
        
        // Get binance pay link for the selected product
        const paymentLink = selectedProduct.binanceLink;
        
        // Simulate payment processing
        setTimeout(() => {
            document.getElementById('payment-processing').style.display = 'none';
            document.getElementById('payment-qr').style.display = 'flex';
            
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
            startCountdown();
        }, 2000);
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
        setTimeout(() => {
            document.getElementById('payment-processing').style.display = 'none';
            document.getElementById('payment-qr').style.display = 'flex';
            
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
            
            startCountdown();
        }, 1500);
    });
    
    // Countdown timer for payment window
    function startCountdown() {
        let timeLeft = 600; // 10 minutes
        
        function updateCountdown() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('countdown').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                showPaymentError();
            }
            
            timeLeft--;
        }
        
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
        window.countdownInterval = countdownInterval; // Store for cleanup
    }
    
    // Show payment success UI
    function showPaymentSuccess() {
        if (window.countdownInterval) clearInterval(window.countdownInterval);
        document.getElementById('payment-processing').style.display = 'none';
        document.getElementById('payment-qr').style.display = 'none';
        document.getElementById('payment-error').style.display = 'none';
        document.getElementById('payment-success').style.display = 'flex';
    }
    
    // Show payment error UI
    function showPaymentError() {
        if (window.countdownInterval) clearInterval(window.countdownInterval);
        document.getElementById('payment-processing').style.display = 'none';
        document.getElementById('payment-qr').style.display = 'none';
        document.getElementById('payment-success').style.display = 'none';
        document.getElementById('payment-error').style.display = 'flex';
    }
    
    // Reset payment state
    function resetPaymentState() {
        if (window.countdownInterval) clearInterval(window.countdownInterval);
        document.getElementById('payment-processing').style.display = 'flex';
        document.getElementById('payment-qr').style.display = 'none';
        document.getElementById('payment-success').style.display = 'none';
        document.getElementById('payment-error').style.display = 'none';
    }
});
