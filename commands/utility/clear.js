const { EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    codeBlock } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Usuń określoną liczbę wiadomości z kanału.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Liczba wiadomości do usunięcia.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount < 0 || amount >= 100) {

            const integerEmbed = new EmbedBuilder()
                .setTitle('Podaj liczbę od 1 do 100.')
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

            return interaction.reply({
                embeds: [integerEmbed],
                ephemeral: true
            });
        }

        try {

            await interaction.channel.bulkDelete(amount);

            const succesEmbed = new EmbedBuilder()
                .setTitle(`Usunięto ${amount} ostatnich wiadomości.`)
                .setColor('DarkBlue')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

            const reply = await interaction.reply({
                embeds: [succesEmbed],
                ephemeral: true
            });

            setTimeout(() => {
                reply.delete();
            }, 20000);

        } catch (error) {

            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('Wystąpił błąd podczas usuwania wiadomości.')
                .setDescription('Błąd:\n' + codeBlock(error))
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

            return interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    },
};