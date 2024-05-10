const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Wyświetl losowe zdjęcie kota.')
        .addBooleanOption(option => option.setName('notephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
    async execute(interaction) {

        const ephemeral = interaction.options.getBoolean('notephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        let response = await fetch(
            `https://api.thecatapi.com/v1/images/search`
          );
        const data = await response.json();
        let catImage = data[0].url;

        const cryptoEmbed = new EmbedBuilder()
                .setTitle('Meow~')
                .setColor('DarkBlue')
                .setFooter({ text: `${interaction.user.username} | api.thecatapi.com`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
                .setImage(catImage)
        await interaction.reply({ embeds: [cryptoEmbed], ephemeral: ephemeralBoolean })  
    },
};