const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const giphyToken = process.env.GIPHY_TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Recherche un GIF aléatoire basé sur un thème donné')
        .addStringOption(option =>
            option.setName('theme')
                .setDescription('Le thème du GIF')
                .setRequired(true)),
    async execute(interaction) {
        const theme = interaction.options.getString('theme');
        const url = `https://api.giphy.com/v1/gifs/random?api_key=${giphyToken}&tag=${encodeURIComponent(theme)}`;

        try {
            const response = await fetch(url);
            const json = await response.json();

            if (!json.data || !json.data.images || !json.data.images.original || !json.data.images.original.url) {
                return interaction.reply('Aucun GIF trouvé pour ce thème.');
            }

            const embed = new EmbedBuilder().setImage(json.data.images.original.url);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la recherche du GIF:', error);
            await interaction.reply('Erreur lors de la recherche du GIF.');
        }
    },
};
