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
                    return;
                } else {
                    try {
                        const sentMessage = await message.channel.send(`<@${message.author.id}>, nie wysyłaj zaproszeń!`);
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
