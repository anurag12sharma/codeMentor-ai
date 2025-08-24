const AIService = require('./aiService');
const { z } = require('zod');

// Define the study plan schema
const StudyPlanSchema = z.object({
    weeklyGoal: z.string(),
    dailySchedule: z.array(z.object({
        day: z.string(),
        focusArea: z.string(),
        timeSlot: z.string(),
        tasks: z.array(z.string()),
        problemsToSolve: z.number(),
        estimatedTime: z.string()
    })),
    topicsToFocus: z.array(z.object({
        topic: z.string(),
        priority: z.enum(['high', 'medium', 'low']),
        reason: z.string()
    })),
    practiceRecommendations: z.array(z.string()),
    contestPreparation: z.object({
        upcomingContests: z.array(z.string()),
        preparationTips: z.array(z.string()),
        practiceProblems: z.number()
    })
});

class AIStudyPlanner {
    constructor() {
        this.aiService = new AIService();
    }

    async generateStudyPlan(userProfile) {
        const prompt = this.buildStudyPlanPrompt(userProfile);
        
        try {
            const studyPlan = await this.aiService.generateObject(
                prompt,
                StudyPlanSchema,
                { 
                    maxTokens: 2000,
                    temperature: 0.8 
                }
            );

            console.log('✅ AI study plan generated successfully');
            return studyPlan;
        } catch (error) {
            console.error('❌ Study plan generation failed:', error);
            // Fallback to text-based plan
            return await this.generateTextBasedPlan(userProfile);
        }
    }

    buildStudyPlanPrompt(userProfile) {
        return `Create a personalized competitive programming study plan for a student with the following profile:

**Student Profile:**
- Current Level: ${userProfile.level || 'Intermediate'}
- Experience: ${userProfile.experience || '1-2 years'}
- Available Time: ${userProfile.dailyTime || '2-3 hours per day'}
- Preferred Topics: ${userProfile.preferredTopics || 'Algorithms, Data Structures'}
- Weak Areas: ${userProfile.weakAreas || 'Dynamic Programming, Graph Theory'}
- Goals: ${userProfile.goals || 'Improve contest ranking'}
- Upcoming Contest: ${userProfile.nextContest || 'In 1 week'}
- Current Rating: ${userProfile.rating || 'Beginner (1000-1200)'}

**Requirements:**
1. Create a 7-day study schedule with specific daily focus areas
2. Recommend specific topics to practice based on their weak areas
3. Suggest number of problems to solve each day
4. Provide contest preparation tips
5. Include time management advice
6. Make recommendations realistic and achievable

Focus on competitive programming platforms like Codeforces, CodeChef, HackerEarth, and LeetCode.
Consider their current level and gradually increase difficulty.`;
    }

    async generateTextBasedPlan(userProfile) {
        try {
            const textPlan = await this.aiService.generateText(
                this.buildStudyPlanPrompt(userProfile),
                { maxTokens: 1500, temperature: 0.7 }
            );

            // Parse the text into a basic structure
            return {
                weeklyGoal: 'Improve competitive programming skills',
                textPlan: textPlan,
                isTextBased: true
            };
        } catch (error) {
            console.error('❌ Text-based plan generation failed:', error);
            throw error;
        }
    }

    async generateProgrammingTip(topic) {
        const prompt = `Provide a practical competitive programming tip about "${topic}".

Include:
1. Key concept explanation (1-2 sentences)
2. Common patterns or templates to remember
3. Practice approach and strategy  
4. Common mistakes to avoid
5. Recommended problem difficulty progression

Keep it concise but actionable for Discord. Focus on competitive programming contests like Codeforces, CodeChef, HackerEarth.`;

        try {
            const tip = await this.aiService.generateText(prompt, {
                maxTokens: 800,
                temperature: 0.6
            });

            return tip;
        } catch (error) {
            console.error('❌ Programming tip generation failed:', error);
            return `Here's a general tip about ${topic}: Focus on understanding the underlying patterns and practice regularly. Start with easier problems and gradually increase difficulty.`;
        }
    }

    async analyzeContestPerformance(contestHistory) {
        const prompt = `Analyze this competitive programmer's recent contest performance and provide actionable improvement suggestions:

**Contest History:**
${contestHistory.map(contest => 
    `- ${contest.name}: Rank ${contest.rank}/${contest.participants}, Problems solved: ${contest.solved}/${contest.total}, Rating change: ${contest.ratingChange}`
).join('\n')}

Provide:
1. Performance pattern analysis
2. Strengths and weaknesses identification  
3. Specific areas to focus on
4. Problem-solving strategy improvements
5. Contest preparation recommendations

Keep suggestions practical and specific.`;

        try {
            const analysis = await this.aiService.generateText(prompt, {
                maxTokens: 1200,
                temperature: 0.6
            });

            return analysis;
        } catch (error) {
            console.error('❌ Contest analysis failed:', error);
            return 'Unable to analyze contest performance at the moment. Focus on consistent practice and reviewing editorial solutions.';
        }
    }

    parseUserInput(message) {
        const content = message.content.toLowerCase();
        const profile = {
            level: 'Intermediate',
            experience: '1-2 years',
            dailyTime: '2-3 hours',
            preferredTopics: 'Algorithms, Data Structures',
            weakAreas: 'Dynamic Programming, Graph Theory',
            goals: 'Improve contest performance',
            rating: 'Intermediate (1200-1400)'
        };

        // Parse level
        if (content.includes('beginner') || content.includes('newbie')) {
            profile.level = 'Beginner';
            profile.rating = 'Beginner (800-1200)';
        } else if (content.includes('advanced') || content.includes('expert')) {
            profile.level = 'Advanced';
            profile.rating = 'Advanced (1600+)';
        }

        // Parse time availability
        if (content.includes('1 hour')) {
            profile.dailyTime = '1 hour';
        } else if (content.includes('4 hour') || content.includes('5 hour')) {
            profile.dailyTime = '4-5 hours';
        }

        // Parse specific topics mentioned
        const topics = [];
        if (content.includes('dp') || content.includes('dynamic')) topics.push('Dynamic Programming');
        if (content.includes('graph')) topics.push('Graph Theory');
        if (content.includes('tree')) topics.push('Trees');
        if (content.includes('greedy')) topics.push('Greedy Algorithms');
        if (content.includes('math')) topics.push('Mathematics');
        if (content.includes('string')) topics.push('String Algorithms');

        if (topics.length > 0) {
            profile.preferredTopics = topics.join(', ');
        }

        return profile;
    }
}

module.exports = AIStudyPlanner;
