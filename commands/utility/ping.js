const { SlashCommandBuilder,
    EmbedBuilder,
    userMention } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Sprawdź status bota.')
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

        const pingEmbed = new EmbedBuilder()
            .setTitle(
                `Pong - ${Date.now() - interaction.createdTimestamp}ms :ping_pong:`
            )
            .setDescription(
                `${userMention(interaction.user.id)}, jestem aktywny! `
                + 'Wpisz </help:1254411711205736597> po listę komend.'
            )
            .setColor('DarkBlue')
            .setTimestamp()
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        await interaction.reply({
            embeds: [pingEmbed],
            ephemeral: ephemeral
        });
    },
};