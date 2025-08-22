const axios = require('axios');
const { Contest, ContestStatus, ContestPlatform, ContestDifficulty } = require('./contestTypes');

class RealContestFetcher {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
        this.apiURL = 'https://kontests.net/api/v1/all';
    }

    async getContests() {
        const cacheKey = 'real_contests';
        
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
                console.log('📋 Using cached real contest data');
                return cachedData.data;
            }
        }

        try {
            console.log('🌐 Fetching REAL contests from kontests.net API...');
            
            const response = await axios.get(this.apiURL, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'CodeMentor-AI-Bot/1.0'
                }
            });

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format from kontests API');
            }

            console.log(`📊 Received ${response.data.length} contests from kontests.net`);

            const now = Date.now();
            const validContests = [];

            for (const contest of response.data) {
                try {
                    // Parse the start time
                    const startTime = new Date(contest.start_time);
                    
                    // Skip past contests
                    if (startTime.getTime() <= now) {
                        continue;
                    }

                    // Skip contests more than 2 months in future
                    if (startTime.getTime() > now + (60 * 24 * 60 * 60 * 1000)) {
                        continue;
                    }

                    // Map platform names
                    const platform = this.mapPlatform(contest.site);
                    if (!platform) {
                        continue; // Skip unsupported platforms
                    }

                    // Parse duration
                    const duration = this.parseDuration(contest.duration);

                    const formattedContest = new Contest({
                        id: contest.url.split('/').pop() || contest.name.replace(/\s+/g, ''),
                        name: contest.name,
                        platform: platform,
                        startTime: startTime,
                        duration: duration,
                        difficulty: this.guessDifficulty(contest.name),
                        url: contest.url,
                        description: `Contest on ${platform}`
                    });

                    validContests.push(formattedContest);
                    console.log(`✅ Real contest: ${formattedContest.name} - ${formattedContest.getRelativeTime()} - ${formattedContest.url}`);

                } catch (error) {
                    console.error(`❌ Error processing contest ${contest.name}:`, error.message);
                    continue;
                }
            }

            // Sort by start time
            validContests.sort((a, b) => a.startTime - b.startTime);

            // Cache the results
            this.cache.set(cacheKey, {
                data: validContests,
                timestamp: Date.now()
            });

            console.log(`✅ Processed ${validContests.length} valid real contests`);
            return validContests;

        } catch (error) {
            console.error('❌ Error fetching real contests:', error.message);
            return [];
        }
    }

    mapPlatform(siteName) {
        const siteMap = {
            'CodeForces': ContestPlatform.CODEFORCES,
            'Codeforces': ContestPlatform.CODEFORCES,
            'CodeChef': ContestPlatform.CODECHEF,
            'AtCoder': ContestPlatform.ATCODER,
            'LeetCode': ContestPlatform.LEETCODE
        };

        return siteMap[siteName] || null;
    }

    parseDuration(durationStr) {
        // Duration might be in format "02:00:00" or "120" (minutes)
        if (typeof durationStr === 'string' && durationStr.includes(':')) {
            const parts = durationStr.split(':');
            const hours = parseInt(parts[0]) || 0;
            const minutes = parseInt(parts[16]) || 0;
            return hours * 60 + minutes;
        }
        
        const durationNum = parseInt(durationStr);
        return isNaN(durationNum) ? 120 : Math.min(durationNum, 10080); // Max 7 days
    }

    guessDifficulty(contestName) {
        const name = contestName.toLowerCase();
        
        if (name.includes('beginner') || name.includes('div. 4') || name.includes('div. 3') || 
            name.includes('educational') || name.includes('starter')) {
            return ContestDifficulty.BEGINNER;
        } else if (name.includes('div. 1') || name.includes('global') || name.includes('grand')) {
            return ContestDifficulty.EXPERT;
        } else {
            return ContestDifficulty.INTERMEDIATE;
        }
    }

    async getUpcomingContests() {
        const contests = await this.getContests();
        return contests.filter(contest => contest.isUpcoming());
    }
}

module.exports = RealContestFetcher;
