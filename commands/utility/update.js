const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles, codeBlock } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Sprawdź ostatnie aktualizacje bota.')
        .addIntegerOption(option => option.setName('commits-count').setDescription('Wybierz liczbę ostatnich commitów.'))
        .addBooleanOption(option => option.setName('notephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
    async execute(interaction) {

        const commitsCount = interaction.options.getInteger('commits-count');
        const ephemeral = interaction.options.getBoolean('notephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        const response = await fetch(
            `https://api.github.com/repos/vBagieta/LEGENDSMC-BOT/commits`
        );
        const data = await response.json();
        const latestCommits = data.slice(0, commitsCount || 5); // Use the specified count, default to 5 if not provided or invalid

        const formatCommit = function(commit, index, total) {
            const commitDateTimestamp = time(new Date(commit.commit.author.date), TimestampStyles.RelativeTime)
            return new EmbedBuilder()
                .setColor('DarkBlue')
                .setFooter({ text: `${interaction.user.username} (${index + 1}/${total})`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .addFields(
                    { name: 'ID', value: `[${commit.sha.slice(0, 7)}](${commit.html_url})` },
                    { name: 'CHANGELOG', value: codeBlock(commit.commit.message) },
                    { name: 'CZAS', value: commitDateTimestamp },
                )
                .setAuthor({ name: commit.author.login, iconURL: commit.author.avatar_url, url: commit.author.html_url })
                .setTimestamp();
        };

        const embeds = [];

        const introEmbed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setDescription(`Lista ostatnich ${commitsCount || 5} commitów:`);

        embeds.push(introEmbed);

        for (let i = 0; i < latestCommits.length; i++) {
            const commit = latestCommits[i];
            const commitEmbed = formatCommit(commit, i, latestCommits.length);
            embeds.push(commitEmbed);
        }

        await interaction.reply({ embeds: embeds, ephemeral: ephemeralBoolean });
    },
};
