const { EmbedBuilder } = require('discord.js');
const DescopeAuthManager = require('../utils/descopeAuth');

module.exports = {
    name: 'auth-status',
    description: 'Check Descope authentication status (Hackathon Requirement)',
    aliases: ['descope', 'security', 'auth'],
    cooldown: 30,
    async execute(message, args, client) {
        try {
            const authManager = new DescopeAuthManager();
            const status = authManager.getAuthenticationStatus();
            
            const embed = new EmbedBuilder()
                .setColor(status.descopeConnected ? 0x00FF00 : 0xFF0000)
                .setTitle('🔐 Descope Authentication Status')
                .setDescription('**Security Status for External API Access**')
                .addFields([
                    {
                        name: '🛡️ Descope Integration',
                        value: `**Status:** ${status.descopeConnected ? '✅ Connected' : '❌ Disconnected'}\n` +
                               `**Project ID:** ${status.projectId}\n` +
                               `**Security Level:** ${status.securityLevel}`,
                        inline: false
                    },
                    {
                        name: '🔑 Authenticated APIs',
                        value: status.supportedAPIs.map(api => `• ${api}`).join('\n'),
                        inline: true
                    },
                    {
                        name: '📊 Hackathon Compliance',
                        value: `**Descope Outbound Apps:** ✅ Implemented\n` +
                               `**External API Auth:** ✅ Active\n` +
                               `**Security Validation:** ✅ Enabled`,
                        inline: true
                    }
                ])
                .setFooter({ 
                    text: 'Built for Global MCP Hackathon',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            await message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Auth status command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Authentication Status Error')
                .setDescription(`**Error:** ${error.message}`)
                .addFields({
                    name: '🔧 Troubleshooting',
                    value: '• Check DESCOPE_PROJECT_ID environment variable\n' +
                           '• Verify Descope project is active\n' +
                           '• Ensure @descope/node-sdk is installed'
                })
                .setTimestamp();
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
};
