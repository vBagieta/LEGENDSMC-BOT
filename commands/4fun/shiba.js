const { SlashCommandBuilder,
    EmbedBuilder,
    codeBlock } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shiba')
        .setDescription('Wyświetl losowe zdjęcie shiby.')
        .addBooleanOption(option =>
            option.setName('not-ephemeral')
                .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        try {

            const response = await fetch(`https://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`);
            if (!response.ok) throw new Error('Nie udało się pobrać danych z API.');

            const data = await response.json();
            if (!data.length) throw new Error('Brak danych z API.');

            const shibaImage = data[0];
            const shibaEmbed = new EmbedBuilder()
                .setTitle('Woof!')
                .setImage(shibaImage)
                .setColor('DarkBlue')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({
                embeds: [shibaEmbed],
                ephemeral: ephemeralBoolean
            });

        } catch (error) {

            const errorEmbed = new EmbedBuilder()
                .setTitle('Wystąpił błąd podczas pobierania danych z API.')
                .setDescription('Błąd:\n' + codeBlock(error.message))
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    },
};