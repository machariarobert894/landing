// Enhanced Over/Under Analysis System
class OverUnderAnalyzer {
    constructor() {
        this.tickData = [];
        this.maxTicks = 1000;
        this.barriers = new Map(); // Store different barriers for different strategies
    }

    addTick(price) {
        const lastDigit = this.extractLastDigit(price);
        this.tickData.push({
            price: price,
            lastDigit: lastDigit,
            timestamp: Date.now()
        });

        // Keep only the most recent ticks
        if (this.tickData.length > this.maxTicks) {
            this.tickData = this.tickData.slice(-this.maxTicks);
        }
    }

    extractLastDigit(price) {
        const priceStr = price.toString();
        const lastChar = priceStr.charAt(priceStr.length - 1);
        return parseInt(lastChar, 10);
    }

    analyzeOverUnder(barrier = 5, tickCount = 120) {
        if (this.tickData.length < Math.min(tickCount, 20)) {
            return this.getDefaultAnalysis(barrier);
        }

        const recentTicks = this.tickData.slice(-tickCount);
        const lastDigits = recentTicks.map(tick => tick.lastDigit);

        // Calculate frequencies and probabilities
        const digitCounts = new Array(10).fill(0);
        lastDigits.forEach(digit => digitCounts[digit]++);

        const digitPercentages = digitCounts.map(count => 
            ((count / lastDigits.length) * 100).toFixed(2)
        );

        // Calculate over/under/equals statistics
        let overCount = 0;
        let underCount = 0;
        let equalsCount = 0;

        lastDigits.forEach(digit => {
            if (digit > barrier) overCount++;
            else if (digit < barrier) underCount++;
            else equalsCount++;
        });

        const total = lastDigits.length;
        const overProbability = ((overCount / total) * 100).toFixed(2);
        const underProbability = ((underCount / total) * 100).toFixed(2);
        const equalsProbability = ((equalsCount / total) * 100).toFixed(2);

        // Analyze recent patterns and streaks
        const patternAnalysis = this.analyzePatterns(lastDigits, barrier);
        const streakAnalysis = this.analyzeStreaks(lastDigits, barrier);

        // Generate recommendation based on patterns and probabilities
        const recommendation = this.generateOverUnderRecommendation(
            overProbability, underProbability, equalsProbability, patternAnalysis, streakAnalysis
        );

        return {
            barrier: barrier,
            overProbability: overProbability,
            underProbability: underProbability,
            equalsProbability: equalsProbability,
            overCount: overCount,
            underCount: underCount,
            equalsCount: equalsCount,
            digitPercentages: digitPercentages,
            actualDigits: lastDigits.slice(-10), // Last 10 digits for display
            recommendation: recommendation.action,
            confidence: recommendation.confidence,
            streak: streakAnalysis.currentStreak,
            streakType: streakAnalysis.currentType,
            patternStrength: patternAnalysis.strength,
            trendDirection: this.analyzeTrend(lastDigits, barrier),
            volatility: this.calculateVolatility(lastDigits),
            hotDigits: this.findHotDigits(digitCounts, barrier),
            coldDigits: this.findColdDigits(digitCounts, barrier)
        };
    }

    analyzePatterns(digits, barrier) {
        if (digits.length < 5) return { strength: 0, type: 'insufficient_data' };

        const recent = digits.slice(-10);
        let patterns = {
            alternating: 0,
            clustering: 0,
            trending: 0
        };

        // Check for alternating patterns (over/under/over/under)
        for (let i = 1; i < recent.length; i++) {
            const current = recent[i] > barrier ? 'over' : recent[i] < barrier ? 'under' : 'equals';
            const previous = recent[i-1] > barrier ? 'over' : recent[i-1] < barrier ? 'under' : 'equals';
            
            if (current !== previous && current !== 'equals' && previous !== 'equals') {
                patterns.alternating++;
            }
        }

        // Check for clustering (same type appearing together)
        let currentCluster = 1;
        for (let i = 1; i < recent.length; i++) {
            const current = recent[i] > barrier ? 'over' : recent[i] < barrier ? 'under' : 'equals';
            const previous = recent[i-1] > barrier ? 'over' : recent[i-1] < barrier ? 'under' : 'equals';
            
            if (current === previous && current !== 'equals') {
                currentCluster++;
            } else {
                if (currentCluster >= 3) patterns.clustering++;
                currentCluster = 1;
            }
        }

        // Determine strongest pattern
        const maxPattern = Math.max(patterns.alternating, patterns.clustering, patterns.trending);
        const strength = Math.min(maxPattern / recent.length * 100, 100);

        return {
            strength: strength,
            type: maxPattern === patterns.alternating ? 'alternating' : 
                  maxPattern === patterns.clustering ? 'clustering' : 'trending',
            details: patterns
        };
    }

    analyzeStreaks(digits, barrier) {
        if (digits.length === 0) return { currentStreak: 0, currentType: null, maxStreak: 0 };

        let currentStreak = 1;
        let maxStreak = 1;
        let currentType = digits[digits.length - 1] > barrier ? 'over' : 
                         digits[digits.length - 1] < barrier ? 'under' : 'equals';

        // Count current streak from the end
        for (let i = digits.length - 2; i >= 0; i--) {
            const digitType = digits[i] > barrier ? 'over' : 
                             digits[i] < barrier ? 'under' : 'equals';
            
            if (digitType === currentType) {
                currentStreak++;
            } else {
                break;
            }
        }

        // Find maximum streak in the data
        let tempStreak = 1;
        let tempType = digits[0] > barrier ? 'over' : digits[0] < barrier ? 'under' : 'equals';

        for (let i = 1; i < digits.length; i++) {
            const digitType = digits[i] > barrier ? 'over' : 
                             digits[i] < barrier ? 'under' : 'equals';
            
            if (digitType === tempType) {
                tempStreak++;
                maxStreak = Math.max(maxStreak, tempStreak);
            } else {
                tempStreak = 1;
                tempType = digitType;
            }
        }

        return {
            currentStreak: currentStreak,
            currentType: currentType,
            maxStreak: maxStreak
        };
    }

