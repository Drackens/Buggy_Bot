const fs = require('fs');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
console.log("Using Discord TOKEN: ", TOKEN);

const bot = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    partials: [Partials.Channel]
});

bot.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.data.name, command);
}

bot.once('ready', () => {
    console.log('My Boty is ready!');
});

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = bot.commands.get(interaction.commandName);

    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue... Analyse en cours...', ephemeral: true });
    }
});

bot.login(TOKEN);
