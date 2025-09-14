const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Show all available commands",
  aliases: ["h", "commands"],
  cooldown: 5,
  execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("🤖 CodeMentor AI - Command List")
      .setDescription("Here are all my available commands:")
      .setThumbnail(client.user.displayAvatarURL())
      .addFields([
        {
          name: "🏓 Basic Commands",
          value:
            "`!ping` - Check bot latency\n`!status` - Check bot status\n`!help` - Show this help menu\n`!about` - Learn about CodeMentor AI",
          inline: false,
        },
        {
          name: "🏆 Contest Commands",
          value:  '`!contests` - View upcoming contests\n' +
                  '`!remind-on` — Enable contest reminders in this channel\n' +
                  '`!remind-off` — Disable contest reminders for this channel\n' +
                  '`!running` - View currently running contests\n' +
                  '`!search <level>` - Find contests for your level\n' +
                  '`!stats` - Get Contests Stats',
          inline: false,
        },
        {
          name: '📅 Calendar Integration',
          value: '`!calendar-auth` - Setup calendar (dev only)\n' +
                 '`!addcal <contest>` - Add to calendar (dev only)\n' +
                 '**Note**: Calendar features available in development mode',
          inline: false
        },
        {
          name: "🧠 AI-Powered Features",
          value:
            "`!schedule` - Get AI study plan\n" +
            "`!tip <topic>` - AI programming tips\n" +
            "`!recommend` - AI contest recommendations",
          inline: false,
        },
        {
          name: '🔗 Links',
          value: '`!dashboard` - View web dashboard\n' +
                 '`!server` - View Server Info\n',
          inline: false
        },
        {
          name: '🛠️ Debugging',
          value: '`!debug` - Check Contests APIs\n`!ai-test` - Check Google AI API',
          inline: false
        },
        {
          name: '🔐 Security Features (Hackathon)',
          value: '`!auth-status` - Check Descope authentication\n' +
                 '`!security` - View security status\n' +
                 '**All external APIs secured with Descope Outbound Apps**',
          inline: false
        }
      ])
      .setFooter({
        text: 'Need help? Visit our dashboard for more info!',
        icon_url: client.user.displayAvatarURL()
      })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
