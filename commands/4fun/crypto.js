const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto')
        .setDescription('Sprawdź cene kryptowaluty.')
        .addStringOption(option => option.setName('crypto-name').setDescription('Podaj nazwe kryptowaluty.').setRequired(true))
        .addBooleanOption(option => option.setName('note-phemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
    async execute(interaction) {

        const crypto = interaction.options.getString('crypto-name');
        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        let response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd%2Ceur%2Cpln`
          );
        const data = await response.json();

        if (!response.ok || Object.keys(data).length === 0) {
            const errorEmbed = new EmbedBuilder()
                .setDescription(`Wystąpił błąd przy pobieraniu informacji o kryptowalucie \`${crypto}\``)
                .setColor('Red')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
      
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        };

        let usdPrice = data[crypto].usd;
        let euroPrice = data[crypto].eur;
        let plnPrice = data[crypto].pln;
      
        const cryptoEmbed = new EmbedBuilder()
                .setTitle(`Cena kryptowaluty ${crypto.toUpperCase()}:`)
                .setColor('DarkBlue')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
                .addFields(
                    { name: 'USD', value: `${usdPrice}`, inline: true },
                    { name: 'EURO', value: `${euroPrice}`, inline: true  },
                    { name: 'PLN', value: `${plnPrice}`, inline: true  },
                )
        await interaction.reply({ embeds: [cryptoEmbed], ephemeral: ephemeralBoolean })  
    },
};