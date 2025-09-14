// const axios = require('axios');
// const { Contest, ContestStatus, ContestPlatform, ContestDifficulty } = require('./contestTypes');

// class CodeforcesAPI {
//     constructor() {
//         this.baseURL = 'https://codeforces.com/api';
//         this.cache = new Map();
//         this.cacheTimeout = 2 * 60 * 1000; // 2 minutes cache
//     }

//     async makeRequest(endpoint, params = {}) {
//         const url = `${this.baseURL}${endpoint}`;
//         const cacheKey = `${url}?${new URLSearchParams(params).toString()}`;
        
//         if (this.cache.has(cacheKey)) {
//             const cachedData = this.cache.get(cacheKey);
//             if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
//                 console.log(`📋 Using cached Codeforces data`);
//                 return cachedData.data;
//             }
//         }

//         try {
//             console.log(`🌐 Fetching REAL data from Codeforces API: ${endpoint}`);
//             const response = await axios.get(url, { 
//                 params,
//                 timeout: 10000,
//                 headers: {
//                     'User-Agent': 'CodeMentor-AI-Bot/1.0'
//                 }
//             });

//             if (response.data.status !== 'OK') {
//                 throw new Error(`Codeforces API error: ${response.data.comment}`);
//             }

//             this.cache.set(cacheKey, {
//                 data: response.data.result,
//                 timestamp: Date.now()
//             });

//             return response.data.result;
//         } catch (error) {
//             console.error(`❌ Codeforces API failed:`, error.message);
//             throw error;
//         }
//     }

//     async getUpcomingContests() {
//         try {
//             const allContests = await this.makeRequest('/contest.list');
//             console.log(`📊 Received ${allContests.length} contests from Codeforces`);

//             const now = Date.now();
//             const upcomingContests = [];

//             for (const cfContest of allContests) {
//                 // Only consider contests that are in "BEFORE" phase (truly upcoming)
//                 if (cfContest.phase !== 'BEFORE') {
//                     continue;
//                 }

//                 const startTime = new Date(cfContest.startTimeSeconds * 1000);
                
//                 // Skip contests that have already started (even if marked as BEFORE due to delay)
//                 if (startTime.getTime() <= now) {
//                     console.log(`⏭️ Skipping past contest: ${cfContest.name} (${startTime})`);
//                     continue;
//                 }

//                 // Skip contests more than 3 months in future (probably test contests)
//                 if (startTime.getTime() > now + (90 * 24 * 60 * 60 * 1000)) {
//                     console.log(`⏭️ Skipping far future: ${cfContest.name} (${startTime})`);
//                     continue;
//                 }

//                 try {
//                     const contest = this.formatContest(cfContest);
//                     upcomingContests.push(contest);
//                     console.log(`✅ Valid contest: ${contest.name} - starts ${contest.getRelativeTime()}`);
//                 } catch (error) {
//                     console.error(`❌ Error formatting contest ${cfContest.name}:`, error.message);
//                 }
//             }

//             upcomingContests.sort((a, b) => a.startTime - b.startTime);
//             console.log(`✅ Found ${upcomingContests.length} real upcoming Codeforces contests`);
            
//             return upcomingContests.slice(0, 10); // Limit to 10 most upcoming
//         } catch (error) {
//             console.error('❌ Error fetching Codeforces contests:', error.message);
//             return [];
//         }
//     }

//     async getRunningContests() {
//         try {
//             const allContests = await this.makeRequest('/contest.list');
//             const runningContests = [];

//             for (const cfContest of allContests) {
//                 if (cfContest.phase === 'CODING') {
//                     try {
//                         const contest = this.formatContest(cfContest);
//                         runningContests.push(contest);
//                         console.log(`🏃‍♂️ Running contest: ${contest.name}`);
//                     } catch (error) {
//                         console.error(`Error processing running contest:`, error.message);
//                     }
//                 }
//             }

//             return runningContests;
//         } catch (error) {
//             console.error('Error fetching running contests:', error.message);
//             return [];
//         }
//     }

//     formatContest(cfContest) {
//         let difficulty = ContestDifficulty.INTERMEDIATE;
//         const name = cfContest.name.toLowerCase();
        
//         if (name.includes('div. 4') || name.includes('div.4')) {
//             difficulty = ContestDifficulty.BEGINNER;
//         } else if (name.includes('div. 3') || name.includes('div.3')) {
//             difficulty = ContestDifficulty.BEGINNER;
//         } else if (name.includes('div. 1') || name.includes('div.1') || name.includes('global')) {
//             difficulty = ContestDifficulty.EXPERT;
//         } else if (name.includes('educational')) {
//             difficulty = ContestDifficulty.BEGINNER;
//         }

//         return new Contest({
//             id: cfContest.id,
//             name: cfContest.name,
//             platform: ContestPlatform.CODEFORCES,
//             startTime: new Date(cfContest.startTimeSeconds * 1000),
//             duration: Math.floor(cfContest.durationSeconds / 600),
//             difficulty: difficulty,
//             url: `https://codeforces.com/contest/${cfContest.id}`,
//             description: `${cfContest.type || 'Contest'} on Codeforces`
//         });
//     }

//     async getContests() {
//         const upcoming = await this.getUpcomingContests();
//         const running = await this.getRunningContests();
//         return [...running, ...upcoming];
//     }
// }

// module.exports = CodeforcesAPI;
