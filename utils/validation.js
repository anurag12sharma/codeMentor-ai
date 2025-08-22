const { ContestPlatform } = require('./contestTypes');

module.exports = {
    // Existing validations...
    hasPermission: (member, permission) => {
        return member.permissions.has(permission);
    },
    
    botHasPermission: (guild, permission) => {
        return guild.members.me.permissions.has(permission);
    },
    
    validateArgs: (args, minArgs, maxArgs = null) => {
        if (args.length < minArgs) {
            return { valid: false, error: `This command requires at least ${minArgs} arguments.` };
        }
        if (maxArgs && args.length > maxArgs) {
            return { valid: false, error: `This command accepts at most ${maxArgs} arguments.` };
        }
        return { valid: true };
    },
    
    allowedInDM: (command, message) => {
        if (command.guildOnly && !message.guild) {
            return { allowed: false, error: 'This command can only be used in servers.' };
        }
        return { allowed: true };
    },

    // NEW: Contest-specific validations
    validatePlatform: (platformName) => {
        if (!platformName) return { valid: true };
        
        const validPlatforms = ['codeforces', 'cf', 'codechef', 'cc', 'atcoder', 'leetcode'];
        const normalizedInput = platformName.toLowerCase();
        
        if (!validPlatforms.includes(normalizedInput)) {
            return { 
                valid: false, 
                error: `Invalid platform. Valid options: ${validPlatforms.join(', ')}` 
            };
        }
        return { valid: true };
    },

    validateLimit: (limitStr, min = 1, max = 20) => {
        if (!limitStr) return { valid: true, value: 10 }; // default
        
        const limit = parseInt(limitStr);
        if (isNaN(limit)) {
            return { valid: false, error: 'Limit must be a number.' };
        }
        if (limit < min || limit > max) {
            return { valid: false, error: `Limit must be between ${min} and ${max}.` };
        }
        return { valid: true, value: limit };
    },

    validateSearchQuery: (query) => {
        if (!query || query.trim().length === 0) {
            return { valid: false, error: 'Search query cannot be empty.' };
        }
        if (query.length < 2) {
            return { valid: false, error: 'Search query must be at least 2 characters long.' };
        }
        if (query.length > 100) {
            return { valid: false, error: 'Search query cannot exceed 100 characters.' };
        }
        return { valid: true };
    }
};
