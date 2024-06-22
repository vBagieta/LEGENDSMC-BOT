const { SlashCommandBuilder,
    EmbedBuilder,
    TimestampStyles,
    time,
    inlineCode,
    userMention } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Sprawdź profil dowolnego gracza.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Wybierz użytkownika.')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('not-ephemeral')
                .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);

        const userCreatedTimestamp = time(user.createdAt, TimestampStyles.RelativeTime);
        const userJoinedTimestamp = time(member.joinedAt, TimestampStyles.RelativeTime);

        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        if (user && user.bot) {

            const errorEmbed = new EmbedBuilder()
                .setTitle('Wybierz gracza, nie bota.')
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

        } else {

            const userEmbed = new EmbedBuilder()
                .setTitle(user.tag)
                .setDescription(`Informacje o użytkowniku ${userMention(user.id)}:`)
                .addFields(
                    { name: 'Założył konto', value: `${userCreatedTimestamp} :calendar:`, inline: true },
                    { name: 'Dołączył do serwera', value: `${userJoinedTimestamp} :airplane_arriving:`, inline: true },
                    { name: 'Identyfikator', value: inlineCode(user.id), inline: true }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setColor('DarkBlue')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

            await interaction.reply({
                embeds: [userEmbed],
                ephemeral: ephemeralBoolean
            });
        }
    },
};