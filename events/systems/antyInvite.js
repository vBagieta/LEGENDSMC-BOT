const { logsChannelId } = require('../../configs/main.json');
const guildConfig = require('../../configs/allowedInvites.json');
const { Events,
    EmbedBuilder,
    PermissionFlagsBits,
    codeBlock,
    userMention} = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (!message.guild || message.author.bot) return;

        const inviteMatch = message.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi);
        
        if (inviteMatch) {
            const inviteLink = inviteMatch[0];
            if (guildConfig.includes(inviteLink)) return;

            const member = await message.guild.members.fetch(message.author.id);
            if (member.permissions.has(PermissionFlagsBits.KickMembers)) return;

            try {
                const sentMessage = await message.channel.send(`${userMention(message.author.id)}, nie wysyłaj zaproszeń!`);

                const logEmbed = new EmbedBuilder()
                    .setTitle('AntyInvite')
                    .setColor('Red')
                    .setAuthor({
                        name: message.author.username,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    })
                    .setDescription(
                        `Użytkownik ${message.author} wysłał zaproszenie.\n\n`
                        + `**Wiadomość:**\n` + codeBlock(message.content)
                    )
                    .setTimestamp()
                    .setFooter({
                        text: 'System',
                        iconURL: message.guild.iconURL({ dynamic: true })
                    });

                const logsChannel = message.guild.channels.cache.get(logsChannelId);
                if (logsChannel) await logsChannel.send({ embeds: [logEmbed] });

                setTimeout(() => {
                    sentMessage.delete().catch(console.error);
                }, 10000);

            } catch (error) {
                console.error('Wystąpił błąd podczas wysyłania wiadomości lub logowania.', error);
            }

            try {
                await message.delete();

            } catch (error) {
                console.error(error);
            }
        }
    },
};