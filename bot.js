const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
console.log("Using Discord TOKEN: ", TOKEN)

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

bot.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.data.name, command);
}

bot.once('ready', () => {
    console.log('Bot is ready!');
});

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = bot.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Erreur lors de la récupération du GIF ', ephemeral: true });
    }
});

bot.login(TOKEN);

// Next step, connecter l'api de shodan

