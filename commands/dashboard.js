const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'dashboard',
    description: 'View live contest data, bot statistics, and more!',
    aliases: ['info', 'bot'],
    cooldown: 10,
    execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🌐 CodeMentor AI Dashboard')
            .setDescription('View live contest data, bot statistics, and more!')
            .setURL('https://codementor-ai-production.up.railway.app/')
            .addFields([
                {
                    name: '📊 Features',
                    value: '• Live bot statistics\n• Upcoming contests\n• Platform breakdown\n• Real-time updates',
                    inline: true
                },
                {
                    name: '🔗 Quick Access',
                    value: '[Open Dashboard](https://codementor-ai-production.up.railway.app/)',
                    inline: true
                }
            ])
            .setFooter({ 
                text: 'Built for Global MCP Hackathon 2025', 
                iconURL: client.user.displayAvatarURL() 
            })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
};
