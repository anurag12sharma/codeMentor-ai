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
            "`!ping` - Check bot latency\n`!help` - Show this help menu\n`!about` - Learn about CodeMentor AI",
          inline: false,
        },
        {
          name: "🏆 Contest Commands",
          value:
            "`!contests` - View upcoming contests\n`!remind-on` — Enable contest reminders in this channel\n`!remind-off` — Disable contest reminders for this channel\n`!calendar-auth` — Connect your Google Calendar\n`!addcal <contest>` — Add contest to your Google Calendar",
          inline: false,
        },
        {
          name: "📚 Study Commands",
          value:
            "`!schedule` - Get AI study plan\n`!tip` - Get programming tips",
          inline: false,
        },
        {
          name: "⚙️ Settings",
          value:
            "`!prefix` - Change command prefix\n`!config` - Bot configuration",
          inline: false,
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
          name: '🔐 Security Features (Hackathon)',
          value: '`!auth-status` - Check Descope authentication\n' +
                 '`!security` - View security status\n' +
                 '**All external APIs secured with Descope Outbound Apps**',
          inline: false
      }
      ])
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
