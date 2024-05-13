const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Sprawdź informacje o serwerze.')
        .addBooleanOption(option => option.setName('not-ephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
    async execute(interaction) {
        const guildDateCreatedTimestamp = time(interaction.guild.createdAt, TimestampStyles.RelativeTime);

        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        const serverEmbed = new EmbedBuilder()
            .setTitle(interaction.guild.name)
            .setColor('DarkBlue')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription('Informacje o tym serwerze:')
            .addFields(
                { name: 'Liczba użytkowników', value: `${interaction.guild.memberCount}`, inline: true },
                { name: 'Data powstania', value: guildDateCreatedTimestamp, inline: true },
                { name: 'Właściciel', value: `<@${interaction.guild.ownerId}> :crown:`, inline: true },
                { name: 'Identyfikator', value: interaction.guild.id, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [serverEmbed], ephemeral: ephemeralBoolean });
    },
};