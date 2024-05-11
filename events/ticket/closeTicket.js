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
			    .setLabel('Potwierdzam zamknięcie ticketa.')
			    .setStyle(ButtonStyle.Danger);

            const components = new ActionRowBuilder()
                .addComponents(confirmTicketDeletion);

            const response = await interaction.reply({
                content: 'Czy napewno chcesz zamknać tego ticketa?',
                components: [components],
                ephemeral: true
            });

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
	            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

                if (confirmation.customId === 'confirmTicketDeletion') {
                    await confirmation.update({
                        content: 'Ticket zostanie usunięty w ciągu 30 sekund.',
                        components: [],
                    });
                }

            } catch (e) {
	            await interaction.editReply({ content: 'Nie podjąłeś żadnej akcji, anulowanie.', components: [] });
            }

        }
    }
};