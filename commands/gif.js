const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const giphyToken = process.env.GIPHY_TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Recherche un GIF aléatoire basé sur un thème donné.')
        .addStringOption(option =>
            option.setName('theme')
                .setDescription('Le thème du GIF')
                .setRequired(true)),
    async execute(interaction) {
        let theme = interaction.options.getString('theme');
        if (!theme) {
            return interaction.reply('Merci de spécifier un gif à chercher');
        }
        const url = `https://api.giphy.com/v1/gifs/random?api_key=${giphyToken}&tag=${encodeURIComponent(theme)}`;
        const response = await fetch(url);
        const json = await response.json();
        const embed = new MessageEmbed().setImage(json.data.images.original.url);
        await interaction.reply({ embeds: [embed] });
    },
};
