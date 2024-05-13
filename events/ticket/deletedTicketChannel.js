const { Events, EmbedBuilder } = require('discord.js');
const { ticketCategoryId, ticketLogsChannelId } = require('../../configs/main.json');

module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {
        if (channel.parent && channel.parent.id === ticketCategoryId) {

            const channelDeleteId = channel.id;
            channel.guild.fetchAuditLogs({ type: 12 })
                .then(logs => {
                    const entry = logs.entries.find(entry => entry.target.id === channelDeleteId);
                    if (entry) {
                        const author = entry.executor;
                        if (!author.bot) {
                            const deletedTicketEmbed = new EmbedBuilder()
                                .setTitle('LOG Zgłoszeń')
                                .setColor('DarkRed')
                                .setDescription(`<@${author.id}> usunął ręcznie kanał zgłoszenia.`)
                                .addFields(
                                    { name: 'ID ZGŁOSZENIA', value: channel.name }
                                )
                                .setTimestamp()
                                .setFooter({ text: 'System zgłoszeń', iconURL: channel.guild.iconURL({ dynamic: true }) });
        

                            channel.guild.channels.cache.get(ticketLogsChannelId).send({ embeds: [deletedTicketEmbed] });
                        }
                    }
                }
            );
        }
    }
};