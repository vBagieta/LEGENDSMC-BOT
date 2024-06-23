const { ticketCategoryId, adminRoleId } = require('../../configs/main.json');
const { Events,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    channelMention,
    codeBlock, 
    userMention,
    italic } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.customId === 'ticketMenuSelector') {
            const channel = interaction.guild.channels.cache.find(channel => new RegExp(interaction.user.id).test(channel.name))

            if (channel) {
                existingTicketEmbed = new EmbedBuilder()
                    .setTitle('Możesz mieć tylo jedno aktywne zgłoszenie')
                    .setDescription('Twoje aktualne zgłoszenie: ' + channelMention(channel.id))
                    .setColor('Red')
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();

                return interaction.reply({
                    embeds: [existingTicketEmbed],
                    ephemeral: true
                });

            } else {

                const permissionOverwrites = [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                    { id: adminRoleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                ];

                const createdTicket = await interaction.guild.channels.create({
                    name: `${interaction.user.username}-${interaction.user.id}`,
                    type: ChannelType.GuildText,
                    parent: ticketCategoryId,
                    permissionOverwrites,
                });  

                const closeTicketButton = new ButtonBuilder()
                    .setCustomId('closeTicketButton')
                    .setLabel('Zamknij')
                    .setStyle(ButtonStyle.Danger);

                const components = new ActionRowBuilder()
                    .addComponents(closeTicketButton);

                if (createdTicket) {
                    if (interaction.values && interaction.values.length > 0) {
                        const ticketReasons = interaction.values[0];
                        if (ticketReasons === 'ticketFirstOption') {
                            ticketDescription = 'Znalezienie błędu na serwerze.';
                        } else if (ticketReasons === 'ticketSecondOption') {
                            ticketDescription = 'Podzielenie się propozycją.';
                        } else if (ticketReasons === 'ticketThirdOption') {
                            ticketDescription = 'Użytkownik ma inny powód zgłoszenia.'
                        }
                    }

                    const createdTicketEmbed = new EmbedBuilder()
                        .setTitle('Pomyślnie utworzono zgłoszenie!')
                        .setDescription('Kanał twojego zgłoszenia: ' + channelMention(createdTicket.id))
                        .setColor('DarkBlue')
                        .setTimestamp()
                        .setFooter({
                            text: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                        });

                    interaction.reply({
                        embeds: [createdTicketEmbed],
                        ephemeral: true
                    });

                    const ticketEmbed = new EmbedBuilder()
                        .setTitle(`Zgłoszenie ${interaction.user.username}:`)
                        .setAuthor({
                            name: interaction.user.globalName,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                        })
                        .addFields(
                            { name: 'Powód zgłoszenia', value: codeBlock(ticketDescription) }
                        )
                        .setColor('DarkBlue')
                        .setTimestamp()
                        .setFooter({
                            text: 'System zgłoszeń',
                            iconURL: interaction.guild.iconURL({ dynamic: true })
                        });

                    interaction.guild.channels.cache.get(createdTicket.id).send({
                        components: [components],
                        embeds: [ticketEmbed],
                    });

                } else {
                    
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('Nie udalo utworzyć się zgłoszenia.')
                        .setColor('Red')
                        .setTimestamp()
                        .setFooter({
                            text: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                        });

                    interaction.reply({
                        embeds: [errorEmbed],
                        ephemeral: true
                    })
                }
            }
        }
    }
};