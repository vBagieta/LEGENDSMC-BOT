const { EmbedBuilder, PermissionFlagsBits, codeBlock } = require('discord.js');
const { logsChannelId, autoBanChannelId } = require('../configs/main.json');

module.exports = {
    name: 'messageCreate',
    async execute(message) {

        const member = await message.guild.members.fetch(message.author.id);
        if (member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return;
        }

        if (message.channel.id === autoBanChannelId) {
            try {
                const userMessages = await message.channel.messages.fetch({ limit: 100 });
                const userMessagesToday = userMessages.filter(msg => msg.author.id === message.author.id && isToday(msg.createdAt));

                await message.channel.bulkDelete(userMessagesToday);
                await message.guild.members.ban(message.author, { reason: '[AUTOMAT] Wysłałeś wiadomość na kanale zabezpieczającym.'} );
                
                const logEmbed = new EmbedBuilder()
                    .setTitle('AutoBan LOG')
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`Użytkownik <@${message.author.id}> wysłał wiadomość na kanale zabezpieczającym.`)
                    .addFields(
                        { name: 'WIADOMOŚĆ', value: codeBlock(message.content) }
                    )
                message.guild.channels.cache.get(logsChannelId).send({ embeds: [logEmbed] })
            } catch (error) {
                console.error(error);
            }
        }
    }
};

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}