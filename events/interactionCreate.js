const { Events, EmbedBuilder, codeBlock } = require('discord.js');
const { CombinedError, CombinedPropertyError } = require('@sapphire/shapeshift');

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
                        { name: 'ERROR', value: codeBlock(error.stack || error), inline: true },
                    )
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            } else {
                let errorMessage;
                if (error instanceof CombinedError) {
                    errorMessage = error.errors.map(err => err.message).join('\n');
                } else if (error instanceof CombinedPropertyError) {
                    errorMessage = error.errors.map(err => err[0].message).join('\n');
                } else {
                    errorMessage = error.stack || error;
                }

                const errorEmbed = new EmbedBuilder()
                    .setTitle('Wystąpił błąd.')
                    .setColor('Red')
                    .setDescription('Zgłoś ten błąd deweloperowi')
                    .addFields(
                        { name: 'ERROR', value: codeBlock(error) },
						{ name: 'STACK ERROR', value: codeBlock(errorMessage) },
                    )
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            }
        }
    },
};
