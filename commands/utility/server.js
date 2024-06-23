const { SlashCommandBuilder, EmbedBuilder, TimestampStyles, time, inlineCode } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Sprawdź informacje o serwerze.')
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const guildDateCreatedTimestamp = time(interaction.guild.createdAt, TimestampStyles.RelativeTime);
        const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

        const serverEmbed = new EmbedBuilder()
            .setTitle(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`Informacje o serwerze ${interaction.guild.name}:`)
            .addFields(
                { name: 'Liczba użytkowników', value: `${interaction.guild.memberCount} :people_hugging:`, inline: true },
                { name: 'Data powstania', value: `${guildDateCreatedTimestamp} :calendar:`, inline: true },
                { name: 'Właściciel', value: `<@${interaction.guild.ownerId}> :crown:`, inline: true },
                { name: 'Identyfikator', value: inlineCode(`${interaction.guild.id}`), inline: true }
            )
            .setColor('DarkBlue')
            .setTimestamp()
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        await interaction.reply({
            embeds: [serverEmbed],
            ephemeral: ephemeral
        });
    },
};