const { SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Wyświetl listę komend.')
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
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
                    '**System zgłoszeń**\n'
                    + '</send:1254411711205736595> - Wyślij ponownie panel zgłoszeń.\n'
                    + '</create:1254411711205736593> - Utworz ręcznie zgłoszenie dla użytkownika.\n'
                    + '</search:1254411711205736594> - Szukaj zgłoszeń ręcznie.\n'
                    + '</close:1254411711205736592> - Zamknij ręcznie zgłoszenie'
                )
                .setColor('Red');

            await interaction.reply({
                embeds: [adminEmbed, userEmbed],
                ephemeral: true
            });

        } else {

            await interaction.reply({
                embeds: [userEmbed],
                ephemeral: ephemeral
            });
        }
    },
};