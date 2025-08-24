const { EmbedBuilder } = require("discord.js");
const ContestManager = require("../utils/contestManager");
const { ContestPlatform } = require("../utils/contestTypes");
const ErrorHandler = require("../utils/errorHandler");
const InputValidator = require("../utils/inputValidator");
const errorHandler = new ErrorHandler();

const contestManager = new ContestManager();

module.exports = {
  name: "contests",
  description: "View upcoming programming contests",
  aliases: ["contest", "upcoming", "c"],
  cooldown: 30,
  async execute(message, args, client) {
    try {
      // Rate limiting check
      const rateLimit = InputValidator.checkRateLimit(
        message.author.id,
        "contests",
        3,
        60000
      );
      if (!rateLimit.allowed) {
        return message.reply(
          `⏰ Please wait ${rateLimit.resetTime} seconds before using this command again.`
        );
      }
      
      const loadingEmbed = new EmbedBuilder()
        .setColor(0xffff00)
        .setTitle("🔍 Fetching Contests...")
        .setDescription(
          "Getting the latest contest information from all platforms..."
        );

      const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

      try {
        // Parse arguments for filtering
        let platform = null;
        let limit = 8;

        if (args.length > 0) {
          const firstArg = args[0].toLowerCase();
          if (firstArg === "codeforces" || firstArg === "cf") {
            platform = ContestPlatform.CODEFORCES;
          } else if (firstArg === "codechef" || firstArg === "cc") {
            platform = ContestPlatform.CODECHEF;
          } else if (firstArg === "hackerearth" || firstArg === "he") {
            platform = ContestPlatform.HACKEREARTH;
          } else if (firstArg === "leetcode" || firstArg === "lc") {
            platform = ContestPlatform.LEETCODE;
          } else if (!isNaN(firstArg)) {
            limit = Math.min(parseInt(firstArg), 15);
          }
        }

        // Get contests
        let contests;
        if (platform) {
          contests = (await contestManager.getContestsByPlatform(platform))
            .filter((c) => c.status === "UPCOMING")
            .slice(0, limit);
        } else {
          contests = await contestManager.getUpcomingContests(limit);
        }

        if (contests.length === 0) {
          const noContestsEmbed = new EmbedBuilder()
            .setColor(0xff6b6b)
            .setTitle("😔 No Upcoming Contests")
            .setDescription(
              platform
                ? `No upcoming contests found on ${platform}.`
                : "No upcoming contests found on any platform."
            )
            .setFooter({
              text: "Try again later or check individual platforms",
            });

          return loadingMsg.edit({ embeds: [noContestsEmbed] });
        }

        // Create main embed
        const contestsEmbed = new EmbedBuilder()
          .setColor(0x9b59b6)
          .setTitle("🏆 Upcoming Programming Contests")
          .setDescription(
            platform
              ? `Showing next ${contests.length} contests from **${platform}**`
              : `Showing next ${contests.length} contests from all platforms`
          )
          .setThumbnail("https://i.imgur.com/Contest-Icon.png")
          .setFooter({
            text: `CodeMentor AI • Use !contest <platform> to filter • Last updated`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

        // Add contest fields
        contests.forEach((contest, index) => {
          const timeUntil = contest.getTimeUntilStart();
          let timeString;

          if (timeUntil <= 0) {
            timeString = "🔴 **STARTING NOW!**";
          } else if (timeUntil < 60) {
            timeString = `⏰ in ${timeUntil} minutes`;
          } else if (timeUntil < 1440) {
            // Less than 24 hours
            timeString = `⏰ in ${Math.floor(timeUntil / 60)} hours`;
          } else {
            timeString = `📅 ${contest.getRelativeTime()}`;
          }

          // Platform emoji
          const platformEmoji =
            {
              [ContestPlatform.CODEFORCES]: "🔵",
              [ContestPlatform.CODECHEF]: "🟡",
              [ContestPlatform.HACKEREARTH]: "🟢",
              [ContestPlatform.LEETCODE]: "🟠",
            }[contest.platform] || "⚪";

          contestsEmbed.addFields({
            name: `${platformEmoji} ${contest.name}`,
            value:
              `**Platform:** ${contest.platform}\n` +
              `**Duration:** ${contest.getFormattedDuration()}\n` +
              `**Starts:** ${timeString}\n` +
              `**Link:** [Join Contest](${contest.url})`,
            inline: true,
          });
        });

        await loadingMsg.edit({ embeds: [contestsEmbed] });
      } catch (error) {
        console.error("Error in contests command:", error);

        const errorEmbed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle("❌ Error Fetching Contests")
          .setDescription(
            "Sorry, I encountered an error while fetching contest data. Please try again later."
          )
          .addFields({
            name: "Available Commands",
            value:
              "`!contests` - All upcoming contests\n`!contests cf` - Codeforces only\n`!contests cc` - CodeChef only",
          });

        await loadingMsg.edit({ embeds: [errorEmbed] });
      }
    } catch (error) {
      console.error("Contests command error:", error);
      const errorEmbed = errorHandler.handleBotError(
        error,
        "fetching contests"
      );
      await message.reply({ embeds: [errorEmbed] });
    }
  },
};
