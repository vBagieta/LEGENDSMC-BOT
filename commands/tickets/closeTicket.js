const { ticketLogsChannelId } = require('../../configs/main.json');
const { SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    TimestampStyles,
    time,
    userMention, 
    codeBlock} = require('discord.js');

function isBot(message) {
        return message.author.bot;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Zamknij zgłoszenie.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Wybierz użytkownika.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Podaj powód zamknięcia')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const channel = interaction.guild.channels.cache.find(channel => new RegExp(user.id).test(channel.name));

        if (!channel || user.bot || user.id === interaction.user.id) {

            const noTicketEmbed = new EmbedBuilder()
                .setTitle('Nie znaleziono zgłoszenia')
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: 'System zgłoszeń',
                    iconURL: interaction.guild.iconURL({ dynamic: true })
                });

            return interaction.reply({
                embeds: [noTicketEmbed],
                ephemeral: true
            })
        }
        
        const [owner, id] = channel.name.split('-');

        try {
            const messages = await channel.messages.fetch({ limit: 10 });
            const botMessages = messages.filter(isBot);

            for (const message of botMessages.values()) {
                try {
                    if (channel.messages.cache.has(message.id)) {
                        await message.delete();
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            let lastMessages = "**Brak ostatnich wiadomości**";
            const userMessages = messages.filter(message => !isBot(message));

            if (userMessages.size > 0) {
                lastMessages = userMessages.map(msg => `${msg.author.tag}: ${msg.content}`).join('\n');
            }

            await channel.delete();

            const deletedTicketEmbed = new EmbedBuilder()
                .setTitle('Zgłoszenie')
                .setDescription(
                    `Ostatnie **10** wiadomości ze zgłoszenia:\n${lastMessages}`
                )
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .addFields(
                    { name: 'Autor', value: userMention(id) },
                    { name: 'Zamknięto', value: time(new Date(), TimestampStyles.RelativeTime) },
                    { name: 'Przez', value: userMention(interaction.user.id) },
                    { name: 'Powód', value: codeBlock(reason) },
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: 'System zgłoszeń',
                    iconURL: interaction.guild.iconURL({ dynamic: true })
                });

            interaction.guild.channels.cache.get(ticketLogsChannelId).send({ embeds: [deletedTicketEmbed] });

        } catch (error) {
            console.error(error);
        }
    }
};