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
		.setName('search')
		.setDescription('Szukaj zgłoszeń.')
        .addUserOption(option => option.setName('user').setDescription('Wybierz użytkownika.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {

        const user = interaction.options.getUser('user');

        const channel = interaction.guild.channels.cache.find(channel => new RegExp(user.id).test(channel.name))
        if (channel) {
            interaction.reply({ content: `Znaleziono zgłoszenie dla <@${user.id}>: <#${channel.id}>`, ephemeral: true})

        } else {
            interaction.reply({ content: `Ten użytkownik nie ma aktywnego zgłoszenia.`, ephemeral: true})
        }
	}
};