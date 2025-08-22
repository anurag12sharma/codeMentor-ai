const CodeforcesAPI = require('./codeforcesAPI');
const RealContestFetcher = require('./codechefScraper'); // Using real fetcher now
const { ContestStatus, ContestPlatform } = require('./contestTypes');

class ContestManager {
    constructor() {
        this.codeforces = new CodeforcesAPI();
        this.realFetcher = new RealContestFetcher(); // Real contest aggregator
        this.allContests = [];
        this.lastUpdate = null;
        this.updateInterval = 3 * 60 * 1000; // Update every 3 minutes
    }

    async getAllContests(forceUpdate = false) {
        if (!forceUpdate && this.lastUpdate && 
            Date.now() - this.lastUpdate < this.updateInterval && 
            this.allContests.length > 0) {
            console.log('📋 Using cached contest data');
            return this.allContests;
        }

        console.log('🔄 Fetching REAL contests from all sources...');
        
        try {
            // Fetch from both Codeforces API and real contest aggregator concurrently
            const [codeforcesResult, realContestsResult] = await Promise.allSettled([
                this.codeforces.getUpcomingContests(),
                this.realFetcher.getUpcomingContests()
            ]);

            this.allContests = [];
            
            // Process Codeforces contests
            if (codeforcesResult.status === 'fulfilled') {
                const cfContests = codeforcesResult.value || [];
                this.allContests.push(...cfContests);
                console.log(`✅ Added ${cfContests.length} real Codeforces contests`);
            } else {
                console.error('❌ Codeforces API failed:', codeforcesResult.reason?.message);
            }

            // Process aggregated contests (CodeChef, AtCoder, etc.)
            if (realContestsResult.status === 'fulfilled') {
                const realContests = realContestsResult.value || [];
                
                // Filter out Codeforces contests to avoid duplicates
                const nonCodeforcesContests = realContests.filter(
                    contest => contest.platform !== ContestPlatform.CODEFORCES
                );
                
                this.allContests.push(...nonCodeforcesContests);
                console.log(`✅ Added ${nonCodeforcesContests.length} real contests from other platforms`);
            } else {
                console.error('❌ Real contest fetcher failed:', realContestsResult.reason?.message);
            }

            // Remove duplicates and sort by start time
            this.allContests = this.removeDuplicates(this.allContests);
            this.allContests.sort((a, b) => a.startTime - b.startTime);
            this.lastUpdate = Date.now();

            console.log(`✅ Total real contests loaded: ${this.allContests.length}`);
            
            // Show next few contests
            this.allContests.slice(0, 3).forEach(contest => {
                console.log(`📅 Next: ${contest.name} (${contest.platform}) - ${contest.getRelativeTime()}`);
                console.log(`🔗 URL: ${contest.url}`);
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
            const key = `${contest.platform}-${contest.name}-${contest.startTime.getTime()}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    async getUpcomingContests(limit = 10) {
        const contests = await this.getAllContests();
        return contests
            .filter(contest => contest.isUpcoming())
            .slice(0, limit);
    }

    async getRunningContests() {
        // For running contests, only check Codeforces API as it's more reliable
        try {
            return await this.codeforces.getRunningContests();
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

        return stats;
    }
}

module.exports = ContestManager;
