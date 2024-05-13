const { logsChannelId } = require('../../configs/main.json');
const guildConfig = require('../../configs/guilds.json');
const { Events,
    EmbedBuilder,
    PermissionFlagsBits,
    codeBlock 
} = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        if (!message.guild || message.author.bot) return;

        const inviteMatch = message.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi);
        if (inviteMatch) {
            const inviteCode = inviteMatch[2];
            if (guildConfig.includes(inviteCode)) {
                return;
            } else {
                const member = await message.guild.members.fetch(message.author.id);
                if (member.permissions.has(PermissionFlagsBits.KickMembers)) {
                    return;
                } else {
                    try {
                        const sentMessage = await message.channel.send(`<@${message.author.id}>, nie wysyłaj zaproszeń!`);

                        const logEmbed = new EmbedBuilder()
                            .setTitle('AntyInvite LOG')
                            .setColor('Red')
                            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`Użytkownik <@${message.author.id}> wysłał zaproszenie.`)
                            .addFields(
                                { name: 'WIADOMOŚĆ', value: codeBlock(message.content) }
                            )
                            .setTimestamp()
                            .setFooter({ text: 'System', iconURL: interaction.guild.iconURL({ dynamic: true }) });
                        message.guild.channels.cache.get(logsChannelId).send({ embeds: [logEmbed] })

                        setTimeout(() => {
                            sentMessage.delete().catch(console.error);
                        }, 10000);
                    } catch (error) {
                        console.error(error);
                    }
                    try {
                        await message.delete();
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
    },
};