const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('httpcat')
        .setDescription('Wyświetl losowe zdjęcie kota, które odpowiada błędowi HTTP.')
        .addIntegerOption(option =>
            option.setName('http-code')
                .setDescription('Wybierz ręcznie kota, odpowiadającego wybranemu kodowi HTTP.'))
        .addBooleanOption(option =>
            option.setName('not-ephemeral')
                .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const httpOptionCode = interaction.options.getInteger('http-code');

        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        const httpCodes = [
            '100', '101', '102', '103', '200', '201', '202', '203', '204', '205', '206', '207', '208', '214', '226',
            '300', '301', '302', '303', '304', '305', '307', '308', '400', '401', '402', '403', '404', '405', '406',
            '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '420', '421', '422',
            '423', '424', '425', '426', '428', '429', '431', '444', '450', '451', '497', '498', '499', '500', '501',
            '502', '503', '504', '507', '508', '509', '510', '511', '521', '522', '523', '525', '530', '599',
        ];

        let httpCode = httpOptionCode && httpCodes.includes(httpOptionCode.toString()) ? httpOptionCode.toString() : httpCodes[Math.floor(Math.random() * httpCodes.length)];

        try {
            const httpCatEmbed = new EmbedBuilder()
                .setTitle('Meow~')
                .setColor('DarkBlue')
                .setImage(`https://http.cat/${httpCode}`)
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({
                embeds: [httpCatEmbed],
                ephemeral: ephemeralBoolean
            });

        } catch (error) {

            const errorEmbed = new EmbedBuilder()
                .setDescription('Wystąpił błąd podczas pobierania danych z API.')
                .setDescription('Błąd: ' + codeBlock(error))
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