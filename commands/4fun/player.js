const { EmbedBuilder, SlashCommandBuilder, inlineCode } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Pobiera informacje o graczu Minecraft.')
        .addStringOption(option =>
            option.setName('nick')
                .setDescription('Podaj nick gracza Minecraft.')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),

    async execute(interaction) {
        const nick = interaction.options.getString('nick');
        const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

        try {
            const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${nick}`);
            if (!uuidResponse.ok) {
                await interaction.reply({
                    content: 'Nie znaleziono gracza o podanej nazwie.',
                    ephemeral: ephemeral
                });
                return;
            }
            const { id, name } = await uuidResponse.json();

            const headResponse = await fetch(`https://mc-heads.net/avatar/${id}`);
            const bodyResponse = await fetch(`https://mc-heads.net/player/${id}`);
            const skinResponse = await fetch(`https://mc-heads.net/download/${id}`);
            
            if (!headResponse.ok || !bodyResponse.ok || !skinResponse.ok ) {
                await interaction.reply({
                    content: 'Nie udało pobrać się zawartości z API.',
                    ephemeral: ephemeral
                });
                return;
            }

            const headUrl = headResponse.url;
            const bodyUrl = bodyResponse.url;
            const skinUrl = skinResponse.url;

            const playerEmbed = new EmbedBuilder()
                .setTitle(`Gracz ${name}:`)
                .addFields(
                    { name: 'Skin', value: `[Kliknij, aby pobrać](${skinUrl})`, inline: false },
                    { name: 'UUID', value: inlineCode(id), inline: false }
                )
                .setThumbnail(headUrl)
                .setImage(bodyUrl)
                .setTimestamp()
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({
                embeds: [playerEmbed],
                ephemeral: ephemeral
            });

        } catch (error) {
            console.error('Wystąpił błąd:', error);
            await interaction.reply({
                content: 'Wystąpił błąd.' + error,
                ephemeral: true
            });
        }
    }
};