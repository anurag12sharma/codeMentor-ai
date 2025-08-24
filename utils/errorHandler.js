const { EmbedBuilder } = require('discord.js');

class ErrorHandler {
    constructor() {
        this.errorCounts = new Map();
        this.maxErrorsPerHour = 50;
    }

    // Handle Discord bot errors
    handleBotError(error, context = '') {
        const timestamp = new Date().toISOString();
        const errorKey = `${error.name}_${Date.now().toString().slice(0, -6)}`; // Hour-based key
        
        // Track error frequency
        const count = this.errorCounts.get(errorKey) || 0;
        this.errorCounts.set(errorKey, count + 1);
        
        // Log error details
        console.error(`❌ Bot Error [${timestamp}] ${context}:`, {
            name: error.name,
            message: error.message,
            stack: error.stack?.split('\n')[0],
            count: count + 1
        });
        
        // Alert if too many errors
        if (count > this.maxErrorsPerHour) {
            console.error(`🚨 HIGH ERROR RATE: ${error.name} occurred ${count} times this hour!`);
        }
        
        return this.createErrorEmbed(error, context);
    }

    // Handle API errors
    handleAPIError(error, apiName) {
        console.error(`❌ ${apiName} API Error:`, {
            status: error.response?.status,
            statusText: error.response?.statusText,
            message: error.message,
            url: error.config?.url
        });
        
        return {
            isAPIError: true,
            apiName,
            status: error.response?.status || 'Unknown',
            message: this.getAPIErrorMessage(error, apiName)
        };
    }

    // Handle AI service errors
    handleAIError(error, operation) {
        console.error(`❌ AI Service Error [${operation}]:`, {
            message: error.message,
            type: error.constructor.name
        });
        
        if (error.message.includes('API key')) {
            return 'AI service unavailable: Invalid API configuration';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
            return 'AI service temporarily unavailable: Rate limit exceeded';
        } else {
            return 'AI service temporarily unavailable. Please try again later.';
        }
    }

    createErrorEmbed(error, context) {
        return new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('❌ Something went wrong')
            .setDescription(`An error occurred while ${context || 'processing your request'}.`)
            .addFields(
                { name: 'What you can do:', value: '• Try the command again in a few seconds\n• Use `!help` to see available commands\n• Contact support if the issue persists' }
            )
            .setFooter({ text: 'Error logged for debugging' })
            .setTimestamp();
    }

    getAPIErrorMessage(error, apiName) {
        const status = error.response?.status;
        
        switch (status) {
            case 429:
                return `${apiName} rate limit exceeded. Please try again later.`;
            case 401:
                return `${apiName} authentication failed. Service temporarily unavailable.`;
            case 403:
                return `${apiName} access forbidden. Service may be down.`;
            case 500:
            case 502:
            case 503:
                return `${apiName} is experiencing issues. Please try again later.`;
            default:
                return `${apiName} is temporarily unavailable.`;
        }
    }

    // Clean old error counts (call periodically)
    cleanOldErrors() {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        const hourKey = oneHourAgo.toString().slice(0, -6);
        
        for (const [key] of this.errorCounts) {
            if (key.includes('_') && parseInt(key.split('_')[1]) < parseInt(hourKey)) {
                this.errorCounts.delete(key);
            }
        }
    }
}

module.exports = ErrorHandler;
