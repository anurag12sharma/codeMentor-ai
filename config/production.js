module.exports = {
    bot: {
        presence: {
            status: 'online',
            activities: [{
                name: 'Global MCP Hackathon 🏆',
                type: 3 // Watching
            }]
        }
    },
    
    cache: {
        contestCacheTime: 3 * 60 * 1000, // 3 minutes in production
        aiCacheTime: 10 * 60 * 1000,     // 10 minutes for AI responses
    },
    
    rateLimit: {
        commands: 10,        // 10 commands per minute per user
        ai: 3,              // 3 AI calls per minute per user
        window: 60 * 1000   // 1 minute window
    },
    
    monitoring: {
        healthCheckInterval: 5 * 60 * 1000, // 5 minutes
        logLevel: 'info'
    }
};
