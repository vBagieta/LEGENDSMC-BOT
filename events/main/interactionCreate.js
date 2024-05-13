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
            const errorMessage = (error instanceof CombinedError) ?
                error.errors.map(err => err.message).join('\n') :
                (error instanceof CombinedPropertyError) ?
                error.errors.map(err => err[0].message).join('\n') :
                error.stack || error;

            const errorEmbed = new EmbedBuilder()
                .setTitle('Wystąpił błąd.')
                .setColor('Red')
                .setDescription('Zgłoś ten błąd deweloperowi')
                .addFields(
                    { name: 'ERROR', value: codeBlock(error.stack || error) },
                    { name: 'STACK ERROR', value: codeBlock(errorMessage) }
                )
                .setTimestamp()
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};