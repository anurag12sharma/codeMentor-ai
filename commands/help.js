const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Show all available commands',
    aliases: ['h', 'commands'],
    cooldown: 5,
    execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🤖 CodeMentor AI - Command List')
            .setDescription('Here are all my available commands:')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields([
                {
                    name: '🏓 Basic Commands',
                    value: '`!ping` - Check bot latency\n`!help` - Show this help menu\n`!about` - Learn about CodeMentor AI',
                    inline: false
                },
                {
                    name: '🏆 Contest Commands',
                    value: '`!contests` - View upcoming contests\n`!remind` - Set contest reminders',
                    inline: false
                },
                {
                    name: '📚 Study Commands', 
                    value: '`!schedule` - Get AI study plan\n`!tip` - Get programming tips',
                    inline: false
                },
                {
                    name: '⚙️ Settings',
                    value: '`!prefix` - Change command prefix\n`!config` - Bot configuration',
                    inline: false
                }
            ])
            .setFooter({ 
                text: `Requested by ${message.author.username}`, 
                iconURL: message.author.displayAvatarURL() 
            })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
};
