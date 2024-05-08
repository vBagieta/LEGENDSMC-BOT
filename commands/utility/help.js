const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Wyświetl listę komend.')
        .addBooleanOption(option => option.setName('ephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
	async execute(interaction) {

        const ephemeral = interaction.options.getBoolean('ephemeral');

        if (ephemeral == null) {
            var ephemeralBoolean = true;
        } else {
            var ephemeralBoolean = ephemeral
        }

        const helpEmbed = new EmbedBuilder()
            .setTitle('Lista komenda')
            .setColor('DarkBlue')
            .setDescription('**Andrzej Prochownik**' + '\n`/quote` - Cytat Andrzeja\n`/image` - Zdjęcie Andrzeja\n`/legacy`'
                + ' - Historia i dziedzictwo Andrzeja' + '\n\n**Nauczyciele**\n`/otherquote` - Cytat Nauczyciela ZSE' 
                + '\n\n**4FUN**\n`/crypto` - Sprawdź cene kryptowaluty\n`/cat` - Losowe zdjęcie kota'
                + '\n`/shiba` - Losowe zdjęcie shiby\n`/httpcat` - Losowe zdjęcie kota kodu HTTP\n\n**Inne**\n'
                + '`/user` - Sprawdź profil użytkownika\n`/server` - Informacje o serwerze\n`/ping` - Status bota')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
            .setTimestamp()
        
		await interaction.reply({ embeds: [helpEmbed], ephemeral: ephemeralBoolean })  
	},
};