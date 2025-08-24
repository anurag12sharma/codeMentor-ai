const { EmbedBuilder } = require('discord.js');
const HealthCheck = require('../utils/healthCheck');

const healthCheck = new HealthCheck();

module.exports = {
    name: 'health',
    description: 'Check bot system health and status',
    aliases: ['status-check', 'system'],
    cooldown: 30,
    async execute(message, args, client) {
        const loadingEmbed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle('🔍 Running Health Check...')
            .setDescription('Checking all systems...');
        
        const statusMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            const report = await healthCheck.generateHealthReport();
            
            const statusColor = {
                'healthy': 0x00FF00,
                'warning': 0xFFA500,
                'degraded': 0xFF0000,
                'unhealthy': 0xFF0000
            }[report.overall] || 0x808080;

            const statusEmoji = {
                'healthy': '✅',
                'warning': '⚠️',
                'degraded': '🔴',
                'unhealthy': '🔴'
            }[report.overall] || '❓';

            const healthEmbed = new EmbedBuilder()
                .setColor(statusColor)
                .setTitle(`${statusEmoji} System Health Report`)
                .setDescription(`**Overall Status:** ${report.overall.toUpperCase()}`)
                .addFields(
                    {
                        name: '🔧 System Info',
                        value: `**Uptime:** ${report.uptime}\n**Memory:** ${report.memory.used}/${report.memory.total}`,
                        inline: true
                    },
                    {
                        name: '📊 Bot Stats',
                        value: `**Servers:** ${client.guilds.cache.size}\n**Users:** ${client.users.cache.size}`,
                        inline: true
                    }
                );

            // Add service statuses
            const serviceFields = Object.entries(report.services).map(([service, status]) => {
                const emoji = status === 'healthy' ? '✅' : status === 'warning' ? '⚠️' : '🔴';
                return `${emoji} ${service}: ${status}`;
            }).join('\n');

            healthEmbed.addFields({
                name: '🛠️ Service Status',
                value: serviceFields,
                inline: false
            });

            healthEmbed.setFooter({ 
                text: `Last checked: ${new Date(report.timestamp).toLocaleTimeString()}` 
            });

            await statusMsg.edit({ embeds: [healthEmbed] });

        } catch (error) {
            console.error('Health check command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Health Check Failed')
                .setDescription('Unable to complete system health check')
                .setTimestamp();
            
            await statusMsg.edit({ embeds: [errorEmbed] });
        }
    }
};
