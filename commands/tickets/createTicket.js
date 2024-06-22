const { ticketCategoryId, adminRoleId } = require('../../configs/main.json');
const { SlashCommandBuilder,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    PermissionFlagsBits,
    userMention,
    channelMention,
    codeBlock } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Utwórz ręcznie zgłoszenie dla użytkownika.')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Wybierz użytkownika.')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Wpisz powód zgłoszenia.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        if (user.bot) {
            const botEmbed = new EmbedBuilder()
                .setTitle('Nie możesz utworzyć zgłoszenia dla bota.')
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            return interaction.reply({
                embeds: [botEmbed],
                ephemeral: true
            });
        }

        const existingTicket = interaction.guild.channels.cache.find(channel => new RegExp(user.id).test(channel.name));

        if (existingTicket) {
            const existingTicketEmbed = new EmbedBuilder()
                .setTitle('Ten użytkownik ma już otwarte zgłoszenie.')
                .setDescription(`Kanał otwartego zgłoszenia: ${channelMention(existingTicket.id)}`)
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            return interaction.reply({
                embeds: [existingTicketEmbed],
                ephemeral: true
            });
        }

        const permissionOverwrites = [
            { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
            { id: adminRoleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
        ];

        try {

            const createdTicket = await interaction.guild.channels.create({
                name: `${user.username}-${user.id}`,
                type: ChannelType.GuildText,
                parent: ticketCategoryId,
                permissionOverwrites,
            });

            const ticketEmbed = new EmbedBuilder()
                .setTitle(`Zgłoszenie: ` + user.username)
                .setDescription(`Administrator ${userMention(interaction.user.id)} utworzył zgłoszenie dla użytkownika ${userMention(user.id)}.`)
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
                .setColor('DarkBlue')
                .addFields(
                    { name: 'Powód zgłoszenia', value: reason}
                )
                .setTimestamp()
                .setFooter({ text: 'System zgłoszeń', iconURL: interaction.guild.iconURL({ dynamic: true }) });

            const closeTicketButton = new ButtonBuilder()
                .setCustomId('closeTicketButton')
                .setLabel('Zamknij')
                .setStyle(ButtonStyle.Danger);

            const components = new ActionRowBuilder().addComponents(closeTicketButton);

            const createdTicketEmbed = new EmbedBuilder()
                .setDescription(`Pomyślnie utworzono zgłoszenie dla ${userMention(user.id)}!\nUtworzony kanał zgłoszenia: ${channelMention(createdTicket.id)}\nPowód zgłoszenia: \`${reason}\``)
                .setColor('DarkBlue')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            interaction.reply({ embeds: [createdTicketEmbed], ephemeral: true });
            interaction.guild.channels.cache.get(createdTicket.id).send({ components: [components], embeds: [ticketEmbed] });

        } catch (error) {

            console.error(error);

            const errorEmbed = new EmbedBuilder()
                .setTitle('Nie udało się utworzyć zgłoszenia.')
                .setDescription('Błąd:\n' + codeBlock(error))
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            return interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
	}
};