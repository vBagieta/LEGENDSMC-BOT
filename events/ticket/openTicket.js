const { ticketCategoryId, adminRoleId } = require('../../configs/main.json')
const { Events,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (interaction.customId === 'ticketMenuSelector') {

            const channel = interaction.guild.channels.cache.find(channel => new RegExp(interaction.user.id).test(channel.name))
            if (channel) {
                interaction.reply({ content: `Możesz mieć tylo jedno aktywne zgłoszenie. Twoje aktualne zgłoszenie: <#${channel.id}>`, ephemeral: true})
                return;

            } else {

                const createdTicket = await interaction.guild.channels.create({
                    name: `${interaction.user.username}-${interaction.user.id}`,
                    type: ChannelType.GuildText,
                    parent: ticketCategoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                        {
                            id: adminRoleId,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                    ],
                });  

                const closeTicketButton = new ButtonBuilder()
			        .setCustomId('closeTicketButton')
			        .setLabel('Zamknij')
			        .setStyle(ButtonStyle.Danger);

                const components = new ActionRowBuilder()
                    .addComponents(closeTicketButton);

                if (createdTicket) {

                    if (interaction.values && interaction.values.length > 0) {
                        const firstValue = interaction.values[0];
                        if (firstValue === 'ticketFirstOption') {
                            ticketDescription = 'Znalezienie błędu na serwerze.';
                        } else if (firstValue === 'ticketSecondOption') {
                            ticketDescription = 'Podzielenie się propozycją.';
                        }
                    }
                    interaction.reply({ content: `Pomyślnie utworzono zgłoszenie! <#${createdTicket.id}>`, ephemeral: true });

                    const ticketEmbed = new EmbedBuilder()
                        .setTitle(`Zgłoszenie: ${interaction.user.username}`)
                        .setDescription(`Użytkownik <@${interaction.user.id}> utworzył zgłoszenie.`)
                        .setAuthor({ name: interaction.user.globalName, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setColor('DarkBlue')
                        .addFields(
                            { name: 'Powód zgłoszenia', value: ticketDescription}
                        )
                        .setTimestamp()
                        .setFooter({ text: 'System zgłoszeń', iconURL: interaction.guild.iconURL({ dynamic: true }) });

                    interaction.guild.channels.cache.get(createdTicket.id).send({
                        components: [components],
                        embeds: [ticketEmbed]
                    });
                } else {
                    interaction.reply({ content: 'Nie udalo utworzyć się zgłoszenia.', ephemeral: true })
                }
            }
        }
    }
};