module.exports = {
    // Check if user has required permissions
    hasPermission: (member, permission) => {
        return member.permissions.has(permission);
    },
    
    // Check if bot has required permissions
    botHasPermission: (guild, permission) => {
        return guild.members.me.permissions.has(permission);
    },
    
    // Validate command arguments
    validateArgs: (args, minArgs, maxArgs = null) => {
        if (args.length < minArgs) {
            return { valid: false, error: `This command requires at least ${minArgs} arguments.` };
        }
        if (maxArgs && args.length > maxArgs) {
            return { valid: false, error: `This command accepts at most ${maxArgs} arguments.` };
        }
        return { valid: true };
    },
    
    // Check if command can be used in DMs
    allowedInDM: (command, message) => {
        if (command.guildOnly && !message.guild) {
            return { allowed: false, error: 'This command can only be used in servers.' };
        }
        return { allowed: true };
    }
};
