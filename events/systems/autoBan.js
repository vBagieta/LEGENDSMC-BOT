const { logsChannelId, autoBanChannelId } = require('../../configs/main.json');
const { Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        try {
            const member = await message.guild.members.fetch(message.author.id);

            if (member.permissions.has(PermissionFlagsBits.KickMembers)) return;

            if (message.channel.id === autoBanChannelId) {
                try {
                    await message.guild.members.ban(message.author, {
                        reason: '[AutoBan]',
                        deleteMessageSeconds: 3600
                    });

                    const logEmbed = new EmbedBuilder()
                        .setTitle('AutoBan')
                        .setColor('Red')
                        .setAuthor({
                            name: message.author.username,
                            iconURL: message.author.displayAvatarURL({ dynamic: true })
                        })
                        .setDescription(`Użytkownik ${message.author} został zbanowany za wysłanie wiadomości na kanale autoBan.`)
                        .setTimestamp()
                        .setFooter({
                            text: 'System', iconURL:
                            message.guild.iconURL({ dynamic: true })
                        });

                    const logsChannel = message.guild.channels.cache.get(logsChannelId);
                    if (logsChannel) await logsChannel.send({ embeds: [logEmbed] });
                    
                } catch (error) {
                    console.error('Wystąpił błąd podczas banowania użytkownika:', error);
                }
            }
        } catch (error) {
            if (!message.webhookId) {
                console.error(error);
            }
        }
    }
};