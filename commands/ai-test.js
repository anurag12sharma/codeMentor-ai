const { EmbedBuilder } = require('discord.js');
const AIService = require('../utils/aiService');

module.exports = {
    name: 'ai-test',
    description: 'Test AI connection and API key',
    aliases: ['test-ai', 'ai-check'],
    cooldown: 60,
    async execute(message, args, client) {
        const loadingEmbed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle('🧪 Testing AI Connection...')
            .setDescription('Checking API key and connection to Google AI...');
        
        const testMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            // Check if API key exists
            const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;
            
            if (!apiKey) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('❌ API Key Missing')
                    .setDescription('Google AI API key not found in environment variables.')
                    .addFields([
                        {
                            name: '🔧 How to Fix',
                            value: '1. Go to https://aistudio.google.com/\n' +
                                   '2. Get your API key\n' +
                                   '3. Add to .env file:\n' +
                                   '``````',
                            inline: false
                        }
                    ]);
                
                return testMsg.edit({ embeds: [errorEmbed] });
            }

            // Test AI service
            const aiService = new AIService();
            const isWorking = await aiService.testConnection();

            if (isWorking) {
                const successEmbed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('✅ AI Connection Successful')
                    .setDescription('Google AI API is working correctly!')
                    .addFields([
                        {
                            name: '📊 Status',
                            value: `**API Key:** Found ✅\n` +
                                   `**Connection:** Working ✅\n` +
                                   `**Model:** Gemini 1.5 Flash ✅`,
                            inline: false
                        },
                        {
                            name: '🎯 Available Commands',
                            value: '• `!schedule` - AI study plans\n' +
                                   '• `!tip <topic>` - AI programming tips\n' +
                                   '• `!recommend` - AI contest recommendations',
                            inline: false
                        }
                    ])
                    .setTimestamp();

                await testMsg.edit({ embeds: [successEmbed] });
            } else {
                throw new Error('AI connection test failed');
            }

        } catch (error) {
            console.error('AI test command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ AI Connection Failed')
                .setDescription(`**Error:** ${error.message}`)
                .addFields([
                    {
                        name: '🔧 Troubleshooting',
                        value: '1. Check your API key is correct\n' +
                               '2. Verify internet connection\n' +
                               '3. Try restarting the bot\n' +
                               '4. Check Google AI Studio quotas',
                        inline: false
                    }
                ])
                .setTimestamp();

            await testMsg.edit({ embeds: [errorEmbed] });
        }
    }
};
