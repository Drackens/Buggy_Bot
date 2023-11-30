const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const CLIENT_ID_TWITCH = process.env.CLIENT_ID_TWITCH;
const CLIENT_SECRET_TWITCH = process.env.CLIENT_SECRET_TWITCH;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jeu')
        .setDescription('Affiche des informations sur un jeu Twitch spécifique.')
        .addStringOption(option => 
            option.setName('jeu')
                .setDescription('Le nom du jeu')
                .setRequired(true)),
    async execute(interaction) {
        const gameName = interaction.options.getString('jeu');

        try {
            const tokenResponse = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID_TWITCH}&client_secret=${CLIENT_SECRET_TWITCH}&grant_type=client_credentials`, {
                method: 'POST'
            });
            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;

            const headers = {
                'Client-ID': CLIENT_ID_TWITCH,
                'Authorization': `Bearer ${accessToken}`
            };

            const gameResponse = await fetch(`https://api.twitch.tv/helix/games?name=${gameName}`, { headers });
            const gameData = await gameResponse.json();
            if (gameData.data.length === 0) {
                await interaction.reply(`Aucun jeu trouvé pour "${gameName}".`);
                return;
            }

            const gameId = gameData.data[0].id;
            const streamsResponse = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}`, { headers });
            const streamsData = await streamsResponse.json();

            const streams = streamsData.data;
            const totalViewers = streams.reduce((acc, stream) => acc + stream.viewer_count, 0);
            const maxViewers = streams.reduce((max, stream) => (stream.viewer_count > max ? stream.viewer_count : max), 0);
            const averageViewers = totalViewers / streams.length;

            // Récupérer la liste des jeux les plus populaires
            const topGamesResponse = await fetch(`https://api.twitch.tv/helix/games/top`, { headers });
            const topGamesData = await topGamesResponse.json();
            const topGames = topGamesData.data;

            // Trouver la position du jeu
            let gameRank = topGames.findIndex(game => game.id === gameId) + 1;
            gameRank = gameRank === 0 ? 'Non classé' : `Classé #${gameRank}`;

            const gameEmbed = new EmbedBuilder()
                .setColor('#a100b3')
                .setTitle(`Statistiques pour le jeu: ${gameName}`)
                .addFields(
                    { name: 'Place du jeu', value: gameRank, inline: true },
                    { name: 'Total de viewers', value: totalViewers.toString(), inline: true },
                    { name: 'Viewer du plus gros stream', value: maxViewers.toString(), inline: true },
                    { name: 'Moyenne de viewers par stream', value: averageViewers.toFixed(2), inline: true }
                );

            await interaction.reply({ embeds: [gameEmbed] });
        } catch (error) {
            console.error('Erreur lors de l’exécution de la commande: ', error);
            await interaction.reply('Il y a eu une erreur lors de l’exécution de votre commande.');
        }
    },
};



// const { SlashCommandBuilder } = require('@discordjs/builders');
// const { EmbedBuilder } = require('discord.js');
// const fetch = require('node-fetch');

// const CLIENT_ID_TWITCH = process.env.CLIENT_ID_TWITCH;
// const CLIENT_SECRET_TWITCH = process.env.CLIENT_SECRET_TWITCH;

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('jeu')
//         .setDescription('Affiche des statistiques sur un jeu Twitch')
//         .addStringOption(option => option.setName('nom').setDescription('Nom du jeu').setRequired(true)),
//     async execute(interaction) {
//         const gameName = interaction.options.getString('nom');

//         const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: `client_id=${encodeURIComponent(CLIENT_ID_TWITCH)}&client_secret=${encodeURIComponent(CLIENT_SECRET_TWITCH)}&grant_type=client_credentials`
//         });
//         const { access_token } = await tokenResponse.json();

//         const twitchResponse = await fetch(`https://api.twitch.tv/helix/streams?game_name=${encodeURIComponent(gameName)}`, {
//             headers: {
//                 'Client-ID': CLIENT_ID_TWITCH,
//                 'Authorization': `Bearer ${access_token}`
//             }
//         });
//         const twitchData = await twitchResponse.json();

//         const totalViewers = twitchData.data.reduce((acc, stream) => acc + stream.viewer_count, 0);
//         const maxViewers = Math.max(...twitchData.data.map(stream => stream.viewer_count));
//         const avgViewers = twitchData.data.length > 0 ? totalViewers / twitchData.data.length : 0;

//         const embed = new EmbedBuilder()
//             .setTitle(`Statistiques pour ${gameName}`)
//             .addFields(
//                 { name: 'Nombre Total de Spectateurs', value: totalViewers.toString(), inline: true },
//                 { name: 'Nombre de Spectateurs du Plus Gros Stream', value: maxViewers.toString(), inline: true },
//                 { name: 'Nombre Moyen de Spectateurs par Stream', value: avgViewers.toFixed(2), inline: true }
//             )
//             .setColor('#0099ff');

//         await interaction.reply({ embeds: [embed] });
//     },
// };





// const { SlashCommandBuilder } = require('@discordjs/builders');
// const { EmbedBuilder } = require('discord.js');
// const fetch = require('node-fetch');

// const CLIENT_ID_TWITCH = process.env.CLIENT_ID_TWITCH;
// const CLIENT_SECRET_TWITCH = process.env.CLIENT_SECRET_TWITCH;

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('jeu')
//         .setDescription('Affiche des statistiques Twitch à propos d\'un jeu ')
//         .addStringOption(option => option.setName('nom').setDescription('Nom du jeu').setRequired(true)),
//     async execute(interaction) {
//         const gameName = interaction.options.getString('nom');

//         // Authentifier et obtenir le jeton d'accès
//         const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: `client_id=${encodeURIComponent(CLIENT_ID_TWITCH)}&client_secret=${encodeURIComponent(CLIENT_SECRET_TWITCH)}&grant_type=client_credentials`
//         });
//         const { access_token } = await tokenResponse.json();

//         // Interroger l'API de Twitch pour les statistiques du jeu
//         const twitchResponse = await fetch(`https://api.twitch.tv/helix/streams?game_name=${encodeURIComponent(gameName)}`, {
//             headers: {
//                 'Client-ID': CLIENT_ID_TWITCH,
//                 'Authorization': `Bearer ${access_token}`
//             }
//         });
//         const twitchData = await twitchResponse.json();

//         console.log(twitchData);

//         // Traiter les données et les envoyer en tant que réponse
//         const embed = new EmbedBuilder()
//             .setTitle(`Statistiques pour ${gameName}`)
//             .setDescription('...'); // Formattez les données de Twitch ici

//         await interaction.reply({ embeds: [embed] });
//     },
// };
