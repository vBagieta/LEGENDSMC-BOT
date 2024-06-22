const { SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Wyświetl listę komend.')
        .addBooleanOption(option =>
            option.setName('not-ephemeral')
                .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;
        const member = interaction.guild.members.cache.get(interaction.user.id);

        const userEmbed = new EmbedBuilder()
            .setTitle('Lista komend - UŻYTKOWNIK')
            .setDescription('Komendy niedługo się tutaj pojawią.')
            .setColor('DarkBlue')
            .setTimestamp()
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        });

        if (member.permissions.has(PermissionsBitField.KickMembers)) {

            const adminEmbed = new EmbedBuilder()
                .setTitle('Lista komend - ADMIN')
                .setDescription(
                    '**System zgłoszeń**\n' +
                    '</send:1254156301894815862> - Wyślij ponownie panel zgłoszeń.\n' +
                    '</create:1254156301894815860> - Utworz ręcznie zgłoszenie dla użytkownika.\n' +
                    '</search:1254156301894815861> - Szukaj zgłoszeń ręcznie.'
                )
                .setColor('Red');

            await interaction.reply({
                embeds: [adminEmbed, userEmbed],
                ephemeral: true
            });

        } else {

            await interaction.reply({
                embeds: [userEmbed],
                ephemeral: ephemeralBoolean
            });
        }
    },
};