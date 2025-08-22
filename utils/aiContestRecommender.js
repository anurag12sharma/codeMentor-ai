const AIService = require('./aiService');
const { z } = require('zod');

const RecommendationSchema = z.object({
    recommendedContests: z.array(z.object({
        contestName: z.string(),
        platform: z.string(),
        difficulty: z.string(),
        reason: z.string(),
        preparationTips: z.array(z.string())
    })),
    generalAdvice: z.string(),
    practiceAreas: z.array(z.string())
});

class AIContestRecommender {
    constructor() {
        this.aiService = new AIService();
    }

    async recommendContests(userProfile, availableContests) {
        const contestList = availableContests.slice(0, 10).map(contest => 
            `- ${contest.name} (${contest.platform}) - ${contest.difficulty} - ${contest.getRelativeTime()}`
        ).join('\n');

        const prompt = `Based on this user's competitive programming profile, recommend the most suitable upcoming contests:

**User Profile:**
- Level: ${userProfile.level || 'Intermediate'}
- Experience: ${userProfile.experience || '1-2 years'}  
- Strengths: ${userProfile.strengths || 'Problem solving, Implementation'}
- Weak Areas: ${userProfile.weakAreas || 'Dynamic Programming, Advanced Math'}
- Goals: ${userProfile.goals || 'Improve rating and contest performance'}
- Available Time: ${userProfile.dailyTime || '2-3 hours per day'}

**Available Upcoming Contests:**
${contestList}

Provide recommendations considering:
1. User's current level and contest difficulty alignment
2. Contest timing and preparation time available
3. Platform-specific characteristics (Codeforces vs CodeChef vs AtCoder)
4. Specific preparation strategies for each recommended contest
5. Areas to focus on before the contest

Select 2-3 most suitable contests and explain why.`;

        try {
            const recommendations = await this.aiService.generateObject(
                prompt,
                RecommendationSchema,
                { maxTokens: 1500, temperature: 0.7 }
            );

            return recommendations;
        } catch (error) {
            console.error('❌ Contest recommendation failed:', error);
            return await this.generateTextRecommendations(userProfile, availableContests);
        }
    }

    async generateTextRecommendations(userProfile, contests) {
        try {
            const prompt = `Recommend 2-3 suitable contests for a ${userProfile.level} competitive programmer from these upcoming contests: ${contests.slice(0, 5).map(c => c.name).join(', ')}. Explain why each is suitable.`;
            
            const text = await this.aiService.generateText(prompt, {
                maxTokens: 600,
                temperature: 0.6
            });

            return {
                textRecommendation: text,
                isTextBased: true
            };
        } catch (error) {
            console.error('❌ Text recommendation failed:', error);
            return {
                textRecommendation: 'I recommend participating in contests that match your current level. Start with Div. 2/3 contests on Codeforces or beginner-friendly contests on CodeChef.',
                isTextBased: true
            };
        }
    }

    async generateContestStrategy(contestInfo, userLevel) {
        const prompt = `Create a contest strategy for "${contestInfo.name}" on ${contestInfo.platform}:

Contest Details:
- Platform: ${contestInfo.platform}
- Duration: ${contestInfo.getFormattedDuration()}
- Difficulty: ${contestInfo.difficulty}
- User Level: ${userLevel}

Provide:
1. Pre-contest preparation (what to review/practice)
2. During-contest strategy (problem order, time management)
3. Common pitfalls to avoid for this type of contest
4. Platform-specific tips (if any)
5. Post-contest analysis recommendations

Keep advice practical and specific to competitive programming.`;

        try {
            const strategy = await this.aiService.generateText(prompt, {
                maxTokens: 1000,
                temperature: 0.6
            });

            return strategy;
        } catch (error) {
            console.error('❌ Contest strategy generation failed:', error);
            return `For ${contestInfo.name}, focus on: 1) Reading all problems first, 2) Solving easier problems quickly, 3) Managing time effectively, 4) Testing your solutions thoroughly.`;
        }
    }
}

module.exports = AIContestRecommender;
