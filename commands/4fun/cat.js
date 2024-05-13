const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Wyświetl losowe zdjęcie kota.')
        .addBooleanOption(option => option.setName('not-ephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        let response = await fetch(
            `https://api.thecatapi.com/v1/images/search`
          );
        const data = await response.json();

        if (!response.ok || Object.keys(data).length === 0) {
            const errorEmbed = new EmbedBuilder()
                .setDescription(`Wystąpił błąd przy pobieraniu wartości z API.`)
                .setColor('Red')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
      
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        };

        let catImage = data[0].url;

        const catEmbed = new EmbedBuilder()
                .setTitle('Meow~')
                .setColor('DarkBlue')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
                .setImage(catImage)
        await interaction.reply({ embeds: [catEmbed], ephemeral: ephemeralBoolean })  
    },
};