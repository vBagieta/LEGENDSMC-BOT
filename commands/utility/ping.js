const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Sprawdź status bota.')
        .addBooleanOption(option => option.setName('ephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
	async execute(interaction) {

        const ephemeral = interaction.options.getBoolean('ephemeral');
        
        if (ephemeral == null) {
            var ephemeralBoolean = true;
        } else {
            var ephemeralBoolean = ephemeral
        }

        const pingEmbed = new EmbedBuilder()
            .setTitle('Pong :ping_pong:')
            .setColor('DarkBlue')
            .setDescription('Bot działa! - Wpisz /help po listę komend')
            .addFields(
                { name: 'PING', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true},
                { name: 'DEVELOPER', value: '[Dołącz na serwer](https://discord.gg/aKbnfnh8kK)', inline: true},
                { name: 'SOURCECODE', value: '[GitHub](https://github.com/vBagieta/LEGENDSMC-BOT)', inline: true}
            )
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
            .setTimestamp()
        
		await interaction.reply({ embeds: [pingEmbed], ephemeral: ephemeralBoolean })  
	},
};