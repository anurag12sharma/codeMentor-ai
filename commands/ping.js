const { infoEmbed } = require('../utils/embedBuilder');

module.exports = {
    name: 'ping',
    description: 'Check bot latency and status',
    aliases: ['p', 'latency'],
    cooldown: 3,
    execute(message, args, client) {
        const embed = infoEmbed('🏓 Pong!', 
            `**Bot Latency:** ${Date.now() - message.createdTimestamp}ms\n` +
            `**API Latency:** ${Math.round(client.ws.ping)}ms\n` +
            `**Status:** Online ✅`
        );
        
        message.reply({ embeds: [embed] });
    }
};
