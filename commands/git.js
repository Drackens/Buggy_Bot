const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

async function getLastCommit() {
    const url = 'https://api.github.com/repos/Drackens/Buggy_Bot/commits';
    const response = await fetch(url);
    const commits = await response.json();
    const lastCommit = commits[0];
    return {
        message: lastCommit.commit.message,
        date: lastCommit.commit.committer.date
    };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('git')
        .setDescription('Affiche le code source du bot'),
    async execute(interaction) {
        const gitUrl = 'https://github.com/Drackens/Buggy_Bot';
        const lastCommitInfo = await getLastCommit();

        const embed = new EmbedBuilder()
            .setColor('#ff1aa3')
            .setTitle('Mon code source ❤️')
            .setURL(gitUrl)
            .setDescription(`Dernier commit : ${lastCommitInfo.message}\nDate : ${lastCommitInfo.date}`)
            .setThumbnail('https://raw.githubusercontent.com/Drackens/Buggy_Bot/dev/misc/images/buggy.png')
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
}
