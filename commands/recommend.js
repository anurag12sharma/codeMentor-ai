const { EmbedBuilder } = require('discord.js');
const AIContestRecommender = require('../utils/aiContestRecommender');
const ContestManager = require('../utils/contestManager');
const { errorEmbed, infoEmbed } = require('../utils/embedBuilder');

const recommender = new AIContestRecommender();
const contestManager = new ContestManager();

module.exports = {
    name: 'recommend',
    description: 'Get AI-powered contest recommendations',
    aliases: ['rec', 'suggest', 'which-contest'],
    cooldown: 180, // 3 minutes cooldown
    usage: '!recommend [beginner|intermediate|advanced]',
    async execute(message, args, client) {
        const loadingEmbed = infoEmbed(
            '🤖 AI Contest Recommender',
            'Analyzing upcoming contests and your profile to provide personalized recommendations...\n\n' +
            '⏱️ This may take 15-30 seconds!'
        );
        
        const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            // Get upcoming contests
            console.log('📊 Fetching upcoming contests...');
            const contests = await contestManager.getUpcomingContests(15);
            
            if (contests.length === 0) {
                const noContestsEmbed = errorEmbed(
                    'No Contests Found',
                    'No upcoming contests available for recommendations right now.'
                );
                return loadingMsg.edit({ embeds: [noContestsEmbed] });
            }

            // Parse user level
            let userLevel = 'Intermediate';
            if (args.length > 0) {
                const level = args[0].toLowerCase();
                if (['beginner', 'intermediate', 'advanced'].includes(level)) {
                    userLevel = level.charAt(0).toUpperCase() + level.slice(1);
                }
            }

            // Create user profile
            const userProfile = {
                level: userLevel,
                experience: userLevel === 'Beginner' ? '0-1 years' : 
                           userLevel === 'Advanced' ? '3+ years' : '1-3 years',
                strengths: userLevel === 'Beginner' ? 'Basic algorithms' :
                          userLevel === 'Advanced' ? 'Complex algorithms, optimization' : 'Standard algorithms',
                weakAreas: userLevel === 'Beginner' ? 'Advanced topics' :
                          userLevel === 'Advanced' ? 'Contest speed' : 'Advanced data structures',
                goals: 'Improve contest performance',
                dailyTime: '2-3 hours'
            };

            console.log(`🧠 Generating recommendations for ${userLevel} user...`);
            const recommendations = await recommender.recommendContests(userProfile, contests);

            if (recommendations.isTextBased) {
                // Handle text-based recommendations
                const textEmbed = new EmbedBuilder()
                    .setColor(0xE74C3C)
                    .setTitle('🎯 AI Contest Recommendations')
                    .setDescription(recommendations.textRecommendation)
                    .addFields({
                        name: '📅 Available Contests',
                        value: contests.slice(0, 5).map(c => 
                            `• **${c.name}** (${c.platform}) - ${c.getRelativeTime()}`
                        ).join('\n')
                    })
                    .setFooter({ text: `Recommendations for ${userLevel} level` })
                    .setTimestamp();

                return loadingMsg.edit({ embeds: [textEmbed] });
            }

            // Handle structured recommendations
            const recEmbed = new EmbedBuilder()
                .setColor(0xE74C3C)
                .setTitle('🎯 AI Contest Recommendations')
                .setDescription(`**Level:** ${userLevel}\n` +
                               `**Analysis:** ${recommendations.generalAdvice}`)
                .setThumbnail(client.user.displayAvatarURL());

            // Add recommended contests
            if (recommendations.recommendedContests) {
                recommendations.recommendedContests.forEach((rec, index) => {
                    recEmbed.addFields({
                        name: `${index + 1}. ${rec.contestName} (${rec.platform})`,
                        value: `**Why:** ${rec.reason}\n` +
                               `**Prep Tips:** ${rec.preparationTips.slice(0, 2).join(', ')}`,
                        inline: false
                    });
                });
            }

            // Add practice areas
            if (recommendations.practiceAreas && recommendations.practiceAreas.length > 0) {
                recEmbed.addFields({
                    name: '📚 Focus Areas',
                    value: recommendations.practiceAreas.slice(0, 4).map(area => `• ${area}`).join('\n'),
                    inline: false
                });
            }

            recEmbed.setFooter({ 
                text: 'AI-Generated Recommendations • Good luck!',
                iconURL: client.user.displayAvatarURL()
            }).setTimestamp();

            await loadingMsg.edit({ embeds: [recEmbed] });

        } catch (error) {
            console.error('❌ Recommend command error:', error);
            
            const fallbackEmbed = errorEmbed(
                'Recommendation Error',
                'Sorry, I had trouble generating recommendations. Here are some general tips:\n\n' +
                '**For Beginners:** Try Codeforces Div. 3/4, CodeChef Starters\n' +
                '**For Intermediate:** Codeforces Div. 2, CodeChef Cook-Off\n' +
                '**For Advanced:** Codeforces Div. 1, AtCoder contests\n\n' +
                'Use `!contests` to see all upcoming contests!'
            );
            
            await loadingMsg.edit({ embeds: [fallbackEmbed] });
        }
    }
};
