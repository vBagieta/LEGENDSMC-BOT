const { logsChannelId } = require('../../configs/main.json');
const { Events,
    EmbedBuilder,
    userMention,
    inlineCode } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        if (member.bot) return;
        
        const leaveEmbed = new EmbedBuilder()
            .setTitle('Użytkownik opuścił serwer')
            .setDescription(
                `${userMention(member.id)} wyszedł z serwera\n\n`
                + `**Indentyfikator:** ` + inlineCode(member.id)
            )
            .setColor('Red')
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

        member.guild.channels.cache.get(logsChannelId).send({ embeds: [leaveEmbed] });
    }
};