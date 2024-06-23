const { logsChannelId } = require('../../configs/main.json');
const { Events,
    EmbedBuilder,
    userMention,
    inlineCode } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (member.bot) return;

        const joinedEmbed = new EmbedBuilder()
            .setTitle('Nowy użytkownik dołączył do serwera')
            .setDescription(
                `${userMention(member.id)} dołączył do serwera!\n\n`
                + `**Indentyfikator:** ` + inlineCode(member.id)
            )
            .setColor('Yellow')
            .setTimestamp()
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setAuthor({
                name: member.user.username,
                iconURL: member.displayAvatarURL({ dynamic: true })
            })
            .setFooter({
                text: 'System logów',
                iconURL: member.guild.iconURL({ dynamic: true })
            });

        member.guild.channels.cache.get(logsChannelId).send({ embeds: [joinedEmbed] });
    }
};