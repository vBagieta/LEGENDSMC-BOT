const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Wyświetl listę komend.')
        .addBooleanOption(option => option.setName('notephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
	async execute(interaction) {

        const ephemeral = interaction.options.getBoolean('notephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        const helpEmbed = new EmbedBuilder()
            .setTitle('Lista komenda')
            .setColor('Red')
            .setDescription('Komendy pojawią się tutaj niedługo.')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
            .setTimestamp()
        
		await interaction.reply({ embeds: [helpEmbed], ephemeral: ephemeralBoolean })  
	},
};