const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const SHODAN_API_KEY = process.env.SHODAN_API_KEY;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hostinfo')
        .setDescription('Récupère des informations sur un hôte spécifique')
        .addStringOption(option => option.setName('host').setDescription('Entrez l\'adresse IP de l\'hôte ou le nom de domaine').setRequired(true)),
    async execute(interaction) {

         // Vérifier les crédits API restants
        const apiInfoUrl = `https://api.shodan.io/api-info?key=${SHODAN_API_KEY}`;
        const apiInfoResponse = await fetch(apiInfoUrl);
        const apiInfo = await apiInfoResponse.json();

         // Récupérer les infos de l'host
        await interaction.deferReply();
        const host = interaction.options.getString('host');
        const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
        let ip;

        if (!isIP) {
            const resolveUrl = `https://api.shodan.io/dns/resolve?hostnames=${host}&key=${SHODAN_API_KEY}`;
            const resolveResponse = await fetch(resolveUrl);
            const resolveData = await resolveResponse.json();
            ip = resolveData[host];
        } else {
            ip = host;
        }
        const url = `https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const summary = `Résumé des données pour l'IP: ${host}\n\n`;
            const info = {
                IP: data.ip_str || 'Non disponible',
                Organisation: data.org || 'Non disponible',
                Pays: data.country_name || 'Non disponible',
                Ville: data.city || 'Non disponible',
                OS: data.os || 'Non disponible',
                Ports: data.ports ? data.ports.join(', ') : 'Non disponible',
                Tags: data.tags ? data.tags.join(', ') : 'Non disponible',
                'Dernière mise à jour': data.last_update || 'Non disponible'
            };
            const formattedData = Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n');

            const embed = new EmbedBuilder()
                .setTitle(`Informations de l'hôte pour : ${host}`)
                .setDescription(summary + "```json\n" + formattedData + "\n```")
                .addFields({ name: 'Crédits API restants', value: apiInfo.query_credits.toString(), inline: true })
                .setColor('#0099ff');

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply({ content: 'Une erreur est survenue lors de la récupération des données. Analyse des logs en cours...' });
            console.error(error);
        }
    },
};
