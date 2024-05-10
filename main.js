const { Client } = require('discord.js');
const { token } = require('./configs/main.json');
const commandHandler = require('./handlers/commandHandler.js');
const eventHandler = require('./handlers/eventHandler.js');

const client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });

commandHandler(client);
eventHandler(client);

client.login(token);