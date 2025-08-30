module.exports = {
    name: 'clientReady',
    once: true,
    execute(client) {
        console.log(`🤖 CodeMentor AI is online!`);
        console.log(`📊 Logged in as ${client.user.tag}`);
        console.log(`🏠 Serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Watching ${client.users.cache.size} users`);
        
        // Set bot status
        client.user.setPresence({
            activities: [{
                name: 'competitive programming contests 🏆',
                type: 3 // Watching
            }],
            status: 'online'
        });

        client.reminderSystem.start();
        const { setBotClient } = require('../web/server');
        setBotClient(client);
        console.log('🌐 Web dashboard connected to bot');
    }
};
