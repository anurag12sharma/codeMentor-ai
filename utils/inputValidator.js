class InputValidator {
    
    // Validate Discord command arguments
    static validateCommand(args, requirements) {
        const errors = [];
        
        if (requirements.minArgs && args.length < requirements.minArgs) {
            errors.push(`Command requires at least ${requirements.minArgs} arguments.`);
        }
        
        if (requirements.maxArgs && args.length > requirements.maxArgs) {
            errors.push(`Command accepts at most ${requirements.maxArgs} arguments.`);
        }
        
        if (requirements.patterns) {
            requirements.patterns.forEach((pattern, index) => {
                if (args[index] && !pattern.test(args[index])) {
                    errors.push(`Argument ${index + 1} has invalid format.`);
                }
            });
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Sanitize user input
    static sanitizeInput(input, maxLength = 500) {
        if (typeof input !== 'string') return '';
        
        return input
            .slice(0, maxLength)
            .replace(/[<>]/g, '') // Remove potential HTML/Discord injection
            .trim();
    }

    // Validate contest search query
    static validateSearchQuery(query) {
        if (!query || typeof query !== 'string') {
            return { isValid: false, error: 'Search query is required' };
        }
        
        if (query.length < 2) {
            return { isValid: false, error: 'Search query must be at least 2 characters' };
        }
        
        if (query.length > 100) {
            return { isValid: false, error: 'Search query too long (max 100 characters)' };
        }
        
        // Check for common injection patterns
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /\$$$/,
            /eval$$/i
        ];
        
        if (dangerousPatterns.some(pattern => pattern.test(query))) {
            return { isValid: false, error: 'Invalid characters in search query' };
        }
        
        return { isValid: true };
    }

    // Rate limiting helper
    static checkRateLimit(userId, command, limit = 5, windowMs = 60000) {
        if (!this.rateLimits) this.rateLimits = new Map();
        
        const key = `${userId}:${command}`;
        const now = Date.now();
        const userLimits = this.rateLimits.get(key) || [];
        
        // Remove old entries
        const validLimits = userLimits.filter(time => now - time < windowMs);
        
        if (validLimits.length >= limit) {
            return {
                allowed: false,
                resetTime: Math.ceil((validLimits + windowMs - now) / 1000)
            };
        }
        
        validLimits.push(now);
        this.rateLimits.set(key, validLimits);
        
        return { allowed: true };
    }

    // Validate calendar event data
    static validateCalendarEvent(eventData) {
        const errors = [];
        
        if (!eventData.title || eventData.title.length < 1) {
            errors.push('Event title is required');
        }
        
        if (!eventData.startTime || isNaN(new Date(eventData.startTime))) {
            errors.push('Valid start time is required');
        }
        
        if (!eventData.duration || eventData.duration < 1 || eventData.duration > 10080) {
            errors.push('Duration must be between 1 minute and 1 week');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = InputValidator;
