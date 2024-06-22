const { SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    userMention,
    channelMention } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Szukaj zgłoszeń.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Wybierz użytkownika.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (!user || user.bot) {

            const errorEmbed = new EmbedBuilder()
                .setTitle('Nieprawidłowy użytkownik.')
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

        const channel = interaction.guild.channels.cache.find(channel => new RegExp(user.id).test(channel.name));

        if (channel) {

            const foundChannelEmbed = new EmbedBuilder()
                .setDescription(`Znaleziono zgłoszenie dla ${userMention(user.id)}\nKanał znalezionego zgłoszenia: ` + channelMention(channel.id))
                .setColor('DarkBlue')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

            interaction.reply({
                embeds: [foundChannelEmbed],
                ephemeral: true
            });

        } else {

            const noChannelEmbed = new EmbedBuilder()
                .setDescription(`Użytkownik ${userMention(user.id)} nie ma aktywnego zgłoszenia.`)
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

            interaction.reply({ embeds:
                [noChannelEmbed],
                ephemeral: true
            });
        }
	}
};