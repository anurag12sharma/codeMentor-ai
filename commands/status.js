const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'status', 
    description: 'Show bot system status',
    aliases: ['stats', 'uptime'],
    cooldown: 30,
    execute(message, args, client) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);
        
        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('📊 CodeMentor AI System Status')
            .addFields([
                {
                    name: '⏰ Uptime',
                    value: uptimeString,
                    inline: true
                },
                {
                    name: '💾 Memory Usage',
                    value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`,
                    inline: true
                },
                {
                    name: '📡 Ping',
                    value: `${client.ws.ping}ms`,
                    inline: true
                },
                {
                    name: '🏠 Servers',
                    value: client.guilds.cache.size.toString(),
                    inline: true
                },
                {
                    name: '👥 Users',
                    value: client.users.cache.size.toString(), 
                    inline: true
                },
                {
                    name: '💻 Node.js',
                    value: process.version,
                    inline: true
                }
            ])
            .setFooter({ text: 'All systems operational ✅' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
};
