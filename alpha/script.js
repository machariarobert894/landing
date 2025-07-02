class OverUnderAnalyzer {
    constructor() {
        this.ws = null;
        this.appId = '82836';
        this.defaultServer = 'frontend.binaryws.com'; // Default to live server
        this.isConnected = false;
        this.isAuthenticated = false;
        this.currentSymbol = 'R_10';
        this.barrierValue = 5;
        this.analysisDepth = 100;
        this.refreshRate = 2000;
        
        // Add request tracking for proper API handling
        this.requestId = 1;
        this.pendingRequests = new Map();
        
        // Data storage
        this.priceHistory = [];
        this.digitHistory = [];
        this.currentPrice = 0;
        this.lastDigit = 0;
        
        // Analysis results
        this.overProbability = 50;
        this.underProbability = 50;
        this.currentStreak = 0;
        this.streakType = '';
        this.digitDistribution = new Array(10).fill(0);
        
        // Trading
        this.autoTrading = false;
        this.signalThreshold = 70;
        this.tradeHistory = [];
        this.totalTrades = 0;
        this.winCount = 0;
        this.totalProfitLoss = 0;
        
        // UI elements
        this.initializeElements();
        this.setupEventListeners();
        this.showAuthModal();
    }

    initializeElements() {
        // Auth elements
        this.authModal = document.getElementById('authModal');
        this.authForm = document.getElementById('authForm');
        this.tokenInput = document.getElementById('token');
        this.loginBtn = document.getElementById('loginBtn');

        // App elements
        this.app = document.getElementById('app');
        this.userName = document.getElementById('userName');
        this.logoutBtn = document.getElementById('logoutBtn');

        // Control elements
        this.symbolSelect = document.getElementById('symbolSelect');
        this.barrierInput = document.getElementById('barrierValue');
        this.analysisDepthInput = document.getElementById('analysisDepth');
        this.refreshRateInput = document.getElementById('refreshRate');

        // Display elements
        this.currentPriceEl = document.getElementById('currentPrice');
        this.lastDigitEl = document.getElementById('lastDigit');
        this.priceChangeEl = document.getElementById('priceChange');
        this.overProbBar = document.getElementById('overProbBar');
        this.underProbBar = document.getElementById('underProbBar');
        this.overProbValue = document.getElementById('overProbValue');
        this.underProbValue = document.getElementById('underProbValue');
        this.digitSequence = document.getElementById('digitSequence');
        this.currentStreakEl = document.getElementById('currentStreak');
        this.streakTypeEl = document.getElementById('streakType');
        this.overSignal = document.getElementById('overSignal');
        this.underSignal = document.getElementById('underSignal');
        this.recommendation = document.getElementById('recommendation');

        // Trading elements
        this.stakeInput = document.getElementById('stakeAmount');
        this.durationInput = document.getElementById('duration');
        this.tradingBarrierInput = document.getElementById('tradingBarrier');
        this.buyOverBtn = document.getElementById('buyOverBtn');
        this.buyUnderBtn = document.getElementById('buyUnderBtn');
        this.autoTradingToggle = document.getElementById('autoTradingToggle');
        this.autoThreshold = document.getElementById('autoThreshold');
        this.thresholdValue = document.getElementById('thresholdValue');

        // Statistics elements
        this.digitChart = document.getElementById('digitChart');
        this.tradeHistoryEl = document.getElementById('tradeHistory');
        this.totalTradesEl = document.getElementById('totalTrades');
        this.winRateEl = document.getElementById('winRate');
        this.profitLossEl = document.getElementById('profitLoss');

        // Status elements
        this.statusText = document.getElementById('statusText');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.barrierDisplays = document.querySelectorAll('#barrierDisplay, #barrierDisplay2');
    }

    setupEventListeners() {
        // Auth form
        this.authForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Logout
        this.logoutBtn.addEventListener('click', () => this.logout());

        // Controls
        this.symbolSelect.addEventListener('change', () => this.changeSymbol());
        this.barrierInput.addEventListener('change', () => this.updateBarrier());
        this.analysisDepthInput.addEventListener('change', () => this.updateAnalysisDepth());
        this.refreshRateInput.addEventListener('change', () => this.updateRefreshRate());

        // Trading buttons
        this.buyOverBtn.addEventListener('click', () => this.placeTrade('DIGITOVER'));
        this.buyUnderBtn.addEventListener('click', () => this.placeTrade('DIGITUNDER'));

        // Auto trading
        this.autoTradingToggle.addEventListener('change', () => this.toggleAutoTrading());
        this.autoThreshold.addEventListener('input', () => this.updateThreshold());

        // Barrier displays update
        this.barrierInput.addEventListener('input', () => this.updateBarrierDisplays());
    }

    showAuthModal() {
        this.authModal.style.display = 'flex';
        this.app.classList.add('hidden');
    }

    hideAuthModal() {
        this.authModal.style.display = 'none';
        this.app.classList.remove('hidden');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const token = this.tokenInput.value.trim();

        if (!token) {
            this.showError('Please enter your API token');
            return;
        }

        this.loginBtn.textContent = 'Connecting...';
        this.loginBtn.disabled = true;

        try {
            await this.connect(this.defaultServer, token);
            this.hideAuthModal();
            this.loginBtn.textContent = 'Connect & Analyze';
            this.loginBtn.disabled = false;
        } catch (error) {
            this.showError('Connection failed: ' + error.message);
            this.loginBtn.textContent = 'Connect & Analyze';
            this.loginBtn.disabled = false;
        }
    }

    async connect(server, token) {
        return new Promise((resolve, reject) => {
            // Use proper Deriv WebSocket URL format
            const wsUrl = `wss://${server}/websockets/v3?app_id=${this.appId}`;
            this.ws = new WebSocket(wsUrl);

            // Set connection timeout
            const connectionTimeout = setTimeout(() => {
                if (this.ws.readyState !== WebSocket.OPEN) {
                    this.ws.close();
                    reject(new Error('Connection timeout'));
                }
            }, 10000); // 10 second timeout

            this.ws.onopen = () => {
                clearTimeout(connectionTimeout);
                this.updateConnectionStatus('Connected', true);
                this.isConnected = true;
                
                // Send authorization request with proper format
                this.authenticate(token, resolve, reject);
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data, resolve, reject);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onclose = (event) => {
                clearTimeout(connectionTimeout);
                this.updateConnectionStatus('Disconnected', false);
                this.isConnected = false;
                this.isAuthenticated = false;
                
                // Log close reason for debugging
                console.log('WebSocket closed:', event.code, event.reason);
                
                // Attempt reconnection if not a normal closure
                if (event.code !== 1000 && this.isAuthenticated) {
                    setTimeout(() => {
                        this.reconnect();
                    }, 5000);
                }
            };

            this.ws.onerror = (error) => {
                clearTimeout(connectionTimeout);
                console.error('WebSocket error:', error);
                reject(new Error('WebSocket connection failed'));
            };
        });
    }

    authenticate(token, resolve, reject) {
        const authRequest = {
            authorize: token,
            req_id: this.getNextRequestId()
        };
        
        // Store the resolve/reject callbacks for this request
        this.pendingRequests.set(authRequest.req_id, { resolve, reject, type: 'authorize' });
        
        this.send(authRequest);
    }

    getNextRequestId() {
        return this.requestId++;
    }

    handleMessage(data, resolve, reject) {
        // Handle error responses
        if (data.error) {
            console.error('API Error:', data.error);
            
            // Check if this is a response to a pending request
            if (data.req_id && this.pendingRequests.has(data.req_id)) {
                const pending = this.pendingRequests.get(data.req_id);
                this.pendingRequests.delete(data.req_id);
                
                if (pending.reject) {
                    pending.reject(new Error(data.error.message));
                }
            } else if (reject) {
                reject(new Error(data.error.message));
            }
            
            this.showError(data.error.message);
            return;
        }

        // Handle responses based on message type
        switch (data.msg_type) {
            case 'authorize':
                this.handleAuthorize(data);
                break;
            case 'tick':
                this.handleTick(data);
                break;
            case 'buy':
                this.handleBuyResponse(data);
                break;
            case 'proposal_open_contract':
                this.handleContractUpdate(data);
                break;
            case 'balance':
                this.handleBalance(data);
                break;
            case 'website_status':
                this.handleWebsiteStatus(data);
                break;
            default:
                console.log('Unhandled message type:', data.msg_type, data);
        }
    }

    handleAuthorize(data) {
        if (data.authorize) {
            this.isAuthenticated = true;
            this.userName.textContent = `${data.authorize.fullname} (${data.authorize.loginid})`;
            
            // Check if this is a response to a pending request
            if (data.req_id && this.pendingRequests.has(data.req_id)) {
                const pending = this.pendingRequests.get(data.req_id);
                this.pendingRequests.delete(data.req_id);
                
                if (pending.resolve) {
                    pending.resolve(data);
                }
            }
            
            // Subscribe to balance updates
            this.send({ 
                balance: 1, 
                subscribe: 1,
                req_id: this.getNextRequestId()
            });
            
            // Get website status to ensure service is available
            this.send({
                website_status: 1,
                req_id: this.getNextRequestId()
            });
            
            // Start price feed
            this.subscribeToSymbol();
            
            // Initialize analysis
            this.startAnalysis();
            
            console.log('Authentication successful:', data.authorize);
        }
    }

    handleWebsiteStatus(data) {
        if (data.website_status) {
            console.log('Website status:', data.website_status);
            
            // Check if site is up and trading is available
            if (data.website_status.site_status !== 'up') {
                this.showError('Trading service is currently unavailable');
            }
        }
    }

    handleTick(data) {
        if (data.tick.symbol === this.currentSymbol) {
            const price = parseFloat(data.tick.quote);
            const lastDigit = Math.floor((price * 100) % 10);
            
            this.updatePrice(price, lastDigit);
            this.addToHistory(price, lastDigit);
            this.runAnalysis();
            this.updateUI();
        }
    }

    handleBuyResponse(data) {
        if (data.buy) {
            const contract = data.buy;
            this.addTradeToHistory({
                id: contract.contract_id,
                type: contract.longcode.includes('Over') ? 'OVER' : 'UNDER',
                stake: contract.buy_price,
                time: new Date(),
                status: 'pending'
            });
            
            // Subscribe to contract updates
            this.send({
                proposal_open_contract: 1,
                contract_id: contract.contract_id,
                subscribe: 1
            });
        }
    }

    handleContractUpdate(data) {
        if (data.proposal_open_contract) {
            const contract = data.proposal_open_contract;
            if (contract.is_sold) {
                this.updateTradeResult(contract.contract_id, contract.profit);
            }
        }
    }

    handleBalance(data) {
        // Update balance display if needed
    }

    updatePrice(price, digit) {
        const prevPrice = this.currentPrice;
        this.currentPrice = price;
        this.lastDigit = digit;
        
        // Update UI
        this.currentPriceEl.textContent = price.toFixed(4);
        this.lastDigitEl.textContent = digit;
        this.lastDigitEl.className = `last-digit ${this.getDigitClass(digit)}`;
        
        // Update price change
        if (prevPrice > 0) {
            const change = price - prevPrice;
            const changePercent = ((change / prevPrice) * 100).toFixed(4);
            this.priceChangeEl.textContent = `${change >= 0 ? '+' : ''}${changePercent}%`;
            this.priceChangeEl.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
    }

    getDigitClass(digit) {
        if (digit > this.barrierValue) return 'over';
        if (digit < this.barrierValue) return 'under';
        return 'equal';
    }

    addToHistory(price, digit) {
        this.priceHistory.push(price);
        this.digitHistory.push(digit);
        
        // Keep only recent data
        if (this.priceHistory.length > this.analysisDepth * 2) {
            this.priceHistory = this.priceHistory.slice(-this.analysisDepth);
            this.digitHistory = this.digitHistory.slice(-this.analysisDepth);
        }
    }

    runAnalysis() {
        if (this.digitHistory.length < 10) return;
        
        this.analyzeOverUnderProbability();
        this.analyzeStreak();
        this.analyzeDigitDistribution();
        this.generateSignals();
        this.checkAutoTrading();
    }

    analyzeOverUnderProbability() {
        const recent = this.digitHistory.slice(-this.analysisDepth);
        let overCount = 0;
        let underCount = 0;
        let equalCount = 0;
        
        recent.forEach(digit => {
            if (digit > this.barrierValue) overCount++;
            else if (digit < this.barrierValue) underCount++;
            else equalCount++;
        });
        
        const total = recent.length;
        this.overProbability = Math.round((overCount / total) * 100);
        this.underProbability = Math.round((underCount / total) * 100);
        
        // Apply trend analysis
        const trendWeight = this.analyzeTrend();
        this.overProbability = Math.min(90, Math.max(10, this.overProbability + trendWeight));
        this.underProbability = Math.min(90, Math.max(10, this.underProbability - trendWeight));
    }

    analyzeTrend() {
        if (this.digitHistory.length < 20) return 0;
        
        const recent = this.digitHistory.slice(-10);
        const older = this.digitHistory.slice(-20, -10);
        
        const recentOverRate = recent.filter(d => d > this.barrierValue).length / recent.length;
        const olderOverRate = older.filter(d => d > this.barrierValue).length / older.length;
        
        const trend = (recentOverRate - olderOverRate) * 100;
        return Math.round(trend);
    }

    analyzeStreak() {
        if (this.digitHistory.length < 2) return;
        
        const recent = this.digitHistory.slice(-20);
        let streak = 1;
        let type = '';
        
        const lastDigit = recent[recent.length - 1];
        if (lastDigit > this.barrierValue) type = 'over';
        else if (lastDigit < this.barrierValue) type = 'under';
        else type = 'equal';
        
        for (let i = recent.length - 2; i >= 0; i--) {
            const digit = recent[i];
            let currentType = '';
            
            if (digit > this.barrierValue) currentType = 'over';
            else if (digit < this.barrierValue) currentType = 'under';
            else currentType = 'equal';
            
            if (currentType === type) {
                streak++;
            } else {
                break;
            }
        }
        
        this.currentStreak = streak;
        this.streakType = type;
    }

    analyzeDigitDistribution() {
        this.digitDistribution.fill(0);
        
        if (this.digitHistory.length === 0) return;
        
        this.digitHistory.slice(-this.analysisDepth).forEach(digit => {
            this.digitDistribution[digit]++;
        });
        
        // Convert to percentages
        const total = this.digitHistory.slice(-this.analysisDepth).length;
        this.digitDistribution = this.digitDistribution.map(count => 
            Math.round((count / total) * 100)
        );
    }

    generateSignals() {
        let overStrength = 'WEAK';
        let underStrength = 'WEAK';
        let recommendation = 'WAIT';
        
        // Basic probability signals
        if (this.overProbability >= 70) overStrength = 'STRONG';
        else if (this.overProbability >= 60) overStrength = 'MEDIUM';
        
        if (this.underProbability >= 70) underStrength = 'STRONG';
        else if (this.underProbability >= 60) underStrength = 'MEDIUM';
        
        // Streak analysis
        if (this.currentStreak >= 5) {
            if (this.streakType === 'over') {
                underStrength = 'STRONG';
                recommendation = 'BUY UNDER (Streak Reversal)';
            } else if (this.streakType === 'under') {
                overStrength = 'STRONG';
                recommendation = 'BUY OVER (Streak Reversal)';
            }
        } else if (this.currentStreak >= 3) {
            if (this.streakType === 'over') {
                underStrength = 'MEDIUM';
            } else if (this.streakType === 'under') {
                overStrength = 'MEDIUM';
            }
        }
        
        // Primary recommendation
        if (recommendation === 'WAIT') {
            if (this.overProbability >= 65) {
                recommendation = 'BUY OVER';
            } else if (this.underProbability >= 65) {
                recommendation = 'BUY UNDER';
            } else {
                recommendation = 'WAIT FOR BETTER SIGNAL';
            }
        }
        
        this.updateSignalDisplay(overStrength, underStrength, recommendation);
    }

    updateSignalDisplay(overStrength, underStrength, recommendation) {
        // Update over signal
        this.overSignal.className = `signal ${overStrength.toLowerCase()}`;
        this.overSignal.querySelector('.signal-strength').textContent = overStrength;
        
        // Update under signal
        this.underSignal.className = `signal ${underStrength.toLowerCase()}`;
        this.underSignal.querySelector('.signal-strength').textContent = underStrength;
        
        // Update recommendation
        this.recommendation.textContent = recommendation;
        this.recommendation.className = `recommendation ${this.getRecommendationClass(recommendation)}`;
    }

    getRecommendationClass(recommendation) {
        if (recommendation.includes('BUY OVER')) return 'over';
        if (recommendation.includes('BUY UNDER')) return 'under';
        return 'wait';
    }

    updateUI() {
        // Update probability bars
        this.overProbBar.style.width = `${this.overProbability}%`;
        this.underProbBar.style.width = `${this.underProbability}%`;
        this.overProbValue.textContent = `${this.overProbability}%`;
        this.underProbValue.textContent = `${this.underProbability}%`;
        
        // Update digit sequence
        this.updateDigitSequence();
        
        // Update streak info
        this.currentStreakEl.textContent = this.currentStreak;
        this.streakTypeEl.textContent = this.streakType.toUpperCase();
        
        // Update digit chart
        this.updateDigitChart();
        
        // Update statistics
        this.updateStatistics();
    }

    updateDigitSequence() {
        const recent = this.digitHistory.slice(-20);
        this.digitSequence.innerHTML = '';
        
        recent.forEach(digit => {
            const digitEl = document.createElement('div');
            digitEl.className = `digit-item ${this.getDigitClass(digit)}`;
            digitEl.textContent = digit;
            digitEl.title = `Digit: ${digit} (${this.getDigitClass(digit)})`;
            this.digitSequence.appendChild(digitEl);
        });
    }

    updateDigitChart() {
        this.digitChart.innerHTML = '';
        
        this.digitDistribution.forEach((percentage, digit) => {
            const barContainer = document.createElement('div');
            barContainer.className = 'digit-bar';
            
            const bar = document.createElement('div');
            bar.className = 'digit-bar-fill';
            bar.style.height = `${Math.max(percentage * 2, 5)}px`;
            bar.title = `${percentage}%`;
            
            const label = document.createElement('div');
            label.className = 'digit-bar-label';
            label.textContent = digit;
            
            barContainer.appendChild(bar);
            barContainer.appendChild(label);
            this.digitChart.appendChild(barContainer);
        });
    }

    updateStatistics() {
        this.totalTradesEl.textContent = this.totalTrades;
        const winRate = this.totalTrades > 0 ? Math.round((this.winCount / this.totalTrades) * 100) : 0;
        this.winRateEl.textContent = `${winRate}%`;
        this.profitLossEl.textContent = `$${this.totalProfitLoss.toFixed(2)}`;
        this.profitLossEl.className = `metric ${this.totalProfitLoss >= 0 ? 'positive' : 'negative'}`;
    }

    subscribeToSymbol() {
        this.send({
            ticks: this.currentSymbol,
            subscribe: 1,
            req_id: this.getNextRequestId()
        });
    }

    changeSymbol() {
        // Unsubscribe from current symbol
        this.send({
            forget_all: 'ticks'
        });
        
        this.currentSymbol = this.symbolSelect.value;
        this.clearHistory();
        this.subscribeToSymbol();
    }

    updateBarrier() {
        this.barrierValue = parseInt(this.barrierInput.value);
        this.updateBarrierDisplays();
        this.runAnalysis();
    }

    updateBarrierDisplays() {
        this.barrierDisplays.forEach(el => {
            el.textContent = this.barrierValue;
        });
    }

    updateAnalysisDepth() {
        this.analysisDepth = parseInt(this.analysisDepthInput.value);
    }

    updateRefreshRate() {
        this.refreshRate = parseInt(this.refreshRateInput.value);
    }

    placeTrade(contractType) {
        if (!this.isAuthenticated) {
            this.showError('Please login first');
            return;
        }
        
        const stake = parseFloat(this.stakeInput.value);
        const duration = parseInt(this.durationInput.value);
        const barrier = parseInt(this.tradingBarrierInput.value);
        
        if (stake < 0.35) {
            this.showError('Minimum stake is $0.35');
            return;
        }
        
        // Validate contract parameters before sending
        if (!this.validateTradeParameters(contractType, stake, duration, barrier)) {
            return;
        }
        
        const proposal = {
            buy: 1,
            price: stake,
            parameters: {
                contract_type: contractType,
                symbol: this.currentSymbol,
                amount: stake,
                basis: 'stake',
                duration: duration,
                duration_unit: 't',
                barrier: barrier.toString()
            },
            req_id: this.getNextRequestId()
        };
        
        console.log('Placing trade:', proposal);
        this.send(proposal);
        this.disableTradingButtons(true);
        
        setTimeout(() => {
            this.disableTradingButtons(false);
        }, 3000); // Increased timeout for better UX
    }

    validateTradeParameters(contractType, stake, duration, barrier) {
        // Validate stake
        if (isNaN(stake) || stake < 0.35) {
            this.showError('Invalid stake amount. Minimum is $0.35');
            return false;
        }
        
        // Validate duration
        if (isNaN(duration) || duration < 1 || duration > 10) {
            this.showError('Invalid duration. Must be between 1-10 ticks');
            return false;
        }
        
        // Validate barrier
        if (isNaN(barrier) || barrier < 0 || barrier > 9) {
            this.showError('Invalid barrier. Must be between 0-9');
            return false;
        }
        
        // Validate contract type
        if (!['DIGITOVER', 'DIGITUNDER'].includes(contractType)) {
            this.showError('Invalid contract type');
            return false;
        }
        
        return true;
    }

    // Add reconnection functionality
    reconnect() {
        if (this.ws) {
            this.ws.close();
        }
        
        // Get the last used token from the input (if still available)
        const token = this.tokenInput.value.trim();
        
        if (token) {
            console.log('Attempting to reconnect...');
            this.connect(this.defaultServer, token).catch(error => {
                console.error('Reconnection failed:', error);
                this.showError('Reconnection failed. Please login again.');
                this.showAuthModal();
            });
        } else {
            this.showAuthModal();
        }
    }

    startAnalysis() {
        setInterval(() => {
            if (this.isConnected && this.digitHistory.length > 0) {
                this.runAnalysis();
            }
        }, this.refreshRate);
    }

    clearHistory() {
        this.priceHistory = [];
        this.digitHistory = [];
        this.digitDistribution.fill(0);
        this.currentStreak = 0;
        this.streakType = '';
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            // Add timestamp for debugging
            const message = {
                ...data,
                passthrough: {
                    timestamp: Date.now()
                }
            };
            
            console.log('Sending:', message);
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket not connected. Message not sent:', data);
            this.showError('Connection lost. Please reconnect.');
        }
    }

    updateConnectionStatus(status, connected) {
        this.statusText.textContent = status;
        this.statusIndicator.className = `status-indicator ${connected ? 'connected' : ''}`;
        this.isConnected = connected;
    }

    logout() {
        if (this.ws) {
            this.ws.close();
        }
        
        this.isAuthenticated = false;
        this.isConnected = false;
        this.clearHistory();
        this.tradeHistory = [];
        this.totalTrades = 0;
        this.winCount = 0;
        this.totalProfitLoss = 0;
        
        this.showAuthModal();
        this.tokenInput.value = '';
    }

    showError(message) {
        // Enhanced error display with better UX
        console.error('Application Error:', message);
        
        // Create a more user-friendly error display
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-toast';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-color);
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 1001;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
        
        // Allow manual dismissal
        errorDiv.addEventListener('click', () => {
            errorDiv.remove();
        });
    }

    showSuccess(message) {
        console.log('Success:', message);
        
        // Create success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'success-toast';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 1001;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(successDiv);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OverUnderAnalyzer();
});
    new OverUnderAnalyzer();
});
