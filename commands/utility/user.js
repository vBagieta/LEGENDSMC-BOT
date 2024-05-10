const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Sprawdź profil dowolnego gracza.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Wybierz użytkownika.')
                .setRequired(true))
        .addBooleanOption(option => option.setName('not-ephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
	async execute(interaction) {

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);

        const userCreatedTimestamp = time(new Date(user.createdAt), TimestampStyles.RelativeTime);
        const userJoinedTimestamp = time(new Date(member.joinedAt), TimestampStyles.RelativeTime);

        const ephemeral = interaction.options.getBoolean('not-ephemeral');
        const ephemeralBoolean = ephemeral === null ? true : !ephemeral;

        if (user && user.bot) { 
            const errorEmbed = new EmbedBuilder()
                .setDescription('Wybierz gracza, nie bota.')
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })

            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        } else { 

            const userEmbed = new EmbedBuilder()
                .setTitle(user.globalName + ' (' + user.username + ')')
                .setColor('DarkBlue')
                .setDescription('Informacje o tym użytkowniku:')
                .addFields(
                    { name: 'Założył konto', value: userCreatedTimestamp, inline: true},
                    { name: 'Dołączył do serwera', value: userJoinedTimestamp, inline: true},
                    { name: 'Identyfikator', value: user.id, inline: true}
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()

            await interaction.reply( {embeds: [userEmbed], ephemeral: ephemeralBoolean } )

        }
    },
};