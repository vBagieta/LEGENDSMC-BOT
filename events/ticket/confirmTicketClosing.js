const { Events, EmbedBuilder, time, TimestampStyles } = require('discord.js');
const { ticketLogsChannelId } = require('../../configs/main.json');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (interaction.customId === 'confirmTicketDeletion') {

            interaction.update({
                content: 'Ticket zostanie usunięty w ciągu 30 sekund.',
                components: [],
                ephemeral: true
            })

            const timer = setTimeout(async () => {
                const channel = interaction.client.channels.cache.get(interaction.channelId);
                if (channel) {
                    await channel.delete();
                }

                const [author, id] = channel.name.split("-");

                const deletedTicketEmbed = new EmbedBuilder()
                    .setTitle('Ticket LOG')
                    .setColor('Red')
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`Użytkownik <@${interaction.user.id}> zamknął ticket.`)
                    .addFields(
                        { name: 'AUTOR', value: `<@${id}> (${author})` },
                        { name: 'ZAMKNIĘTO', value: `${time(new Date(), TimestampStyles.RelativeTime)}` }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'System ticketów' })
            
                interaction.guild.channels.cache.get(ticketLogsChannelId).send({ embeds: [deletedTicketEmbed] })

            }, 30000);
            
        } else if (interaction.customId === 'cancelTicketDeletion') {
            interaction.update({
                content: 'Anulowano zamykanie ticketa.',
                components: [],
                ephemeral: true
            })
        }
    }
};