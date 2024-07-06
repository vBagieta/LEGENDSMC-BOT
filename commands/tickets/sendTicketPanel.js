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
            .setTitle('LegendsMC: System zgłoszeń')
            .setDescription(
                'Napotkałeś problem? Chcesz zgłosić błąd? A może masz pytanie?\n' +
                'Wybierz kategorię zgłoszenia poniżej, aby nasza administracja mogła Ci pomóc!\n\n' +
                '**Wysyłanie bezsensownych zgłoszeń jest karane.**'
            )
            .setColor('Yellow')
            .setFooter({
                text: 'System zgłoszeń',
                iconURL: interaction.guild.iconURL({ dynamic: true })
            });

        const ticketMenuSelector = new ActionRowBuilder()
            .setComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticketMenuSelector')
                    .setPlaceholder('Wybierz Kategorię zgłoszenia!')
                    .addOptions([
                        {
                            label: 'Znalazłem błąd',
                            description: 'Napotkałeś na problem podczas korzystania z naszych serwisów.',
                            value: 'ticketIssueOption',
                        },
                        {
                            label: 'Chce podzielić się propozcyją!',
                            description: 'Chcesz podzielić się propozycją z naszym zespołem',
                            value: 'ticketPropositionOption'
                        },
                        {
                            label: 'Mam pytanie!',
                            description: 'Masz pytanie dotyczące naszych serwisów.',
                            value: 'ticketQuestionOption'    
                        },
                        {
                            label: 'Inny problem',
                            description: 'Żadna z powyższych kategorii nie pasuje.',
                            value: 'ticketOtherOption'    
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