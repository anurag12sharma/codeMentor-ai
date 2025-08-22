const axios = require('axios');
const { Contest, ContestStatus, ContestPlatform, ContestDifficulty } = require('./contestTypes');

class CompeteAPIFetcher {
    constructor() {
        this.apiURL = 'https://competeapi.vercel.app/contests/upcoming/';
        this.cache = new Map();
        this.cacheTimeout = 3 * 60 * 1000; // 3 minutes cache
    }

    async getContests() {
        const cacheKey = 'compete_api_contests';
        
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
                console.log('📋 Using cached CompeteAPI data');
                return cachedData.data;
            }
        }

        try {
            console.log('🌐 Fetching REAL contests from CompeteAPI...');
            
            const response = await axios.get(this.apiURL, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'CodeMentor-AI-Bot/1.0',
                    'Accept': 'application/json'
                }
            });

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format from CompeteAPI');
            }

            console.log(`📊 Received ${response.data.length} contests from CompeteAPI`);

            const now = Date.now();
            const validContests = [];

            for (const apiContest of response.data) {
                try {
                    // Parse contest data according to CompeteAPI format
                    const startTime = new Date(apiContest.startTime); // CompeteAPI uses milliseconds
                    
                    // Skip past contests
                    if (startTime.getTime() <= now) {
                        console.log(`⏭️ Skipping past contest: ${apiContest.title} (started ${startTime})`);
                        continue;
                    }

                    // Skip contests more than 3 months in future
                    if (startTime.getTime() > now + (90 * 24 * 60 * 60 * 1000)) {
                        console.log(`⏭️ Skipping far future: ${apiContest.title} (starts ${startTime})`);
                        continue;
                    }

                    // Map platform names
                    const platform = this.mapPlatform(apiContest.site);
                    if (!platform) {
                        console.log(`⏭️ Skipping unsupported platform: ${apiContest.site}`);
                        continue;
                    }

                    // Calculate duration in minutes
                    const durationMs = apiContest.duration || 7200000; // Default 2 hours
                    const durationMinutes = Math.floor(durationMs / 60000);

                    // Create contest object
                    const contest = new Contest({
                        id: this.extractContestId(apiContest.url) || apiContest.title.replace(/\s+/g, ''),
                        name: apiContest.title,
                        platform: platform,
                        startTime: startTime,
                        duration: durationMinutes,
                        difficulty: this.guessDifficulty(apiContest.title, platform),
                        url: apiContest.url,
                        description: `Contest on ${platform}`
                    });

                    validContests.push(contest);
                    console.log(`✅ Real contest: ${contest.name} (${contest.platform}) - ${contest.getRelativeTime()}`);
                    console.log(`🔗 URL: ${contest.url}`);

                } catch (error) {
                    console.error(`❌ Error processing contest ${apiContest.title}:`, error.message);
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

            console.log(`✅ Processed ${validContests.length} valid real contests from CompeteAPI`);
            return validContests;

        } catch (error) {
            console.error('❌ Error fetching from CompeteAPI:', error.message);
            
            // Return cached data if available
            if (this.cache.has(cacheKey)) {
                console.log('📋 Returning stale cached data due to API failure');
                return this.cache.get(cacheKey).data;
            }
            
            return [];
        }
    }

    mapPlatform(siteName) {
        const platformMap = {
            'codeforces': ContestPlatform.CODEFORCES,
            'codechef': ContestPlatform.CODECHEF,
            'atcoder': ContestPlatform.ATCODER,
            'leetcode': ContestPlatform.LEETCODE
        };

        const normalizedSite = siteName.toLowerCase();
        return platformMap[normalizedSite] || null;
    }

    extractContestId(url) {
        try {
            if (!url) return null;
            
            // Extract contest ID from URL
            if (url.includes('codeforces.com/contest/')) {
                return url.split('contest/')[1].split(/[?#]/);
            } else if (url.includes('codechef.com/')) {
                const match = url.match(/codechef\.com\/([A-Z0-9]+)/);
                return match ? match[17] : null;
            } else if (url.includes('atcoder.jp/contests/')) {
                return url.split('contests/')[17].split(/[?#]/);
            } else if (url.includes('leetcode.com')) {
                // LeetCode contests don't have simple IDs in URLs
                return null;
            }
            
            return null;
        } catch (error) {
            return null;
        }
    }

    guessDifficulty(contestName, platform) {
        const name = contestName.toLowerCase();
        
        // Platform-specific difficulty mapping
        if (platform === ContestPlatform.CODEFORCES) {
            if (name.includes('div. 4') || name.includes('div.4')) {
                return ContestDifficulty.BEGINNER;
            } else if (name.includes('div. 3') || name.includes('div.3')) {
                return ContestDifficulty.BEGINNER;
            } else if (name.includes('div. 1') || name.includes('div.1') || name.includes('global')) {
                return ContestDifficulty.EXPERT;
            } else if (name.includes('educational')) {
                return ContestDifficulty.BEGINNER;
            }
            return ContestDifficulty.INTERMEDIATE;
        } else if (platform === ContestPlatform.CODECHEF) {
            if (name.includes('starter') || name.includes('beginner')) {
                return ContestDifficulty.BEGINNER;
            } else if (name.includes('lunchtime') || name.includes('cookoff')) {
                return ContestDifficulty.INTERMEDIATE;
            }
            return ContestDifficulty.INTERMEDIATE;
        } else if (platform === ContestPlatform.ATCODER) {
            if (name.includes('beginner') || name.includes('abc')) {
                return ContestDifficulty.BEGINNER;
            } else if (name.includes('regular') || name.includes('arc')) {
                return ContestDifficulty.INTERMEDIATE;
            } else if (name.includes('grand') || name.includes('agc')) {
                return ContestDifficulty.EXPERT;
            }
            return ContestDifficulty.INTERMEDIATE;
        }
        
        // Generic difficulty guessing
        if (name.includes('beginner') || name.includes('easy') || name.includes('div. 4') || 
            name.includes('div. 3') || name.includes('starter')) {
            return ContestDifficulty.BEGINNER;
        } else if (name.includes('expert') || name.includes('hard') || name.includes('div. 1') || 
                   name.includes('grand') || name.includes('advanced')) {
            return ContestDifficulty.EXPERT;
        }
        
        return ContestDifficulty.INTERMEDIATE;
    }

    async getUpcomingContests() {
        const contests = await this.getContests();
        return contests.filter(contest => contest.isUpcoming());
    }
}

module.exports = CompeteAPIFetcher;
