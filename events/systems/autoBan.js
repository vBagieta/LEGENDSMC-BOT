const { Events, EmbedBuilder, PermissionFlagsBits, codeBlock } = require('discord.js');
const { logsChannelId, autoBanChannelId } = require('../../configs/main.json');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        try {
            const member = await message.guild.members.fetch(message.author.id);
            if (member.permissions.has(PermissionFlagsBits.KickMembers)) {
                return;
            }

            if (message.channel.id === autoBanChannelId) {
                try {

                    await message.guild.members.ban(message.author, {
                        reason: '[AutoBan]',
                        deleteMessageSeconds: 3600
                    });

                    const logEmbed = new EmbedBuilder()
                        .setTitle('AutoBan LOG')
                        .setColor('Red')
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`Użytkownik <@${message.author.id}> wysłał wiadomość na kanale zabezpieczającym.`)
                        .addFields(
                            { name: 'WIADOMOŚĆ', value: codeBlock(message.content) }
                        )
                        .setTimestamp()
                        .setFooter({ text: 'System', iconURL: interaction.guild.iconURL({ dynamic: true }) });

                    message.guild.channels.cache.get(logsChannelId).send({ embeds: [logEmbed] })
                } catch (error) {
                    console.error(error);
                }
            }
        } catch (error) {}
    }
};