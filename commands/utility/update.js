const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles, codeBlock, italic } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Sprawdź ostatnie aktualizacje bota.')
        .addIntegerOption(option => option.setName('commits-count').setDescription('Wybierz liczbę ostatnich commitów. (MAKSYMALNIE 9)'))
        .addBooleanOption(option => option.setName('not-ephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
    async execute(interaction) {
        const commitsCount = interaction.options.getInteger('commits-count');
        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        try {
            const response = await fetch(`https://api.github.com/repos/vBagieta/LEGENDSMC-BOT/commits`);
            if (!response.ok) throw new Error('Nie udało się pobrać danych z API GitHub.');

            const data = await response.json();

            const introEmbed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle('Lista ostatnich commitów:')
                .setDescription(italic(`Możesz wyświetlić jedynie 9 ostatnich commitów w jednym komunikacie.\n[Odwiedź stronę GitHub](https://github.com/vBagieta/LEGENDSMC-BOT/commits/main/), aby zobaczyć wszystkie commity.`));

            const embeds = [introEmbed];

            const latestCommits = data.slice(0, commitsCount || 5);

            for (let i = 0; i < latestCommits.length; i++) {
                const commit = latestCommits[i];
                const commitDateTimestamp = time(new Date(commit.commit.author.date), TimestampStyles.RelativeTime);
                const commitEmbed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setFooter({ text: `${interaction.user.username} (${i + 1}/${latestCommits.length})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .addFields(
                        { name: 'ID', value: `[${commit.sha.slice(0, 7)}](${commit.html_url})` },
                        { name: 'CHANGELOG', value: codeBlock(commit.commit.message) },
                        { name: 'DATE', value: commitDateTimestamp },
                    )
                    .setAuthor({ name: commit.author.login, iconURL: commit.author.avatar_url, url: commit.author.html_url })
                    .setTimestamp();

                embeds.push(commitEmbed);
            }

            await interaction.reply({ embeds: embeds, ephemeral: ephemeralBoolean });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('Wystąpił błąd podczas pobierania danych z API GitHub.\nMożliwe, że liczba commitów jest większa niż 9.')
                .setColor('Red')
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};