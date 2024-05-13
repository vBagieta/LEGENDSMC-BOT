const { ticketCategoryId, adminRoleId } = require('../../configs/main.json')
const { SlashCommandBuilder,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Utwórz ręcznie zgłoszenie dla użytkownika.')
        .addUserOption(option => option.setName('user').setDescription('Wybierz użytkownika.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Wpisz powód zgłoszenia.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        if (user.bot) {
            interaction.reply({ content: 'Nie możesz utworzyć zgłoszenia dla bota.', ephemeral: true })
            return;
        }

        const channel = interaction.guild.channels.cache.find(channel => new RegExp(user.id).test(channel.name))
        if (channel) {
            interaction.reply({ content: `Ten użytkownik ma już otwarte zgłoszenie.\nKanał aktywnego zgłoszenia <@${user.id}>: <#${channel.id}>`, ephemeral: true})

        } else {
            const createdTicket = await interaction.guild.channels.create({
                name: `${user.username}-${user.id}`,
                type: ChannelType.GuildText,
                parent: ticketCategoryId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: user.id,
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

                interaction.reply({ content: `Pomyślnie utworzono zgłoszenie dla <@${user.id}>!\nUtworzony kanał zgłoszenia: <#${createdTicket.id}>\nPowód zgłoszenia: \`${reason}\``, ephemeral: true });

                const ticketEmbed = new EmbedBuilder()
                    .setTitle(`Zgłoszenie: ${interaction.user.username}`)
                    .setDescription(`Administrator <@${interaction.user.id}> utworzył zgłoszenie dla użytkownika <@${user.id}>.`)
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
                    .setColor('DarkBlue')
                    .addFields(
                        { name: 'Powód zgłoszenia', value: reason}
                    )
                    .setTimestamp()
                    .setFooter({ text: 'System zgłoszeń', iconURL: interaction.guild.iconURL({ dynamic: true }) });

                interaction.guild.channels.cache.get(createdTicket.id).send({
                    components: [components],
                    embeds: [ticketEmbed]
                });
            } else {
                interaction.reply({ content: 'Nie udało utworzyć się zgłoszenia.', ephemeral: true })
            }
        }
	}
};