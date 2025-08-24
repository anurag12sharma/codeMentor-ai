const CalendarManager = require('../utils/calendarManager');
const ContestManager = require('../utils/contestManager');

module.exports = {
    name: 'addcal',
    description: 'Add upcoming contest to your Google Calendar',
    cooldown: 30,
    usage: '!addcal <contest-name-or-index>',
    async execute(message, args, client) {
        try {
            const calendarManager = new CalendarManager();
            
            if (!calendarManager.isAvailable) {
                return message.reply(
                    '❌ **Google Calendar integration is not available in this environment.**\n\n' +
                    'This feature works in development mode only. You can still:\n' +
                    '• View contests with `!contests`\n' +
                    '• Get reminders with `!remind-on`\n' +
                    '• Use all AI features!'
                );
            }

            if (!args[0]) {
                return message.reply('❌ Please specify the contest name or index from `!contests`.');
            }

            const contestManager = new ContestManager();
            const contests = await contestManager.getUpcomingContests(10);
            let contest = contests.find(c =>
                c.name.toLowerCase().includes(args.join(' ').toLowerCase())
            );
            if (!contest && !isNaN(args[0])) {
                contest = contests[parseInt(args[0]) - 1];
            }
            if (!contest) return message.reply('❌ Contest not found.');

            await calendarManager.addContestToCalendar(contest);
            message.reply(`✅ Contest **${contest.name}** added to your Google Calendar!`);
            
        } catch (error) {
            console.error('Add calendar command error:', error);
            if (error.message.includes('not available')) {
                message.reply('❌ Calendar integration unavailable in this environment.');
            } else {
                message.reply('❌ Failed to add contest to calendar. ' + error.message);
            }
        }
    }
};
