const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Let\' ping the world !'),
    async execute(interaction) {
        await interaction.reply('P0NG');
    }
}