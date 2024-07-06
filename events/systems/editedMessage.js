const { logsChannelId } = require('../../configs/main.json');
const { Events,
    EmbedBuilder,
    userMention,
    channelMention,
    codeBlock } = require('discord.js');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {

        if (oldMessage.author.bot || !oldMessage.webhookId === null) return;
        try {
            const editedMessageEmbed = new EmbedBuilder()
                .setTitle('Zaktualizowano wiadomość')
                .setDescription(
                    `Użytkownik ${userMention(oldMessage.author.id)} `
                    + `zaktualizował wiadomość na kanale ${channelMention(oldMessage.channelId)}`
                )
                .setAuthor({
                    name: oldMessage.author.username,
                    iconURL: oldMessage.author.displayAvatarURL({ dynamic: true })
                })
                .addFields(
                    { name: 'Przed', value: codeBlock(oldMessage.content) },
                    { name: 'Po', value: codeBlock(newMessage.content) }
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: 'System logów',
                    iconURL: oldMessage.guild.iconURL({ dynamic: true })
                });

            oldMessage.guild.channels.cache.get(logsChannelId).send({ embeds: [editedMessageEmbed] });

        } catch (error) {
            console.log(error)
        }
    }
};