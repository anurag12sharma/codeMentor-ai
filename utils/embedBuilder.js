const { EmbedBuilder } = require('discord.js');

module.exports = {
    // Success embed (green)
    successEmbed: (title, description) => {
        return new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(`✅ ${title}`)
            .setDescription(description)
            .setTimestamp();
    },
    
    // Error embed (red)
    errorEmbed: (title, description) => {
        return new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`❌ ${title}`)
            .setDescription(description)
            .setTimestamp();
    },
    
    // Info embed (blue)
    infoEmbed: (title, description) => {
        return new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`ℹ️ ${title}`)
            .setDescription(description)
            .setTimestamp();
    },
    
    // Warning embed (yellow)
    warningEmbed: (title, description) => {
        return new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle(`⚠️ ${title}`)
            .setDescription(description)
            .setTimestamp();
    },
    
    // Contest embed (purple)
    contestEmbed: (title, description) => {
        return new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle(`🏆 ${title}`)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: 'CodeMentor AI - Your Programming Assistant' });
    }
};
