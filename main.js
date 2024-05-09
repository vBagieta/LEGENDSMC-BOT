const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const commandHandler = require('./handlers/commandHandler.js');
const eventHandler = require('./handlers/eventHandler.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

commandHandler(client);
eventHandler(client);

client.login(token);