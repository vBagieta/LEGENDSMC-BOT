const { Events, EmbedBuilder, time, TimestampStyles } = require('discord.js');
const { ticketLogsChannelId } = require('../../configs/main.json');

function isBot(message) {
    return message.author.bot;
}

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

                    const messages = await channel.messages.fetch({ limit: 10 });

                    const botMessages = messages.filter(isBot);
                    botMessages.forEach(message => message.delete());

                    let lastMessages = "**BRAK OSTATNICH WIADOMOŚĆI**";
                    const userMessages = messages.filter(message => !isBot(message));
                    if (userMessages.size > 0) {
                        lastMessages = userMessages.map(msg => `${msg.author.tag}: ${msg.content}`).join('\n');
                    }

                    await channel.delete();
                    
                    const [author, id] = channel.name.split("-");

                    const deletedTicketEmbed = new EmbedBuilder()
                        .setTitle('Ticket LOG')
                        .setColor('Red')
                        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`Ostatnie 10 wiadomości z kanału:\n${lastMessages}`)
                        .addFields(
                            { name: 'AUTOR TICKETA', value: `<@${id}> (${author})` },
                            { name: 'ZAMKNIĘTO', value: `${time(new Date(), TimestampStyles.RelativeTime)}` },
                            { name: 'PRZEZ', value: `<@${interaction.user.id}>` },
                        )
                        .setTimestamp()
                        .setFooter({ text: 'System ticketów' });
                
                    interaction.guild.channels.cache.get(ticketLogsChannelId).send({ embeds: [deletedTicketEmbed] });
                }
            }, 30000);
            
        } else if (interaction.customId === 'cancelTicketDeletion') {
            interaction.update({
                content: 'Anulowano zamykanie ticketa.',
                components: [],
                ephemeral: true
            });
        }
    }
};