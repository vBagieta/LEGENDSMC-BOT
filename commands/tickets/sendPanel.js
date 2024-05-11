const { ticketMessageChannelId } = require('../../configs/main.json');
const { EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder, 
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send')
		.setDescription('Wyślij panel zgłoszeń na kanał.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {

        const ticketMenuEmbed = new EmbedBuilder()
                .setTitle('Informacja dotycząca zgłoszeń')
                .setDescription('Aby stworzyć zgłoszenie, by móc szybko skontaktować się z Administracją'
                + 'naciśnij przycisk poniżej. Następnie postępuj zgodnie z instrukcją. Czas oczekiwania nie jest określony.'
                + '\n\n**Wysyłanie bezsensownych zgłoszeń bedzię karane banem permanentym na discordzie.**')
                .setColor('Yellow')
                .setFooter({ text: 'System zgłoszeń', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        const ticketMenuSelector = new ActionRowBuilder()
            .setComponents(
            new StringSelectMenuBuilder()
                .setCustomId("ticketMenuSelector")
                .setPlaceholder("Wybierz Kategorię zgłoszenia!")
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

        await interaction.reply( { content: 'Pomyślnie wysłano panel zgłoszenia.', ephemeral: true} );
	}
};