module.exports = {
    name: 'remind-on',
    description: 'Enable contest reminders in this channel',
    cooldown: 15,
    async execute(message, args, client) {
        const reminderSystem = client.reminderSystem || require('../utils/reminderSystemInstance');
        reminderSystem.addReminderChannel(message.channel.id);
        message.reply('✅ This channel will now receive upcoming contest reminders!');
    }
};
