module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        // Ignore bot messages
        if (message.author.bot) return;
        
        // Set command prefix
        const prefix = '!';
        
        // Check if message starts with prefix
        if (!message.content.startsWith(prefix)) return;
        
        // Parse command and arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        // Get command from collection
        const command = client.commands.get(commandName) || 
                       client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
        if (!command) return;
        
        // Add cooldown check (optional but good practice)
        if (!client.cooldowns) client.cooldowns = new Map();
        
        if (!client.cooldowns.has(command.name)) {
            client.cooldowns.set(command.name, new Map());
        }
        
        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`⏰ Please wait ${timeLeft.toFixed(1)} seconds before using \`${command.name}\` again.`);
            }
        }
        
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        
        // Execute command with error handling
        try {
            command.execute(message, args, client);
        } catch (error) {
            console.error('❌ Error executing command:', error);
            message.reply('❌ Sorry, there was an error executing that command!');
        }
    }
};
