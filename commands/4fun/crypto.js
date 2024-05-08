const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');
const { fetch } = require('undici');

const isEmptyObject = (obj) => Object.keys(obj).length === 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto')
        .setDescription('Sprawdź cene kryptowaluty.')
        .addStringOption(option => option.setName('crypto').setDescription('Podaj nazwe kryptowaluty.').setRequired(true))
        .addBooleanOption(option => option.setName('ephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
    async execute(interaction) {

        const crypto = interaction.options.getString('crypto');
        const ephemeral = interaction.options.getBoolean('ephemeral');

        if (ephemeral == null) {
            var ephemeralBoolean = true;
        } else {
            var ephemeralBoolean = ephemeral
        }

        let response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd%2Ceur%2Cpln`
          );
        const data = await response.json();

        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd%2Ceur%2Cpln`)
        } catch (error) {
            const embed = new EmbedBuilder()
                .setDescription(`Błąd podczas próby połączenia z API.`)
                .addFields(
                    { name: "ERROR", value: codeBlock(`${error}`) }
                )
                .setColor('Red')
                .setFooter({ text: `${interaction.user.username} | api.coingecko.com`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
      
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

        if (isEmptyObject(data)) {
            const embed = new EmbedBuilder()
                .setDescription(`API nie zwróciło daych, czy kryptowaluta **${crypto}** istnieje?`)
                .setColor('Red')
                .setFooter({ text: `${interaction.user.username} | api.coingecko.com`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
      
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

        let usdPrice = data[crypto].usd;
        let euroPrice = data[crypto].eur;
        let plnPrice = data[crypto].pln;
      
        const cryptoEmbed = new EmbedBuilder()
                .setTitle(`Cena kryptowaluty ${crypto.toUpperCase()}:`)
                .setColor('DarkBlue')
                .setFooter({ text: `${interaction.user.username} | api.coingecko.com`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
                .addFields(
                    { name: 'USD', value: `${usdPrice}`, inline: true },
                    { name: 'EURO', value: `${euroPrice}`, inline: true  },
                    { name: 'PLN', value: `${plnPrice}`, inline: true  },
                )
        await interaction.reply({ embeds: [cryptoEmbed], ephemeral: ephemeralBoolean })  
    },
};