const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'about',
    description: 'Learn about CodeMentor AI',
    aliases: ['info', 'bot'],
    cooldown: 10,
    execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle('🤖 About CodeMentor AI')
            .setDescription('Your intelligent competitive programming assistant!')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields([
                {
                    name: '🎯 Purpose',
                    value: 'Help competitive programmers stay organized with contests, study schedules, and AI-powered assistance.',
                    inline: false
                },
                {
                    name: '🚀 Features',
                    value: '• Contest tracking and reminders\n• AI-generated study plans\n• Programming tips and guidance\n• Calendar integration\n• Smart notifications',
                    inline: false
                },
                {
                    name: '📊 Statistics',
                    value: `• Servers: ${client.guilds.cache.size}\n• Users: ${client.users.cache.size}\n• Uptime: ${Math.floor(client.uptime / 1000 / 60)} minutes`,
                    inline: true
                },
                {
                    name: '💻 Technology',
                    value: '• Discord.js v14\n• Node.js\n• Google AI API\n• Descope Auth',
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
