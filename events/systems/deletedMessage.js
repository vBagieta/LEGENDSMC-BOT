const { logsChannelId } = require('../../configs/main.json');
const fs = require('fs');
const path = require('path');
const { Events,
    EmbedBuilder,
    userMention,
    channelMention,
    codeBlock,
    PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        const member = await message.guild.members.fetch(message.author.id);
        if (message.author.bot || !message.webhookId === null) {
            return;
        } else {
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
        if (member.permissions.has(PermissionFlagsBits.KickMembers)) { 
            return;
        } else {
            try {
                const filePath = path.resolve(__dirname, '../../configs/deletedMessages.json');

                let deletedMessages = {};
                if (fs.existsSync(filePath)) {
                    const rawData = fs.readFileSync(filePath);
                    deletedMessages = JSON.parse(rawData);
                }
            
                const channel = message.channel.id;
            
                deletedMessages[channel] = {
                    author: message.author.globalName,
                    authorId: message.author.id,
                    content: message.content,
                    timestamp: message.createdAt.toISOString()
                };

                fs.writeFileSync(filePath, JSON.stringify(deletedMessages, null, 4), 'utf-8');
            } catch (error) {
                console.log(error)
            }
        };
    }
};