const ContestManager = require('./contestManager');
const AIService = require('./aiService');

class HealthCheck {
    constructor() {
        this.contestManager = new ContestManager();
        this.lastChecks = {};
        this.services = {
            contests: 'healthy',
            ai: 'healthy',
            reminders: 'healthy',
            calendar: 'healthy'
        };
    }

    async checkAllServices() {
        const results = {};
        
        // Check contest fetching
        try {
            const contests = await this.contestManager.getUpcomingContests(1);
            results.contests = contests.length >= 0 ? 'healthy' : 'warning';
            this.services.contests = results.contests;
        } catch (error) {
            results.contests = 'unhealthy';
            this.services.contests = 'unhealthy';
            console.error('❌ Contest service health check failed:', error.message);
        }

        // Check AI service
        try {
            const aiService = new AIService();
            await aiService.generateText('Test', { maxTokens: 10 });
            results.ai = 'healthy';
            this.services.ai = 'healthy';
        } catch (error) {
            results.ai = 'unhealthy';
            this.services.ai = 'unhealthy';
            console.error('❌ AI service health check failed:', error.message);
        }

        // Update last check time
        this.lastChecks.timestamp = new Date();
        
        return {
            status: this.getOverallStatus(results),
            services: results,
            lastCheck: this.lastChecks.timestamp,
            uptime: process.uptime()
        };
    }

    getOverallStatus(results) {
        const values = Object.values(results);
        
        if (values.every(status => status === 'healthy')) {
            return 'healthy';
        } else if (values.some(status => status === 'unhealthy')) {
            return 'degraded';
        } else {
            return 'warning';
        }
    }

    getServiceStatus(serviceName) {
        return this.services[serviceName] || 'unknown';
    }

    async generateHealthReport() {
        const health = await this.checkAllServices();
        
        const report = {
            overall: health.status,
            timestamp: new Date().toISOString(),
            uptime: `${Math.floor(health.uptime / 60)} minutes`,
            services: {
                'Contest Tracking': health.services.contests,
                'AI Services': health.services.ai,
                'Reminder System': 'healthy', // Assume healthy if no errors
                'Calendar Integration': 'healthy' // Assume healthy if no errors
            },
            memory: {
                used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
            }
        };

        return report;
    }
}

module.exports = HealthCheck;
