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

        const response = await fetch(
            `https://api.github.com/repos/vBagieta/LEGENDSMC-BOT/commits`
        );
        const data = await response.json();

        if (!response.ok || Object.keys(data).length === 0) {
            const errorEmbed = new EmbedBuilder()
                .setDescription(`Wystąpił błąd przy pobieraniu wartości z API.`)
                .setColor('Red')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
      
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        };

        const embeds = [];

        let latestCommits = [];
        if (commitsCount !== null && data.slice(0, commitsCount).length > 9) {
            latestCommits = data.slice(0, 9);
            const introEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Lista ostatnich 9 commitów:')
                .setDescription(
                    italic(`Możesz wyświetlić jedynie 9 ostatnich commitów w jeden interakcji.`) + '\n' +
                    italic(`[Odwiedź tą stronę](https://github.com/vBagieta/LEGENDSMC-BOT/commits/main/), aby sprawdzić wszytskie commity.`)
                )

            embeds.push(introEmbed);
        } else {
            latestCommits = data.slice(0, commitsCount || 5);
            const introEmbed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setDescription(`Lista ostatnich ${commitsCount || 5} commitów:`)

            embeds.push(introEmbed);
        };

        const formatCommit = function(commit, index, total) {
            const commitDateTimestamp = time(new Date(commit.commit.author.date), TimestampStyles.RelativeTime)
            return new EmbedBuilder()
                .setColor('DarkBlue')
                .setFooter({ text: `${interaction.user.username} (${index + 1}/${total})`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .addFields(
                    { name: 'ID', value: `[${commit.sha.slice(0, 7)}](${commit.html_url})` },
                    { name: 'CHANGELOG', value: codeBlock(commit.commit.message) },
                    { name: 'DATE', value: commitDateTimestamp },
                )
                .setAuthor({ name: commit.author.login, iconURL: commit.author.avatar_url, url: commit.author.html_url })
                .setTimestamp();
        };

        for (let i = 0; i < latestCommits.length; i++) {
            const commit = latestCommits[i];
            const commitEmbed = formatCommit(commit, i, latestCommits.length);
            embeds.push(commitEmbed);
        }

        await interaction.reply({ embeds: embeds, ephemeral: ephemeralBoolean });
    },
};