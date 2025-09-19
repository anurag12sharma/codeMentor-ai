const CompeteAPIFetcher = require('./codechefScraper'); // Using CompeteAPI now
const { ContestStatus, ContestPlatform } = require('./contestTypes');

class ContestManager {
    constructor() {
        this.competeAPI = new CompeteAPIFetcher(); // Real contest API
        this.allContests = [];
        this.lastUpdate = null;
        this.updateInterval = 2 * 60 * 1000; // Update every 2 minutes for better freshness
    }

    async getAllContests(forceUpdate = false) {
        if (!forceUpdate && this.lastUpdate && 
            Date.now() - this.lastUpdate < this.updateInterval && 
            this.allContests.length > 0) {
            console.log(`📋 Using cached contest data (age: ${Math.floor((Date.now() - this.lastUpdate)/1000)}s)`);
            return this.allContests;
        }

        console.log('🔄 Fetching REAL contests from all sources...');
        
        try {
            const [competeAPIResult] = await Promise.allSettled([
                this.competeAPI.getUpcomingContests()
            ]);

            this.allContests = [];

            if (competeAPIResult.status === 'fulfilled') {
                const competeContests = competeAPIResult.value || [];
                this.allContests.push(...competeContests);
                console.log(`📊 CompeteAPI platforms: ${[...new Set(competeContests.map(c => c.platform))].join(', ')}`);
            } else {
                console.error('❌ CompeteAPI failed:', competeAPIResult.reason?.message);
            }

            this.allContests = this.removeDuplicates(this.allContests);
            this.allContests.sort((a, b) => a.startTime - b.startTime);
            this.lastUpdate = Date.now();

            console.log(`✅ Total real contests loaded: ${this.allContests.length}`);
            
            // Show platform breakdown
            const platformBreakdown = {};
            this.allContests.forEach(contest => {
                platformBreakdown[contest.platform] = (platformBreakdown[contest.platform] || 0) + 1;
            });
            console.log(`📊 Platform breakdown:`, platformBreakdown);
            
            // Show next few contests
            this.allContests.slice(0, 3).forEach(contest => {
                console.log(`📅 Next: ${contest.name} (${contest.platform}) - ${contest.getRelativeTime()}`);
            });
            

            return this.allContests;

        } catch (error) {
            console.error('❌ Error updating contests:', error);
            return this.allContests;
        }
    }

    removeDuplicates(contests) {
        const seen = new Set();
        return contests.filter(contest => {
            // Create a unique key based on name, platform, and start time
            const key = `${contest.platform}-${contest.name.toLowerCase()}-${contest.startTime.getTime()}`;
            if (seen.has(key)) {
                console.log(`🔄 Removing duplicate: ${contest.name} (${contest.platform})`);
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    // Rest of the methods remain the same...
    async getUpcomingContests(limit = 10) {
        const contests = await this.getAllContests();
        return contests
            .filter(contest => contest.isUpcoming())
            .slice(0, limit);
    }

    async getRunningContests() {
        try {
            const contests = await this.getAllContests();
            // Use the built-in isRunning() method from Contest class
            return contests.filter(contest => contest.isRunning());
        } catch (error) {
            console.error('Error fetching running contests:', error);
            return [];
        }
    }

    async getContestsByPlatform(platform) {
        const contests = await this.getAllContests();
        return contests.filter(contest => contest.platform === platform);
    }

    async searchContests(query) {
        const contests = await this.getAllContests();
        const searchTerm = query.toLowerCase();
        
        return contests.filter(contest => 
            contest.name.toLowerCase().includes(searchTerm) ||
            contest.platform.toLowerCase().includes(searchTerm)
        );
    }

    async getContestsStartingSoon(hours = 24) {
        const contests = await this.getUpcomingContests();
        const cutoffTime = Date.now() + (hours * 60 * 60 * 1000);
        
        return contests.filter(contest => 
            contest.startTime.getTime() <= cutoffTime
        );
    }

    async getContestStats() {
        const contests = await this.getAllContests();
        
        const stats = {
            total: contests.length,
            upcoming: contests.filter(c => c.isUpcoming()).length,
            running: (await this.getRunningContests()).length,
            platforms: {}
        };

        Object.values(ContestPlatform).forEach(platform => {
            stats.platforms[platform] = contests.filter(c => c.platform === platform).length;
        });

        stats.lastUpdate = this.lastUpdate;
        return stats;
    }
}

module.exports = ContestManager;
