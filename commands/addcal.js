const CalendarManager = require('../utils/calendarManager');
const ContestManager = require('../utils/contestManager');
const calendarManager = new CalendarManager();
const contestManager = new ContestManager();

module.exports = {
    name: 'addcal',
    description: 'Add upcoming contest to your Google Calendar',
    cooldown: 30,
    usage: '!addcal <contest-name-or-index>',
    async execute(message, args, client) {
        if (!args) {
            return message.reply('❌ Please specify the contest name or index from `!contests`.');
        }
        try {
            const contests = await contestManager.getUpcomingContests(10);
            let contest = contests.find(c =>
                c.name.toLowerCase().includes(args.join(' ').toLowerCase())
            );
            if (!contest && !isNaN(args)) {
                contest = contests[parseInt(args) - 1];
            }
            if (!contest) return message.reply('❌ Contest not found.');

            await calendarManager.addContestToCalendar(contest);
            message.reply(`✅ Contest **${contest.name}** added to your Google Calendar!`);
        } catch (error) {
            message.reply('❌ Failed to add contest to Google Calendar. Make sure you are authorized! Error:\n' + error.message);
        }
    }
};
