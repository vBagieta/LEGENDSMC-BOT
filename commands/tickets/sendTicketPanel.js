const { ticketMessageChannelId } = require('../../configs/main.json');
const { EmbedBuilder,
    ActionRowBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    PermissionFlagsBits,
    channelMention } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Wyślij panel zgłoszeń na kanał.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const ticketMenuEmbed = new EmbedBuilder()
            .setTitle('Informacja dotycząca zgłoszeń')
            .setDescription(
                'Aby stworzyć zgłoszenie i skontaktować się z Administracją, wybierz powód zgłoszenia. ' +
                'Czas oczekiwania nie jest określony.\n\n' +
                '**Wysyłanie bezsensownych zgłoszeń będzie karane banem permanentym na Discordzie.**'
            )
            .setColor('Yellow')
            .setFooter({ text: 'System zgłoszeń', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        const ticketMenuSelector = new ActionRowBuilder()
            .setComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticketMenuSelector')
                    .setPlaceholder('Wybierz Kategorię zgłoszenia!')
                    .addOptions([
                        {
                            label: 'Znalezłem błąd na serwerze',
                            description: 'Pamiętaj, że za każde zgłoszenie błędu czeka Cię nagro...',
                            value: 'ticketFirstOption'
                        },
                        {
                            label: 'Mam propozycję',
                            description: 'Podziel się swoją propozycją!',
                            value: 'ticketSecondOption'
                        },
                        {
                            label: 'Inne',
                            description: 'Wybierz tą opcje, jeżeli żadna inna nie pasuje.',
                            value: 'ticketThirdOption'    
                        }
                    ])
            );

        const channel = interaction.guild.channels.cache.get(ticketMessageChannelId);
        const messages = await channel.messages.fetch({ limit: 1 });
        
        if (messages.size === 1) {
            await messages.first().delete();
        }

        await channel.send({
            components: [ticketMenuSelector],
            embeds: [ticketMenuEmbed]
        });

        await interaction.reply({
            content: `Pomyślnie wysłano panel na kanał ` + channelMention(channel.id),
            ephemeral: true 
        });
    }
};