const { EmbedBuilder } = require('discord.js');
const ContestManager = require('../utils/contestManager');
const { validateArgs } = require('../utils/validation');

const contestManager = new ContestManager();

module.exports = {
    name: 'search',
    description: 'Search for contests by name or platform',
    aliases: ['find', 'lookup'],
    cooldown: 30,
    usage: '!search <query>',
    execute(message, args, client) {
        // Validate arguments
        const validation = validateArgs(args, 1);
        if (!validation.valid) {
            return message.reply(`❌ ${validation.error}\nUsage: \`!search <query>\`\nExample: \`!search div 2\``);
        }

        const query = args.join(' ');
        
        const searchEmbed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('🔍 Searching Contests...')
            .setDescription(`Looking for contests matching: **${query}**`);
        
        message.reply({ embeds: [searchEmbed] }).then(async searchMsg => {
            try {
                const results = await contestManager.searchContests(query);
                
                if (results.length === 0) {
                    const noResultsEmbed = new EmbedBuilder()
                        .setColor(0xE67E22)
                        .setTitle('🔍 No Results Found')
                        .setDescription(`No contests found matching: **${query}**`)
                        .addFields({
                            name: '💡 Search Tips',
                            value: '• Try broader terms (e.g., "div" instead of "division")\n' +
                                   '• Search by platform name (e.g., "codeforces")\n' +
                                   '• Use partial names (e.g., "cook" for Cook-Off)'
                        });
                    
                    return searchMsg.edit({ embeds: [noResultsEmbed] });
                }

                const resultsEmbed = new EmbedBuilder()
                    .setColor(0x27AE60)
                    .setTitle('🎯 Search Results')
                    .setDescription(`Found ${results.length} contest(s) matching: **${query}**`)
                    .setTimestamp();

                // Limit results to avoid Discord's field limit
                const limitedResults = results.slice(0, 10);
                
                limitedResults.forEach(contest => {
                    const status = contest.isRunning() ? '🔴 LIVE' : 
                                  contest.status === 'UPCOMING' ? '🟡 UPCOMING' : '⚪ FINISHED';
                    
                    resultsEmbed.addFields({
                        name: `${status} ${contest.name}`,
                        value: `**Platform:** ${contest.platform}\n` +
                               `**Starts:** ${contest.getRelativeTime()}\n` +
                               `**Duration:** ${contest.getFormattedDuration()}\n` +
                               `**Link:** [View Contest](${contest.url})`,
                        inline: true
                    });
                });

                if (results.length > 10) {
                    resultsEmbed.setFooter({ 
                        text: `Showing first 10 results out of ${results.length}` 
                    });
                }

                await searchMsg.edit({ embeds: [resultsEmbed] });

            } catch (error) {
                console.error('Error in search command:', error);
                
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xE74C3C)
                    .setTitle('❌ Search Error')
                    .setDescription('Sorry, an error occurred while searching. Please try again later.');
                
                await searchMsg.edit({ embeds: [errorEmbed] });
            }
        });
    }
};
