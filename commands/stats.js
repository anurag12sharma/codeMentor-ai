const { EmbedBuilder } = require('discord.js');
const ContestManager = require('../utils/contestManager');

const contestManager = new ContestManager();

module.exports = {
    name: 'stats',
    description: 'Show contest statistics across all platforms',
    aliases: ['statistics', 'info'],
    cooldown: 60,
    async execute(message, args, client) {
        try {
            const stats = await contestManager.getContestStats();
            
            const embed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setTitle('📊 Contest Statistics')
                .setDescription('Here\'s an overview of contests across all supported platforms')
                .addFields([
                    {
                        name: '📈 General Stats',
                        value: `**Total Contests:** ${stats.total}\n` +
                               `**Upcoming:** ${stats.upcoming}\n` +
                               `**Currently Running:** ${stats.running}`,
                        inline: true
                    },
                    {
                        name: '🏢 By Platform',
                        value: Object.entries(stats.platforms)
                            .map(([platform, count]) => `**${platform}:** ${count}`)
                            .join('\n'),
                        inline: true
                    },
                    {
                        name: '🔄 Data Freshness',
                        value: `Last updated: <t:${Math.floor(contestManager.lastUpdate / 1000)}:R>\n` +
                               `Update interval: 5 minutes`,
                        inline: false
                    }
                ])
                .setFooter({ 
                    text: 'CodeMentor AI Contest Tracker',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();
            
            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in stats command:', error);
            message.reply('❌ Error fetching contest statistics. Please try again later.');
        }
    }
};
