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
                content: 'Zgłoszenie zostanie zamknięte w ciągu 30 sekund.',
                components: [],
                ephemeral: true
            })

            await interaction.guild.channels.cache.get(interaction.channelId).send(
                `To zgłoszenie zostanie zamknięte ${time(new Date(new Date().setSeconds(new Date().getSeconds() + 30)), TimestampStyles.RelativeTime)}` +
                `\nZainicjowano zamknięcie przez: <@${interaction.user.id}>`
            )



            const timer = setTimeout(async () => {
                const channel = interaction.client.channels.cache.get(interaction.channelId);
                if (channel) {
                    const messages = await channel.messages.fetch({ limit: 10 });

                    const botMessages = messages.filter(isBot);
                    botMessages.forEach(async message => {
                        try {
                            if (channel.messages.cache.has(message.id)) {
                                await message.delete();
                            }
                        } catch (error) {
                        }
                    });

                    let lastMessages = "**Brak ostatnich wiadomośći**";
                    const userMessages = messages.filter(message => !isBot(message));
                    if (userMessages.size > 0) {
                        lastMessages = userMessages.map(msg => `${msg.author.tag}: ${msg.content}`).join('\n');
                    }

                    await channel.delete();
                    
                    const [author, id] = channel.name.split("-");

                    const deletedTicketEmbed = new EmbedBuilder()
                        .setTitle('LOG Zgłoszeń')
                        .setColor('Red')
                        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`Ostatnie 10 wiadomości ze zgłoszenia:\n${lastMessages}`)
                        .addFields(
                            { name: 'AUTOR', value: `<@${id}> (${author})` },
                            { name: 'ZAMKNIĘTO', value: `${time(new Date(), TimestampStyles.RelativeTime)}` },
                            { name: 'PRZEZ', value: `<@${interaction.user.id}>` }
                        )
                        .setTimestamp()
                        .setFooter({ text: 'System zgłoszeń', iconURL: interaction.guild.iconURL({ dynamic: true }) });
                
                    interaction.guild.channels.cache.get(ticketLogsChannelId).send({ embeds: [deletedTicketEmbed] });
                }
            }, 30000);
            
        } else if (interaction.customId === 'cancelTicketDeletion') {
            interaction.update({
                content: 'Anulowano zamykanie zgłoszenia.',
                components: [],
                ephemeral: true
            });
        }
    }
};
