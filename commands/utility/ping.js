const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Sprawdź status bota.')
        .addBooleanOption(option => option.setName('notephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
	async execute(interaction) {

        const ephemeral = interaction.options.getBoolean('notephemeral');
        
        if (ephemeral == null) {
            var ephemeralBoolean = true;
        } else {
            var ephemeralBoolean = !ephemeral
        }

        const pingEmbed = new EmbedBuilder()
            .setTitle('Pong :ping_pong:')
            .setColor('DarkBlue')
            .setDescription('Bot działa! - Wpisz /help po listę komend')
            .addFields(
                { name: 'PING', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true},
                { name: 'DEVELOPER', value: '[Dołącz na serwer](https://discord.gg/KWuQ43Vf8u)', inline: true},
                { name: 'SOURCECODE', value: '[GitHub](https://github.com/vBagieta/andrzejbot)', inline: true}
            )
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
            .setTimestamp()
        
		await interaction.reply({ embeds: [pingEmbed], ephemeral: ephemeralBoolean })  
	},
};