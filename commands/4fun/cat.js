const { SlashCommandBuilder, EmbedBuilder, codeBlock} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Wyświetl losowe zdjęcie kota.')
        .addBooleanOption(option =>
            option
                .setName('not-ephemeral')
        .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        try {
            const response = await fetch(`https://api.thecatapi.com/v1/images/search`);
            if (!response.ok) throw new Error('Nie udało się pobrać danych z API.');

            const data = await response.json();
            if (!data || !data.length) throw new Error('Brak danych z API.');

            const catImage = data[0].url;
            const catEmbed = new EmbedBuilder()
                .setTitle('Meow~')
                .setColor('DarkBlue')
                .setImage(catImage)
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({
                embeds: [catEmbed],
                ephemeral: ephemeralBoolean
            });

        } catch (error) {

            const errorEmbed = new EmbedBuilder()
                .setTitle('Wystąpił błąd podczas pobierania danych z API')
                .setDescription('Błąd:\n' + codeBlock(error.message))
                .setColor('Red')
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    },
};