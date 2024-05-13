const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./configs/main.json');
const fs = require('fs');
const path = require('path');
const { Client } = require('discord.js');
const commandHandler = require('./handlers/commandHandler.js');
const eventHandler = require('./handlers/eventHandler.js');

const client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });

const rest = new REST({ version: '10' }).setToken(token);

async function deleteCommands() {
    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
        console.log('Successfully deleted all guild commands.');
        await rest.put(Routes.applicationCommands(clientId), { body: [] });
        console.log('Successfully deleted all application commands.');
    } catch (error) {
        console.error(error);
    }
}

async function registerCommands() {
    const commands = [];
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
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
    }

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

async function startBot() {
    try {
        await client.login(token);
        console.log(`Bot logged in successfully as ${client.user.tag}`);
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

commandHandler(client);
eventHandler(client);

deleteCommands()
    .then(registerCommands)
    .then(() => setTimeout(startBot, 5000))
    .catch(error => console.error('Error during setup:', error));