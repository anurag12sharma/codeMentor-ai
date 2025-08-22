const { EmbedBuilder } = require("discord.js");
const ContestManager = require("../utils/contestManager");

const contestManager = new ContestManager();

module.exports = {
  name: "debug",
  description: "Debug real contest fetching",
  aliases: ["test", "check"],
  cooldown: 60,
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor(0xffa500)
      .setTitle("🔧 Debug: Fetching REAL Contest Data...")
      .setDescription("Testing real APIs and data sources...");

    const debugMsg = await message.reply({ embeds: [embed] });

    try {
      console.log("🔧 DEBUG: Force refreshing all contest data...");
      const contests = await contestManager.getAllContests(true);

      const debugInfo = [];
      debugInfo.push(`**Real contests found:** ${contests.length}`);
      debugInfo.push(
        `**Data freshness:** <t:${Math.floor(
          contestManager.lastUpdate / 1000
        )}:R>`
      );

      const platformBreakdown = {};
      contests.forEach((contest) => {
        platformBreakdown[contest.platform] =
          (platformBreakdown[contest.platform] || 0) + 1;
      });

      debugInfo.push("\n**Platform breakdown:**");
      Object.entries(platformBreakdown).forEach(([platform, count]) => {
        debugInfo.push(`• ${platform}: ${count} contests`);
      });

      debugInfo.push("\n**API Sources:**");
      debugInfo.push("• Codeforces: Direct API");
      debugInfo.push("• Others: CompeteAPI (competeapi.vercel.app)");

      debugInfo.push("\n**Data Quality Check:**");
      contests.slice(0, 3).forEach((contest, i) => {
        debugInfo.push(`${i + 1}. **${contest.name}**`);
        debugInfo.push(`   Platform: ${contest.platform}`);
        debugInfo.push(`   Start: ${contest.getFormattedStartTime()}`);
        debugInfo.push(
          `   URL Valid: ${contest.url.startsWith("http") ? "✅" : "❌"}`
        );
        debugInfo.push(`   Time Valid: ${contest.isUpcoming() ? "✅" : "❌"}`);
        debugInfo.push("");
      });

      debugInfo.push("\n**Next 5 REAL contests:**");
      contests.slice(0, 5).forEach((contest, i) => {
        debugInfo.push(`${i + 1}. **${contest.name}**`);
        debugInfo.push(`   Platform: ${contest.platform}`);
        debugInfo.push(`   Starts: ${contest.getRelativeTime()}`);
        debugInfo.push(`   URL: ${contest.url}`);
        debugInfo.push(
          `   Valid URL: ${contest.url.startsWith("http") ? "✅" : "❌"}`
        );
        debugInfo.push("");
      });

      const resultEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("🔧 Real Contest Debug Results")
        .setDescription(debugInfo.join("\n"))
        .setTimestamp();

      await debugMsg.edit({ embeds: [resultEmbed] });
    } catch (error) {
      console.error("Debug command error:", error);

      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("🔧 Debug Error")
        .setDescription(`**Error:** ${error.message}`)
        .setTimestamp();

      await debugMsg.edit({ embeds: [errorEmbed] });
    }
  },
};
