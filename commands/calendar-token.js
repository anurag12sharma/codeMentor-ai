const CalendarManager = require('../utils/calendarManager');
const calendarManager = new CalendarManager();

module.exports = {
    name: 'calendar-token',
    description: 'Set your Google Calendar OAuth token',
    cooldown: 60,
    usage: '!calendar-token <code>',
    async execute(message, args, client) {
        if (!args[0]) {
            return message.reply('❌ Please supply the code you received after authorizing.');
        }
        try {
            const { tokens } = await calendarManager.oAuth2Client.getToken(args[0]);
            await calendarManager.setToken(tokens);
            message.reply('✅ Google Calendar connected successfully! You can now add contests.');
        } catch (error) {
            console.error('Failed to save the token:', error);
            message.reply('❌ Failed to save the token. Try again.');
        }
    }
};
