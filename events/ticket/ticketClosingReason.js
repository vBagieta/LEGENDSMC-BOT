const { ticketLogsChannelId } = require('../../configs/main.json');
const { Events, EmbedBuilder, time, TimestampStyles } = require('discord.js');

function isBot(message) {
    return message.author.bot;
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.customId === 'closeTicketWithReasonModal') {
            await interaction.reply({ content: 'Zamykam zgłoszenie...', ephemeral: true });

            const channel = interaction.client.channels.cache.get(interaction.channelId);
            if (channel) {
                try {
                    const messages = await channel.messages.fetch({ limit: 10 });

                    const botMessages = messages.filter(isBot);
                    for (const message of botMessages.values()) {
                        try {
                            if (channel.messages.cache.has(message.id)) {
                                await message.delete();
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }

                    let lastMessages = "**Brak ostatnich wiadomości**";
                    const userMessages = messages.filter(message => !isBot(message));
                    if (userMessages.size > 0) {
                        lastMessages = userMessages.map(msg => `${msg.author.tag}: ${msg.content}`).join('\n');
                    }

                    await channel.delete();

                    const [author, id] = channel.name.split("-");
                    const reason = interaction.fields.getTextInputValue('reasonInput');

                    const deletedTicketEmbed = new EmbedBuilder()
                        .setTitle('LOG Zgłoszeń')
                        .setColor('Red')
                        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`Ostatnie 10 wiadomości ze zgłoszenia:\n${lastMessages}`)
                        .addFields(
                            { name: 'AUTOR', value: `<@${id}> (${author})` },
                            { name: 'ZAMKNIĘTO', value: `${time(new Date(), TimestampStyles.RelativeTime)}` },
                            { name: 'PRZEZ', value: `<@${interaction.user.id}>` },
                            { name: 'POWÓD ZAMKNIĘCIA', value: reason },
                        )
                        .setTimestamp()
                        .setFooter({ text: 'System zgłoszeń', iconURL: interaction.guild.iconURL({ dynamic: true }) });

                    interaction.guild.channels.cache.get(ticketLogsChannelId).send({ embeds: [deletedTicketEmbed] });
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
};
