const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'server',
    description: 'Display server information',
    aliases: ['serverinfo', 'guild'],
    cooldown: 10,
    execute(message, args, client) {
        const guild = message.guild;
        
        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle(`📊 ${guild.name} - Server Info`)
            .setThumbnail(guild.iconURL())
            .addFields([
                {
                    name: '👑 Owner',
                    value: `<@${guild.ownerId}>`,
                    inline: true
                },
                {
                    name: '👥 Members',
                    value: guild.memberCount.toString(),
                    inline: true
                },
                {
                    name: '📅 Created',
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
                    inline: true
                },
                {
                    name: '🏠 Channels',
                    value: guild.channels.cache.size.toString(),
                    inline: true
                },
                {
                    name: '😀 Emojis', 
                    value: guild.emojis.cache.size.toString(),
                    inline: true
                },
                {
                    name: '🔒 Verification Level',
                    value: guild.verificationLevel.toString(),
                    inline: true
                }
            ])
            .setFooter({ 
                text: `Server ID: ${guild.id}` 
            })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
};
