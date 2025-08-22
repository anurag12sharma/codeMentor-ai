const CalendarManager = require('../utils/calendarManager');
const calendarManager = new CalendarManager();

module.exports = {
    name: 'calendar-auth',
    description: 'Get authorization link to connect your Google Calendar',
    cooldown: 60,
    async execute(message, args, client) {
        const url = await calendarManager.getAuthUrl();
        message.author.send(
            `Click this link to authorize me to access your Google Calendar:\n` + url +
            `\nAfter authorizing, send me your code with: !calendar-token <code>`
        );
        message.reply('✅ Check your DMs for the Google Calendar authorization link!');
    }
};
