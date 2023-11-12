const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
const GUILDID = process.env.GUILDID;
const CLIENTID = process.env.CLIENTID;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        // Clean the commands, to avoid duplication
        await rest.put(
            Routes.applicationGuildCommands(CLIENTID, GUILDID),
            { body: [] },
        );
        console.log('Successfully deleted all guild commands.');

        // And then add the newest commands
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENTID, GUILDID),
            { body: commands },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
