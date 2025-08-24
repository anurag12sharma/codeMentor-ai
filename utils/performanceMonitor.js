class PerformanceMonitor {
    constructor() {
        this.metrics = {
            commandExecutions: new Map(),
            apiCalls: new Map(),
            responsesTimes: [],
            errors: new Map()
        };
        this.startTime = Date.now();
    }

    // Track command execution
    trackCommand(commandName, executionTime) {
        const current = this.metrics.commandExecutions.get(commandName) || { count: 0, totalTime: 0 };
        current.count++;
        current.totalTime += executionTime;
        current.avgTime = current.totalTime / current.count;
        
        this.metrics.commandExecutions.set(commandName, current);
    }

    // Track API calls
    trackAPICall(apiName, responseTime, success = true) {
        const current = this.metrics.apiCalls.get(apiName) || { 
            count: 0, 
            totalTime: 0, 
            errors: 0,
            success: 0 
        };
        
        current.count++;
        current.totalTime += responseTime;
        current.avgTime = current.totalTime / current.count;
        
        if (success) {
            current.success++;
        } else {
            current.errors++;
        }
        
        current.successRate = (current.success / current.count) * 100;
        
        this.metrics.apiCalls.set(apiName, current);
    }

    // Get performance report
    getReport() {
        const uptime = Date.now() - this.startTime;
        
        // Top 5 most used commands
        const topCommands = Array.from(this.metrics.commandExecutions.entries())
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .map(([name, stats]) => ({
                name,
                count: stats.count,
                avgTime: Math.round(stats.avgTime) + 'ms'
            }));

        // API performance
        const apiStats = Array.from(this.metrics.apiCalls.entries())
            .map(([name, stats]) => ({
                name,
                calls: stats.count,
                avgTime: Math.round(stats.avgTime) + 'ms',
                successRate: Math.round(stats.successRate) + '%'
            }));

        return {
            uptime: Math.round(uptime / 1000 / 60), // minutes
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
            },
            topCommands,
            apiStats,
            totalCommands: Array.from(this.metrics.commandExecutions.values())
                .reduce((sum, stats) => sum + stats.count, 0)
        };
    }

    // Clear old metrics (call periodically)
    clearOldMetrics() {
        // Reset if uptime > 24 hours to prevent memory bloat
        const uptime = Date.now() - this.startTime;
        if (uptime > 24 * 60 * 60 * 1000) {
            this.metrics.commandExecutions.clear();
            this.metrics.apiCalls.clear();
            this.metrics.responsesTimes = [];
            this.startTime = Date.now();
            console.log('📊 Performance metrics reset after 24 hours');
        }
    }
}

module.exports = PerformanceMonitor;
