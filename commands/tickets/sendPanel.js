const { ticketMessageChannelId } = require('../../configs/main.json');
const { EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
    } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket-send')
		.setDescription('Wyślij panel ticketów na kanał.'),

	async execute(interaction) {

        const ticketMenuEmbed = new EmbedBuilder()
                .setTitle('Informacja dotycząca ticketów')
                .setDescription('Aby stworzyć ticket, by móc szybko skontaktować się z Administracją'
                + 'naciśnij przycisk poniżej. Następnie postępuj zgodnie z instrukcją. Czas oczekiwania nie jest określony.'
                + '\n\n**Wysyłanie bezsensownych ticketów bedzię karane banem permanentym na discordzie.**')
                .setColor('Yellow')
                .setFooter({ text: 'System ticketów' })

        const ticketMenuSelector = new ActionRowBuilder()
            .setComponents(
            new StringSelectMenuBuilder()
                .setCustomId("ticketMenuSelector")
                .setPlaceholder("Wybierz Kategorię Ticketa!")
                .setOptions([
                    {
                        label: "Znalezłem błąd na serwerze",
                        description: "Pamiętaj, że za każde zgłoszenie błędu czeka Cię nagro...",
                        value: "ticketFirstOption"
                    },
                    {
                        label: "Mam propozcyję",
                        description: "Podziel się swoją propozycją z naszym teamem!",
                        value: "ticketSecondOption"
                    }
            ])
        );

        await interaction.guild.channels.cache.get(ticketMessageChannelId).send({
            components: [ticketMenuSelector],
            embeds: [ticketMenuEmbed]
        });

        await interaction.reply( { content: 'Pomyślnie wysłano ticket na kanał.', ephemeral: true} );
	}
};