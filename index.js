// Load environment variables
require('dotenv').config();

const ReminderSystem = require('./utils/reminderSystem');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const { setBotClient } = require('./web/server');

// Create Discord client with proper intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const reminderSystem = new ReminderSystem(client);
// Attach to client for use in commands:
client.reminderSystem = reminderSystem;


// Create a collection to store commands
client.commands = new Collection();

// Load commands dynamically
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`✅ Loaded command: ${command.name}`);
}

// Load events dynamically  
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`✅ Loaded event: ${event.name}`);
}

// Global error handling
process.on('unhandledRejection', error => {
    console.error('🚨 Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('🚨 Uncaught exception:', error);
    process.exit(1);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
