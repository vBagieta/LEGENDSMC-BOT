const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('httpcat')
        .setDescription('Wyświetl losowe zdjęcie kota, które odpowiada błędu HTTP.')
        .addBooleanOption(option => option.setName('notephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
    async execute(interaction) {

        const ephemeral = interaction.options.getBoolean('notephemeral');

        if (ephemeral == null) {
            var ephemeralBoolean = true;
        } else {
            var ephemeralBoolean = !ephemeral
        }

        const httpCodes = [
            '100',
            '101',
            '102',
            '103',
            '200',
            '201',
            '202',
            '203',
            '204',
            '205',
            '206',
            '207',
            '208',
            '214',
            '226',
            '300',
            '301',
            '302',
            '303',
            '304',
            '305',
            '307',
            '308',
            '400',
            '401',
            '402',
            '403',
            '404',
            '405',
            '406',
            '407',
            '408',
            '409',
            '410',
            '411',
            '412',
            '413',
            '414',
            '415',
            '416',
            '417',
            '418',
            '420',
            '421',
            '422',
            '423',
            '424',
            '425',
            '426',
            '428',
            '429',
            '431',
            '444',
            '450',
            '451',
            '497',
            '498',
            '499',
            '500',
            '501',
            '502',
            '503',
            '504',
            '507',
            '508',
            '509',
            '510',
            '511',
            '521',
            '522',
            '523',
            '525',
            '530',
            '599',
        ]


        const random = Math.floor(Math.random() * httpCodes.length);
        const pickedCode = httpCodes[random];

        const httpCatImage = `https://http.cat/${pickedCode}`

        const cryptoEmbed = new EmbedBuilder()
                .setTitle('Meow~')
                .setColor('DarkBlue')
                .setFooter({ text: `${interaction.user.username} | http.cat`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
                .setImage(httpCatImage)
        await interaction.reply({ embeds: [cryptoEmbed], ephemeral: ephemeralBoolean })  
    },
};