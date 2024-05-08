const { Events, EmbedBuilder, codeBlock } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				const errorEmbed = new EmbedBuilder()
                	.setTitle('Wystąpił błąd.')
					.setColor('Red')
					.setDescription('Zgłoś ten błąd deweloperowi')
                	.addFields(
                    	{ name: 'ERROR', value: codeBlock(`${error}`), inline: true },
                	)
                	.setTimestamp()
					.setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
			} else {
                const errorEmbed = new EmbedBuilder()
                	.setTitle('Wystąpił błąd.')
					.setColor('Red')
					.setDescription('Zgłoś ten błąd deweloperowi')
                	.addFields(
                    	{ name: 'ERROR', value: codeBlock(`${error}`), inline: true },
                	)
                	.setTimestamp()
					.setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
			}
		}
	},
};