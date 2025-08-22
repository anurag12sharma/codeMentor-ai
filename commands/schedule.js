const { EmbedBuilder } = require('discord.js');
const AIStudyPlanner = require('../utils/aiStudyPlanner');
const { errorEmbed, infoEmbed } = require('../utils/embedBuilder');

const studyPlanner = new AIStudyPlanner();

module.exports = {
    name: 'schedule',
    description: 'Get an AI-generated personalized study schedule',
    aliases: ['plan', 'study', 'studyplan'],
    cooldown: 120, // 2 minutes cooldown due to AI usage
    usage: '!schedule [beginner|intermediate|advanced]',
    async execute(message, args, client) {
        const loadingEmbed = infoEmbed(
            '🧠 AI Study Planner Working...',
            'Creating your personalized competitive programming study schedule...\n\n' +
            '⏱️ This may take 10-30 seconds, please wait!'
        );
        
        const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            // Parse user profile from message
            const userProfile = studyPlanner.parseUserInput(message);
            
            // Override with any specific arguments
            if (args.length > 0) {
                const level = args[0].toLowerCase();
                if (['beginner', 'intermediate', 'advanced'].includes(level)) {
                    userProfile.level = level.charAt(0).toUpperCase() + level.slice(1);
                }
            }

            console.log(`🧠 Generating study plan for ${userProfile.level} user...`);
            const studyPlan = await studyPlanner.generateStudyPlan(userProfile);

            if (studyPlan.isTextBased) {
                // Handle text-based fallback
                const textEmbed = new EmbedBuilder()
                    .setColor(0x9B59B6)
                    .setTitle('📚 Your AI-Generated Study Plan')
                    .setDescription(studyPlan.textPlan.substring(0, 2000))
                    .setFooter({ 
                        text: `Generated for ${userProfile.level} level • ${userProfile.dailyTime} daily`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp();

                return loadingMsg.edit({ embeds: [textEmbed] });
            }

            // Handle structured study plan
            const planEmbed = new EmbedBuilder()
                .setColor(0x9B59B6)
                .setTitle('📚 Your AI-Generated Study Plan')
                .setDescription(`**Weekly Goal:** ${studyPlan.weeklyGoal}\n\n` +
                               `**Customized for:** ${userProfile.level} level\n` +
                               `**Daily Time:** ${userProfile.dailyTime}`)
                .setThumbnail(client.user.displayAvatarURL());

            // Add daily schedule (first 4 days to fit Discord limits)
            if (studyPlan.dailySchedule && studyPlan.dailySchedule.length > 0) {
                studyPlan.dailySchedule.slice(0, 4).forEach(day => {
                    planEmbed.addFields({
                        name: `${day.day} - ${day.focusArea}`,
                        value: `**Tasks:** ${day.tasks.slice(0, 2).join(', ')}\n` +
                               `**Problems:** ${day.problemsToSolve} problems\n` +
                               `**Time:** ${day.estimatedTime}`,
                        inline: true
                    });
                });
            }

            // Add focus topics
            if (studyPlan.topicsToFocus && studyPlan.topicsToFocus.length > 0) {
                const highPriorityTopics = studyPlan.topicsToFocus
                    .filter(topic => topic.priority === 'high')
                    .slice(0, 3)
                    .map(topic => `• **${topic.topic}**: ${topic.reason}`)
                    .join('\n');

                if (highPriorityTopics) {
                    planEmbed.addFields({
                        name: '🎯 Priority Focus Areas',
                        value: highPriorityTopics,
                        inline: false
                    });
                }
            }

            // Add practice recommendations
            if (studyPlan.practiceRecommendations && studyPlan.practiceRecommendations.length > 0) {
                planEmbed.addFields({
                    name: '💡 Practice Tips',
                    value: studyPlan.practiceRecommendations.slice(0, 3).join('\n• '),
                    inline: false
                });
            }

            planEmbed.setFooter({ 
                text: 'AI-Generated Study Plan • Adjust based on your progress',
                iconURL: client.user.displayAvatarURL()
            }).setTimestamp();

            await loadingMsg.edit({ embeds: [planEmbed] });

        } catch (error) {
            console.error('❌ Schedule command error:', error);
            
            const failureEmbed = errorEmbed(
                'AI Study Planner Error',
                'Sorry, I encountered an error generating your study plan. Please try again later.\n\n' +
                '**In the meantime, here are general tips:**\n' +
                '• Practice 2-3 problems daily\n' +
                '• Focus on one topic per week\n' +
                '• Review contest editorials\n' +
                '• Participate in virtual contests'
            );
            
            await loadingMsg.edit({ embeds: [failureEmbed] });
        }
    }
};
