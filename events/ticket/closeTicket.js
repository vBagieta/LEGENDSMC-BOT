const { Events,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (interaction.customId === 'closeTicketButton') {

            const confirmTicketDeletion = new ButtonBuilder()
			    .setCustomId('confirmTicketDeletion')
			    .setLabel('Potwierdzam zamknięcie zgłoszenia.')
			    .setStyle(ButtonStyle.Danger);

            const cancelTicketDeletion = new ButtonBuilder()
			    .setCustomId('cancelTicketDeletion')
			    .setLabel('Anuluj.')
			    .setStyle(ButtonStyle.Success);

            const components = new ActionRowBuilder()
                .addComponents(confirmTicketDeletion, cancelTicketDeletion);

            await interaction.reply({
                content: 'Czy napewno chcesz zamknać to zgłoszenie?',
                components: [components],
                ephemeral: true
            });
        }
    }
};