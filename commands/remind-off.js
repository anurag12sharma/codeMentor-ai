module.exports = {
    name: 'remind-off',
    description: 'Disable contest reminders for this channel',
    cooldown: 15,
    async execute(message, args, client) {
        const reminderSystem = client.reminderSystem || require('../utils/reminderSystemInstance');
        reminderSystem.removeReminderChannel(message.channel.id);
        message.reply('❌ This channel will no longer receive contest reminders.');
    }
};
