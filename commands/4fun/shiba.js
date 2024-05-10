const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shiba')
        .setDescription('Wyświetl losowe zdjęcie shiby.')
        .addBooleanOption(option => option.setName('notephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
    async execute(interaction) {

        const ephemeral = interaction.options.getBoolean('notephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        const response = await fetch(
            `https://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`
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

        let shibaImage = data[0];

        const shibaEmbed = new EmbedBuilder()
                .setTitle('Woof!')
                .setColor('DarkBlue')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
                .setImage(shibaImage)
        await interaction.reply({ embeds: [shibaEmbed], ephemeral: ephemeralBoolean })  
    },
};