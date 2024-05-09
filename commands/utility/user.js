const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Sprawdź profil dowolnego gracza.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Wybierz użytkownika.')
                .setRequired(true))
        .addBooleanOption(option => option.setName('notephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
	async execute(interaction) {
        
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);

        const userCreated = new Date(user.createdAt);
        const userCreatedTimestamp = time(userCreated, TimestampStyles.RelativeTime);

        const userJoined = new Date(member.joinedAt);
        const userJoinedTimestamp = time(userJoined, TimestampStyles.RelativeTime);

        const ephemeral = interaction.options.getBoolean('notephemeral');
        
        if (ephemeral == null) {
            var ephemeralBoolean = true;
        } else {
            var ephemeralBoolean = !ephemeral
        }

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