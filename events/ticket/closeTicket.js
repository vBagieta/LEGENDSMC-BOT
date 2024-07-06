const { ticketLogsChannelId } = require('../../configs/main.json');
const { Events,
    ButtonBuilder,
    EmbedBuilder,
    ButtonStyle,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    TimestampStyles,
    time,
    userMention,
    codeBlock } = require('discord.js');

function isBot(message) {
        return message.author.bot;
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.customId === 'closeTicketButton') {

            const confirmTicketDeletionWithReason = new ButtonBuilder()
                .setCustomId('confirmTicketDeletionWithReason')
                .setLabel('Zamknij zgłoszenie z powodem.')
                .setStyle(ButtonStyle.Danger);

            const confirmTicketDeletionWithoutReason = new ButtonBuilder()
                .setCustomId('confirmTicketDeletionWithoutReason')
                .setLabel('Zamknij zgłoszenie bez powodu.')
                .setStyle(ButtonStyle.Danger);

            const cancelTicketDeletion = new ButtonBuilder()
                .setCustomId('cancelTicketDeletion')
                .setLabel('Anuluj zamykanie.')
                .setStyle(ButtonStyle.Success);

            const components = new ActionRowBuilder()
                .addComponents(confirmTicketDeletionWithReason, confirmTicketDeletionWithoutReason, cancelTicketDeletion);

            await interaction.reply({
                content: 'Wybierz opcję zamykania zgłoszenia.',
                components: [components],
                ephemeral: true
            });

        }

        if (interaction.customId === 'confirmTicketDeletionWithoutReason') {
            const channel = interaction.client.channels.cache.get(interaction.channelId);

            if (channel) {
                try {
                    const messages = await channel.messages.fetch({ limit: 10 });
                    const botMessages = messages.filter(isBot);

                    for (const message of botMessages.values()) {
                        if (channel.messages.cache.has(message.id)) {
                            await message.delete();
                        }
                    }

                    let lastMessages = "**Brak ostatnich wiadomości**";
                    const userMessages = messages.filter(message => !isBot(message));

                    if (userMessages.size > 0) {
                        lastMessages = userMessages.map(msg => `${msg.author.tag}: ${msg.content}`).join('\n');
                    }

                    await channel.delete();

                    const [owner, id] = channel.name.split("-");
                    const deletedTicketEmbed = new EmbedBuilder()
                        .setTitle(`Zgłoszenie ${owner}:`)
                        .setColor('Red')
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                        })
                        .setDescription(`Ostatnie **10** wiadomości ze zgłoszenia:\n${lastMessages}`)
                        .addFields(
                            { name: 'Autor', value: userMention(id) },
                            { name: 'Zamknięto', value: time(new Date(), TimestampStyles.RelativeTime) },
                            { name: 'Przez', value: userMention(interaction.user.id) }
                        )
                        .setTimestamp()
                        .setFooter({
                            text: 'System zgłoszeń',
                            iconURL: interaction.guild.iconURL({ dynamic: true })
                        });

                    interaction.guild.channels.cache.get(ticketLogsChannelId).send({ embeds: [deletedTicketEmbed] });

                } catch (error) {
                    console.error(error);
                }
            }

        } else if (interaction.customId === 'cancelTicketDeletion') {
            interaction.update({
                content: 'Anulowano zamykanie zgłoszenia.',
                components: [],
                ephemeral: true
            });

        } else if (interaction.customId === 'confirmTicketDeletionWithReason') {
            const ticketClosingModal = new ModalBuilder()
                .setCustomId('closeTicketWithReasonModal')
                .setTitle('Wpisz powód zamknięcia zgłoszenia');

            const reasonInput = new TextInputBuilder()
                .setCustomId('reasonInput')
                .setLabel("Wpisz powód poniżej.")
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(300)
                .setMinLength(10);

            const components = new ActionRowBuilder().addComponents(reasonInput);
            ticketClosingModal.addComponents(components);

            await interaction.showModal(ticketClosingModal);
        }

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

                    const [owner, id] = channel.name.split("-");
                    const reason = interaction.fields.getTextInputValue('reasonInput');

                    const deletedTicketEmbed = new EmbedBuilder()
                        .setTitle(`Zgłoszenie ${owner}:`)
                        .setColor('Red')
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                        })
                        .setDescription(`Ostatnie **10** wiadomości ze zgłoszenia:\n${lastMessages}`)
                        .addFields(
                            { name: 'Autor', value: userMention(id) },
                            { name: 'Zamknięto', value: time(new Date(), TimestampStyles.RelativeTime) },
                            { name: 'Przez', value: userMention(interaction.user.id) },
                            { name: 'Powód', value: codeBlock(reason) },
                        )
                        .setTimestamp()
                        .setFooter({
                            text: 'System zgłoszeń',
                            iconURL: interaction.guild.iconURL({ dynamic: true })
                        });

                    interaction.guild.channels.cache.get(ticketLogsChannelId).send({ embeds: [deletedTicketEmbed] });

                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
};