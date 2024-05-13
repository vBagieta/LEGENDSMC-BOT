const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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

        if (amount <= 0 || amount > 99) {
            return interaction.reply({ content: 'Podaj liczbę od 1 do 99.', ephemeral: true });
        }

        try {
            await interaction.channel.bulkDelete(amount + 1);
            const reply = await interaction.reply({ content: `Usunięto ${amount} wiadomości.`, ephemeral: true });
            setTimeout(() => {
                reply.delete();
            }, 20000);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Wystąpił błąd podczas usuwania wiadomości.', ephemeral: true });
        }
    },
};
