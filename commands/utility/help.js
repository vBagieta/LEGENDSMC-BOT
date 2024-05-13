const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Wyświetl listę komend.')
        .addBooleanOption(option => option.setName('not-ephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;
        const member = interaction.guild.members.cache.get(interaction.user.id);

        const userEmbed = new EmbedBuilder()
            .setTitle('Lista komend - UŻYTKOWNIK')
            .setColor('DarkBlue')
            .setDescription('Komendy niedługo się tutaj pojawią.')
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        if (member.permissions.has(PermissionsBitField.KickMembers)) {
            const adminEmbed = new EmbedBuilder()
                .setTitle('Lista komend - ADMIN')
                .setColor('Red')
                .setDescription(
                    '**System zgłoszeń**\n' +
                    '`/send` - Wyślij ponownie panel zgłoszeń.\n' +
                    '`/create` - Utworz ręcznie zgłoszenie dla użytkownika.\n' +
                    '`/search` - Szukaj zgłoszeń ręcznie.'
                );

            await interaction.reply({ embeds: [adminEmbed, userEmbed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [userEmbed], ephemeral: ephemeralBoolean });
        }
    },
};