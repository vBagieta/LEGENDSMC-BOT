const { EmbedBuilder } = require('discord.js');
const guildConfig = require('../configs/guilds.json');

module.exports = {
    name: 'messageCreate',
    async execute(message) {

        if (!message.guild) return;
        if (message.author.bot) return;

        const inviteMatch = message.content.match(/discord\.(gg|io|me|li)\/([a-zA-Z0-9]+)$/);
        if (inviteMatch) {
            const inviteCode = inviteMatch[2];
            if (guildConfig.includes(inviteCode)) {
                return;
            } else {
                const member = await message.guild.members.fetch(message.author.id);
                if (member.permissions.has('KICK_MEMBERS')) {
                    console.log('[INFO] Ignoring ' + message.author.username + '\'s invite. REASON: User has [KICK_MEMBER] permission.');
                    return;
                } else {
                    const embed = new EmbedBuilder()
                        .setDescription(`<@${message.author.id}>, nie wysyłaj zaproszeń!`)
                        .setColor('Red');
                    try {
                        const sentEmbed = await message.channel.send({ embeds: [embed], ephemeral: true });
                        setTimeout(() => {
                            sentEmbed.delete().catch(console.error);
                        }, 10000);
                    } catch (error) {
                        console.error(error);
                    }
                    try {
                        await message.delete();
                        console.log('[INFO] Deleting ' + message.author.username + '\'s invite. INVITE-MATCH: ' + inviteMatch)
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
    },
};
