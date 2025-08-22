const axios = require('axios');

class LiveContestFetcher {
    
    // Validate if a Codeforces contest URL is actually valid
    async validateCodeforcesContest(contestId) {
        try {
            const url = `https://codeforces.com/contest/${contestId}`;
            const response = await axios.get(url, { 
                timeout: 5000,
                validateStatus: status => status < 500 // Accept 4xx as valid URLs
            });
            
            return response.status !== 404;
        } catch (error) {
            return false;
        }
    }
    
    // Get live contest data from a third-party API (as backup)
    async getBackupContestData() {
        try {
            // Using a public contest aggregator API
            const response = await axios.get('https://kontests.net/api/v1/all', {
                timeout: 10000,
                headers: {
                    'User-Agent': 'CodeMentor-AI-Bot/1.0'
                }
            });
            
            const now = Date.now();
            const validContests = response.data
                .filter(contest => {
                    const startTime = new Date(contest.start_time).getTime();
                    return startTime > now && // Future contest
                           (contest.site === 'CodeForces' || contest.site === 'CodeChef');
                })
                .slice(0, 10);
            
            console.log(`🔄 Backup API found ${validContests.length} contests`);
            return validContests;
            
        } catch (error) {
            console.error('❌ Backup contest API failed:', error.message);
            return [];
        }
    }
}

module.exports = LiveContestFetcher;
