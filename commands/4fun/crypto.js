const { SlashCommandBuilder,
    EmbedBuilder, 
    codeBlock} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto')
        .setDescription('Sprawdź cenę kryptowaluty.')
        .addStringOption(option =>
            option.setName('crypto-name')
                .setDescription('Podaj nazwę kryptowaluty.').setRequired(true))
        .addBooleanOption(option =>
            option.setName('not-ephemeral')
                .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const crypto = interaction.options.getString('crypto-name');

        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd,eur,pln`);
            if (!response.ok) throw new Error('Nie udało się pobrać informacji o kryptowalucie.');

            const data = await response.json();
            if (!data[crypto]) throw new Error(`Brak informacji o kryptowalucie ${crypto}.`);

            const { usd, eur, pln } = data[crypto];

            const cryptoEmbed = new EmbedBuilder()
                .setTitle(`Cena kryptowaluty ${crypto.toUpperCase()}:`)
                .setColor('DarkBlue')
                .setTimestamp()
                .addFields(
                    { name: 'USD', value: `${usd}`, inline: true },
                    { name: 'EUR', value: `${eur}`, inline: true },
                    { name: 'PLN', value: `${pln}`, inline: true }
                )
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({
                embeds: [cryptoEmbed],
                ephemeral: ephemeralBoolean
            });

        } catch (error) {

            const errorEmbed = new EmbedBuilder()
                .setTitle('Wystąpił błąd podczas pobierania danych z API')
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