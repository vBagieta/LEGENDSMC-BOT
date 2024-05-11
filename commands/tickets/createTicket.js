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

        if (interaction.guild.channels.cache.find(channel => new RegExp(user.id).test(channel.name))) {
            interaction.reply({ content: `Ten użytkownik ma już otwarte zgłoszenie.`, ephemeral: true})

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

                interaction.reply({ content: `Pomyślnie stworzono zgłoszenie dla <@${user.id}>! <#${createdTicket.id}>`, ephemeral: true });

                const ticketEmbed = new EmbedBuilder()
                    .setTitle(`Zgłoszenie: ${interaction.user.username}`)
                    .setDescription(`Administrator <@${interaction.user.id}> utworzył dla użytkownika <@${user.id}> zgłoszenie.`
                        + `\n\nPowód: ${reason}`
                    )
                    .setAuthor({ name: interaction.user.globalName, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setColor('DarkBlue')
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