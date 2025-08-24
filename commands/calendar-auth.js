const CalendarManager = require('../utils/calendarManager');

module.exports = {
    name: 'calendar-auth',
    description: 'Get authorization link to connect your Google Calendar',
    cooldown: 60,
    async execute(message, args, client) {
        try {
            const calendarManager = new CalendarManager();
            
            if (!calendarManager.isAvailable) {
                return message.reply(
                    '❌ **Google Calendar integration is not available in this environment.**\n\n' +
                    'Calendar features work in development mode only. Other features remain fully functional!'
                );
            }

            const url = await calendarManager.getAuthUrl();
            message.author.send(
                `Click this link to authorize me to access your Google Calendar:\n` + url +
                `\nAfter authorizing, send me your code with: !calendar-token <code>`
            );
            message.reply('✅ Check your DMs for the Google Calendar authorization link!');
            
        } catch (error) {
            console.error('Calendar auth command error:', error);
            message.reply(
                '❌ **Calendar integration unavailable in this environment.**\n' +
                'All other bot features work perfectly!'
            );
        }
    }
};
