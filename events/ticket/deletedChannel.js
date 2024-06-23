const { ticketCategoryId, ticketLogsChannelId } = require('../../configs/main.json');
const { Events,
    EmbedBuilder,
    userMention } = require('discord.js');

module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {
        if (channel.parent && channel.parent.id === ticketCategoryId) {
            const channelDeleteId = channel.id;

            try {
                const logs = await channel.guild.fetchAuditLogs({ type: 12 });
                const entry = logs.entries.find(entry => entry.target.id === channelDeleteId);

                const [owner, id] = channel.name.split('-');

                if (entry && !entry.executor.bot) {
                    const deletedTicketEmbed = new EmbedBuilder()
                        .setTitle('Zgłoszenie')
                        .setColor('DarkRed')
                        .setDescription(
                            `${userMention(entry.executor.id)} usunął ręcznie kanał zgłoszenia.`
                            + `\nWłaściciel zgłoszenia: ` + userMention(id)
                        )
                        .setTimestamp()
                        .setFooter({
                            text: 'System zgłoszeń',
                            iconURL: channel.guild.iconURL({ dynamic: true })
                        });

                    channel.guild.channels.cache.get(ticketLogsChannelId).send({ embeds: [deletedTicketEmbed] });
                }

            } catch (error) {
                console.error(error);
            }
        }
    }
};