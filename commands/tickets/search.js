const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Szukaj zgłoszeń.')
        .addUserOption(option => option.setName('user').setDescription('Wybierz użytkownika.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (!user || user.bot) {
            return interaction.reply({ content: 'Nieprawidłowy użytkownik.', ephemeral: true });
        }

        const channel = interaction.guild.channels.cache.find(channel => new RegExp(user.id).test(channel.name));
        if (channel) {
            interaction.reply({ content: `Znaleziono zgłoszenie dla <@${user.id}>.\nKanał znalezionego zgłoszenia: <#${channel.id}>`, ephemeral: true});
        } else {
            interaction.reply({ content: `Użytkownik <@${user.id}> nie ma aktywnego zgłoszenia.`, ephemeral: true});
        }
	}
};