// Load environment variables
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// When bot comes online
client.once('ready', () => {
    console.log(`🤖 CodeMentor AI is online! Logged in as ${client.user.tag}`);
});

// Listen for messages
client.on('messageCreate', message => {
    // Don't respond to other bots
    if (message.author.bot) return;
    
    // Simple ping command
    if (message.content.toLowerCase() === '!ping') {
        message.reply('🏓 Pong! CodeMentor AI is working perfectly!');
    }
    
    // Welcome message
    if (message.content.toLowerCase() === '!hello') {
        message.reply('👋 Hello! I am CodeMentor AI, your competitive programming assistant!');
    }
});

// Start the bot
client.login(process.env.DISCORD_TOKEN);