    generateOverUnderRecommendation(overProb, underProb, equalsProb, patterns, streaks) {
        const over = parseFloat(overProb);
        const under = parseFloat(underProb);
        const equals = parseFloat(equalsProb);

        let confidence = 50;
        let action = 'Over'; // Default

        // Base recommendation on probabilities
        if (over > under && over > equals) {
            action = 'Over';
            confidence = Math.min(50 + (over - Math.max(under, equals)) * 2, 95);
        } else if (under > over && under > equals) {
            action = 'Under';
            confidence = Math.min(50 + (under - Math.max(over, equals)) * 2, 95);
        } else if (equals > over && equals > under) {
            action = 'Equals';
            confidence = Math.min(50 + (equals - Math.max(over, under)) * 2, 95);
        }

        // Adjust based on streak analysis
        if (streaks.currentStreak >= 3) {
            // If there's a strong streak, consider betting against it (regression to mean)
            if (streaks.currentType === 'over' && streaks.currentStreak >= 4) {
                action = 'Under';
                confidence = Math.min(confidence + 10, 95);
            } else if (streaks.currentType === 'under' && streaks.currentStreak >= 4) {
                action = 'Over';
                confidence = Math.min(confidence + 10, 95);
            }
        }

        // Adjust based on pattern strength
        if (patterns.strength > 60) {
            if (patterns.type === 'alternating') {
                // In alternating pattern, bet opposite of last
                confidence = Math.min(confidence + 5, 95);
            } else if (patterns.type === 'clustering') {
                // In clustering pattern, bet same as current trend
                confidence = Math.min(confidence + 8, 95);
            }
        }

        return {
            action: action,
            confidence: Math.round(confidence)
        };
    }

    analyzeTrend(digits, barrier) {
        if (digits.length < 10) return 'neutral';

        const recent = digits.slice(-10);
        const firstHalf = recent.slice(0, 5);
        const secondHalf = recent.slice(5);

        const firstHalfOver = firstHalf.filter(d => d > barrier).length;
        const secondHalfOver = secondHalf.filter(d => d > barrier).length;

        if (secondHalfOver > firstHalfOver + 1) return 'increasing_over';
        if (firstHalfOver > secondHalfOver + 1) return 'decreasing_over';
        return 'neutral';
    }

    calculateVolatility(digits) {
        if (digits.length < 5) return 'low';

        const changes = [];
        for (let i = 1; i < digits.length; i++) {
            changes.push(Math.abs(digits[i] - digits[i-1]));
        }

        const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
        
        if (avgChange > 4) return 'high';
        if (avgChange > 2) return 'medium';
        return 'low';
    }

    findHotDigits(digitCounts, barrier) {
        const avgCount = digitCounts.reduce((sum, count) => sum + count, 0) / 10;
        return digitCounts
            .map((count, digit) => ({ digit, count, isHot: count > avgCount * 1.2 }))
            .filter(item => item.isHot && item.digit !== barrier)
            .map(item => item.digit);
    }

    findColdDigits(digitCounts, barrier) {
        const avgCount = digitCounts.reduce((sum, count) => sum + count, 0) / 10;
        return digitCounts
            .map((count, digit) => ({ digit, count, isCold: count < avgCount * 0.8 }))
            .filter(item => item.isCold && item.digit !== barrier)
            .map(item => item.digit);
    }

    getDefaultAnalysis(barrier = 5) {
        return {
            barrier: barrier,
            overProbability: "33.33",
            underProbability: "33.33", 
            equalsProbability: "33.33",
            overCount: 0,
            underCount: 0,
            equalsCount: 0,
            digitPercentages: new Array(10).fill("10.00"),
            actualDigits: [],
            recommendation: 'Over',
            confidence: 50,
            streak: 0,
            streakType: null,
            patternStrength: 0,
            trendDirection: 'neutral',
            volatility: 'low',
            hotDigits: [],
            coldDigits: []
        };
    }

    // Pattern-specific analysis for over-under-2 strategy
    analyzeDigitPattern(barrier, digitCount, patternType) {
        if (this.tickData.length < digitCount) {
            return { patternMatch: false, confidence: 0, actualPattern: [] };
        }

        const recentDigits = this.tickData.slice(-digitCount).map(tick => tick.lastDigit);
        
        const patternMatch = recentDigits.every(digit => {
            switch (patternType) {
                case 'over': return digit > barrier;
                case 'under': return digit < barrier;
                case 'equals': return digit === barrier;
                default: return false;
            }
        });

        // Calculate confidence based on how rare this pattern is
        let confidence = 50;
        if (patternMatch) {
            // The longer the pattern, the higher the confidence for reversal
            confidence = Math.min(50 + (digitCount * 10), 90);
        }

        return {
            patternMatch: patternMatch,
            confidence: confidence,
            actualPattern: recentDigits,
            patternType: patternType,
            barrier: barrier
        };
    }
}

// Initialize the over/under analyzer
window.overUnderAnalyzer = new OverUnderAnalyzer();

// Enhanced message handling for over/under analysis
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'TICK_UPDATE' && window.overUnderAnalyzer) {
        window.overUnderAnalyzer.addTick(event.data.price);
    }
});

console.log('Over/Under Analysis System initialized');
