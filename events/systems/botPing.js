const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.content === '<@1237828145147678821>') {
            message.reply(`<@${message.author.id}>, jestem aktywny! Wpisz </help:1254411711205736597> po listę komend.`)
        }
    }
};