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
                    
                    // Calculate end time to check if contest is still relevant
                    const durationMs = apiContest.duration || 7200000; // Default 2 hours
                    const endTime = new Date(startTime.getTime() + durationMs);
                    
                    // Skip contests that have already ended
                    if (endTime.getTime() <= now) {
                        console.log(`⏭️ Skipping finished contest: ${apiContest.title} (ended ${endTime})`);
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

                    // Calculate duration in minutes (using the durationMs already calculated above)
                    let durationMinutes;
                    
                    if (platform === ContestPlatform.LEETCODE) {
                        durationMinutes = Math.floor(durationMs / 3600000);
                    } else {
                        durationMinutes = Math.floor(durationMs / 60000);
                    }


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
            'hackerearth': ContestPlatform.HACKEREARTH,
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
            } else if (url.includes('hackerearth.com/challenge/')) {
                const match = url.match(/hackerearth\.com\/challenge\/([^\/]+)/);
                return match ? match[1] : null;
            } else if (url.includes('hackerearth.com/challenges/')) {
                const match = url.match(/hackerearth\.com\/challenges\/([^\/]+)/);
                return match ? match[1] : null;
            } else if (url.includes('leetcode.com')) {
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
        } else if (platform === ContestPlatform.HACKEREARTH) {
            if (name.includes('easy') || name.includes('beginner') || name.includes('school')) {
                return ContestDifficulty.BEGINNER;
            } else if (name.includes('hard') || name.includes('expert') || name.includes('advanced')) {
                return ContestDifficulty.EXPERT;
            }
            return ContestDifficulty.INTERMEDIATE;
        }
    }

    formatHackerEarthURL(contestId) {
        return `https://www.hackerearth.com/challenge/${contestId}/`;
    }

    detectHackerEarthType(contestName) {
        const name = contestName.toLowerCase();
        if (name.includes('hiring') || name.includes('recruitment')) {
            return 'Hiring Challenge';
        } else if (name.includes('circuit') || name.includes('monthly')) {
            return 'Monthly Circuit';
        } else if (name.includes('hackathon')) {
            return 'Hackathon';
        }
        return 'Contest';
    }

    async getUpcomingContests() {
        const contests = await this.getContests();
        return contests.filter(contest => contest.isUpcoming());
    }
}

module.exports = CompeteAPIFetcher;
