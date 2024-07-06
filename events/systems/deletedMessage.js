const { logsChannelId } = require('../../configs/main.json');
const { Events,
    EmbedBuilder,
    userMention,
    channelMention,
    codeBlock } = require('discord.js');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {

        if (message.author.bot || !message.webhookId === null) return;
        try {
            const deletedMessageEmbed = new EmbedBuilder()
                .setTitle('Usunięto wiadomość.')
                .setDescription(
                    `Użytkownik ${userMention(message.author.id)} `
                    + `usunął wiadomość na kanale ${channelMention(message.channelId)}`
                )
                .addFields(
                    { name: 'Wiadomość', value: codeBlock(message.content) }
                )
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                })
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: 'System logów',
                    iconURL: message.guild.iconURL({ dynamic: true })
                });
        
            message.guild.channels.cache.get(logsChannelId).send({ embeds: [deletedMessageEmbed] });

        } catch (error) {
            console.log(error)
        }
    }
};