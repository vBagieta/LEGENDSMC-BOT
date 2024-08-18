const { SlashCommandBuilder,
    EmbedBuilder,
    channelMention,
    userMention, 
    codeBlock,
    time,
    TimestampStyles } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Wyświetl usuniętą wiadomość na kanale.')
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
        const channel = interaction.channel.id;

        const filePath = path.resolve(__dirname, '../../configs/deletedMessages.json');

        if (fs.existsSync(filePath)) {
            const rawData = fs.readFileSync(filePath);
            const deletedMessages = JSON.parse(rawData);
        
            if (deletedMessages[channel]) {
                const author = interaction.guild.members.cache.get(deletedMessages[channel].authorId);
                const messageEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Ostatnia usunięta wiadomość.')
                    .setDescription(codeBlock(deletedMessages[channel].content))
                    .addFields(
                        { name: 'Kanał:', value: channelMention(channel), inline: true },
                        { name: 'Autor:', value: userMention(deletedMessages[channel].authorId), inline: true },
                        { name: 'Usunięto:', value: time(new Date(deletedMessages[channel].timestamp), TimestampStyles.RelativeTime), inline: true }
                    )
                    .setAuthor({ name: deletedMessages[channel].author, iconURL: author.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setFooter({
                        text: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

                await interaction.reply({
                    embeds: [messageEmbed],
                    ephemeral: ephemeral
                });
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Nie zapisano na tym kanale ostatniej wiadomośći!')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

                await interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            }
        }
    },
};