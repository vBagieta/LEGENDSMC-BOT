const { SlashCommandBuilder,
    EmbedBuilder,
    TimestampStyles,
    time,
    codeBlock,
    italic } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Sprawdź ostatnie aktualizacje bota.')
        .addIntegerOption(option =>
            option.setName('commits-count')
                .setDescription('Wybierz liczbę ostatnich commitów. (MAKSYMALNIE 9)'))
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const commitsCount = interaction.options.getInteger('commits-count');
        const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

        try {

            const response = await fetch(`https://api.github.com/repos/vBagieta/LEGENDSMC-BOT/commits`);
            if (!response.ok) throw new Error('Nie udało się pobrać danych z API GitHub.');

            const data = await response.json();
            const introEmbed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle('Lista ostatnich commitów:')
                .setDescription(italic(
                    `Możesz wyświetlić jedynie 9 ostatnich commitów w jednym komunikacie.\n`
                    + `[Odwiedź repozytorium na GitHub'ie](https://github.com/vBagieta/LEGENDSMC-BOT/commits/main/),`
                    + `aby zobaczyć wszystkie commity.`
                ));

            const embeds = [introEmbed];
            const latestCommits = data.slice(0, commitsCount || 5);

            for (let i = 0; i < latestCommits.length; i++) {
                const commit = latestCommits[i];
                const commitDateTimestamp = time(new Date(commit.commit.author.date), TimestampStyles.RelativeTime);
                const commitEmbed = new EmbedBuilder()
                    .addFields(
                        { name: 'Identyfikator', value: `[${commit.sha.slice(0, 7)}](${commit.html_url})` },
                        { name: 'Opis', value: codeBlock(commit.commit.message) },
                        { name: 'Data', value: commitDateTimestamp },
                    )
                    .setAuthor({
                        name: commit.author.login,
                        iconURL: commit.author.avatar_url,
                        url: commit.author.html_url
                    })
                    .setColor('DarkBlue')
                    .setTimestamp()
                    .setFooter({
                        text: `${interaction.user.username} (${i + 1}/${latestCommits.length})`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

                embeds.push(commitEmbed);
            }

            await interaction.reply({
                embeds: embeds,
                ephemeral: ephemeral
            });

        } catch (error) {

            const errorEmbed = new EmbedBuilder()
                .setDescription(
                    'Wystąpił błąd podczas pobierania danych z API GitHub.\n'
                    + 'Możliwe, że liczba commitów jest większa niż 9.'
                )
                .setColor('Red')
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
    },
};