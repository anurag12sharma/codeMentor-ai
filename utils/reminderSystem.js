const cron = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const ContestManager = require('./contestManager');

class ReminderSystem {
    constructor(client) {
        this.client = client;
        this.contestManager = new ContestManager();
        this.reminderChannels = new Set(); // Store channel IDs that want reminders
        this.remindTimes = [60, 10]; // Remind 60 mins and 10 mins before contest
    }

    addReminderChannel(channelId) {
        this.reminderChannels.add(channelId);
    }

    removeReminderChannel(channelId) {
        this.reminderChannels.delete(channelId);
    }

    start() {
        // Check every 2 minutes
        cron.schedule('*/2 * * * *', () => this.checkContests());
        console.log('⏰ Reminder system scheduled every 2 minutes');
    }

    async checkContests() {
        const contests = await this.contestManager.getUpcomingContests(10);
        if (contests.length === 0) return;

        const now = Date.now();

        for (const contest of contests) {
            const msToStart = contest.startTime.getTime() - now;
            for (const aheadMinutes of this.remindTimes) {
                // trigger if it's X minutes away (2 min margin for cron!)
                if (msToStart < aheadMinutes * 60000 + 60000 && msToStart > aheadMinutes * 60000 - 60000) {
                    await this.sendReminder(contest, aheadMinutes);
                }
            }
        }
    }

    async sendReminder(contest, aheadMinutes) {
        const embed = new EmbedBuilder()
            .setColor(0x00BFAE)
            .setTitle('⏰ Contest Reminder!')
            .setDescription(`**${contest.name}** on **${contest.platform}** starts in **${aheadMinutes} minutes!**`)
            .addFields(
                { name: 'Starts At', value: contest.getFormattedStartTime(), inline: true },
                { name: 'Duration', value: contest.getFormattedDuration(), inline: true }
            )
            .addFields(
                { name: 'Link', value: `[Open Contest](${contest.url})`, inline: false }
            )
            .setFooter({ text: 'Set reminders with !remind-on in this channel.' })
            .setTimestamp();

        // Broadcast to all registered channels
        for (const channelId of this.reminderChannels) {
            try {
                const channel = await this.client.channels.fetch(channelId);
                if (channel) await channel.send({ embeds: [embed] });
            } catch (err) {
                console.error(`❌ Failed to send reminder to channel ${channelId}:`, err);
            }
        }
    }
}

module.exports = ReminderSystem;
