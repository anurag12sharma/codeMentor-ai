const { EmbedBuilder } = require('discord.js');
const AIStudyPlanner = require('../utils/aiStudyPlanner');
const { errorEmbed, infoEmbed } = require('../utils/embedBuilder');
const { validateArgs } = require('../utils/validation');

const studyPlanner = new AIStudyPlanner();

module.exports = {
    name: 'tip',
    description: 'Get AI-powered programming tips for specific topics',
    aliases: ['tips', 'advice', 'help-topic'],
    cooldown: 60,
    usage: '!tip <topic>',
    async execute(message, args, client) {
        // Validate arguments
        const validation = validateArgs(args, 1);
        if (!validation.valid) {
            const helpEmbed = errorEmbed(
                'Missing Topic',
                `${validation.error}\n\n**Usage:** \`!tip <topic>\`\n\n` +
                '**Examples:**\n' +
                '• `!tip dynamic programming`\n' +
                '• `!tip graphs`\n' +
                '• `!tip binary search`\n' +
                '• `!tip greedy algorithms`'
            );
            return message.reply({ embeds: [helpEmbed] });
        }

        const topic = args.join(' ');
        
        const loadingEmbed = infoEmbed(
            '💡 AI Tip Generator',
            `Getting personalized tips about **${topic}**...\n\n⏱️ Please wait while I analyze the topic!`
        );
        
        const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            console.log(`🧠 Generating programming tip for: ${topic}`);
            const tip = await studyPlanner.generateProgrammingTip(topic);

            const tipEmbed = new EmbedBuilder()
                .setColor(0x00D2B4)
                .setTitle(`💡 AI Tip: ${topic}`)
                .setDescription(tip)
                .addFields({
                    name: '🎯 Next Steps',
                    value: `• Practice problems on [Codeforces](https://codeforces.com/problemset)\n` +
                           `• Check [CP-Algorithms](https://cp-algorithms.com) for theory\n` +
                           `• Try contest problems tagged with "${topic}"`
                })
                .setFooter({ 
                    text: 'AI-Generated Programming Tip • Practice makes perfect!',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            await loadingMsg.edit({ embeds: [tipEmbed] });

        } catch (error) {
            console.error('❌ Tip command error:', error);
            
            const fallbackTips = {
                'dynamic programming': 'Break problems into subproblems. Start with 1D DP, then move to 2D. Always define your DP state clearly.',
                'graphs': 'Master DFS and BFS first. Learn shortest path algorithms (Dijkstra, Floyd-Warshall). Practice tree problems.',
                'binary search': 'Define your search space clearly. Use the template: while(left < right). Be careful with integer overflow.',
                'greedy': 'Prove your greedy choice is optimal. Sort the input when needed. Start with simple greedy problems.',
                'trees': 'Understand tree traversals (inorder, preorder, postorder). Practice recursive thinking. Learn LCA techniques.'
            };

            const fallbackTip = fallbackTips[topic.toLowerCase()] || 
                              `Practice ${topic} regularly and read editorial solutions to improve your understanding.`;

            const fallbackEmbed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle(`💡 Quick Tip: ${topic}`)
                .setDescription(fallbackTip)
                .setFooter({ text: 'Fallback tip • Try !tip <topic> again later' })
                .setTimestamp();

            await loadingMsg.edit({ embeds: [fallbackEmbed] });
        }
    }
};
