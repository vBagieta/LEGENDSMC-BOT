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

            if (interaction.guild.channels.cache.find(channel => new RegExp(interaction.user.id).test(channel.name))) {
                interaction.reply({ content: 'Możesz utworzyć tylko 1 ticket.', ephemeral: true})
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
                            ticketDescription = 'znalazł błąd na serwerze!';
                        } else if (firstValue === 'ticketSecondOption') {
                            ticketDescription = 'chce podzeilić się swoją propozycją!';
                        }
                    }
                    interaction.reply({ content: `Pomyślnie stworzono ticket! <#${createdTicket.id}>`, ephemeral: true });

                    const ticketEmbed = new EmbedBuilder()
                        .setTitle(`Ticket użytkownika ${interaction.user.username}`)
                        .setDescription(`<@${interaction.user.id}> ${ticketDescription}`)
                        .setAuthor({ name: interaction.user.globalName, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setColor('DarkBlue')
                        .setTimestamp()
                        .setFooter({ text: 'System ticketów' })

                    interaction.guild.channels.cache.get(createdTicket.id).send({
                        components: [components],
                        embeds: [ticketEmbed]
                    });
                } else {
                    interaction.reply({ content: 'Nie udalo utworzyć się ticketa.', ephemeral: true })
                }
            }
        }
    }
};