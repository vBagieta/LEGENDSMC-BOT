const { Events,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (interaction.customId === 'closeTicketButton') {

            const confirmTicketDeletionWithReason = new ButtonBuilder()
			    .setCustomId('confirmTicketDeletionWithReason')
			    .setLabel('Zamknij zgłoszenie z powodem.')
			    .setStyle(ButtonStyle.Danger);

            const confirmTicketDeletionWithotReason = new ButtonBuilder()
			    .setCustomId('confirmTicketDeletionWithotReason')
			    .setLabel('Zamknij zgłoszenie bez powodu.')
			    .setStyle(ButtonStyle.Danger);

            const cancelTicketDeletion = new ButtonBuilder()
			    .setCustomId('cancelTicketDeletion')
			    .setLabel('Anuluj zamykanie.')
			    .setStyle(ButtonStyle.Success);

            const components = new ActionRowBuilder()
                .addComponents(confirmTicketDeletionWithReason, confirmTicketDeletionWithotReason, cancelTicketDeletion);

            await interaction.reply({
                content: 'Wybierz opcję zamykania zgłoszenia.',
                components: [components],
                ephemeral: true
            });
        }
    }
};