const { EmbedBuilder } = require('discord.js');
const ContestManager = require('../utils/contestManager');

const contestManager = new ContestManager();

module.exports = {
    name: 'running',
    description: 'View currently running contests',
    aliases: ['live', 'active', 'now'],
    cooldown: 60,
    async execute(message, args, client) {
        try {
            const contests = await contestManager.getRunningContests();
            
            if (contests.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0x95A5A6)
                    .setTitle('😴 No Running Contests')
                    .setDescription('There are no contests currently running.')
                    .addFields({
                        name: '💡 Tip',
                        value: 'Use `!contests` to see upcoming contests!'
                    })
                    .setTimestamp();
                
                return message.reply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor(0xE74C3C)
                .setTitle('🔴 Currently Running Contests')
                .setDescription(`${contests.length} contest(s) are currently active!`)
                .setTimestamp();

            contests.forEach(contest => {
                const timeRemaining = contest.getTimeUntilEnd();
                let timeString;
                
                if (timeRemaining <= 0) {
                    timeString = '🔴 **ENDING SOON!**';
                } else if (timeRemaining < 60) {
                    timeString = `⏱️ ${timeRemaining} minutes left`;
                } else {
                    timeString = `⏱️ ${Math.floor(timeRemaining / 60)} hours left`;
                }

                embed.addFields({
                    name: `🏃‍♂️ ${contest.name}`,
                    value: `**Platform:** ${contest.platform}\n` +
                           `**Duration:** ${contest.getFormattedDuration()}\n` +
                           `**Time Left:** ${timeString}\n` +
                           `**Link:** [Join Now!](${contest.url})`,
                    inline: false
                });
            });

            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in running command:', error);
            message.reply('❌ Error fetching running contests. Please try again later.');
        }
    }
};
