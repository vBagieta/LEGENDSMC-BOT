const { rulesChannelId } = require('../../configs/main.json');
const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder,
    EmbedBuilder,
    time,
    channelMention,
    TimestampStyles,
    PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Wyślij regulamin na kanał.')
        .addBooleanOption(option =>
            option.setName('update')
                .setDescription('Oznaczyć regulamin jako zaktualizowany?'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const updated = interaction.options.getBoolean('update') ?? false;
        const timestampPath = path.resolve(__dirname, '../../configs/dates.json');
        const rulesPath = path.resolve(__dirname, '../../configs/rules.txt');
        let updatedDate;
        let rules;

        if (updated) {
            const rulesTimestamp = new Date().toISOString();
            fs.writeFileSync(timestampPath, JSON.stringify({ rulesTimestamp }), 'utf8');
        }

        if (fs.existsSync(timestampPath)) {
            const rawData = fs.readFileSync(timestampPath, 'utf8');
            const timestamp = JSON.parse(rawData);
            date = timestamp.rulesTimestamp;
        }

        if (fs.existsSync(rulesPath)) {
            rules = fs.readFileSync(rulesPath, 'utf8');
        } else {
            rules = 'Nie odnaleziono zawartości regulaminu!';
        }
        
        const rulesEmbed = new EmbedBuilder()
            .setDescription(rules)
            .setColor('Red');

        const warningEmbed = new EmbedBuilder()
        .setDescription(
            '\n\n**Regulamin z dnia:** ' + time(new Date(date), TimestampStyles.LongDateTime)
        )
        .setFooter({ text: 'Zakazane jest powielanie niniejszych zasad bez zgody odpowiednich osób zarządzających serwisem. Ten regulamin jest własnością serwisu LEGENDSMC.PL' })
        .setColor('Red')

        const channel = interaction.guild.channels.cache.get(rulesChannelId);
        if (!channel) {
            await interaction.reply({
                content: 'Nie znaleziono kanału.',
                ephemeral: true
            });
            return;
        }

        const messages = await channel.messages.fetch({ limit: 3 });
        if (messages.size > 0) {
            for (const message of messages.values()) {
                await message.delete();
            }
        }

        await channel.send({ content: '## REGULAMIN SERWISU LEGENDSMC.PL', embeds: [rulesEmbed, warningEmbed] });
        await interaction.reply({
            content: 'Pomyślnie wysłano regulamin na kanał ' + channelMention(channel.id),
            ephemeral: true
        });
    },
};
