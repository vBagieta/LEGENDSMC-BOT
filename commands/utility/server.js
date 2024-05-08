const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Sprawdź informacje o serwerze.')
        .addBooleanOption(option => option.setName('ephemeral').setDescription('Czy wiadomość ma być widoczna dla wszystkich?')),
	async execute(interaction) {

        const guildDateCreated = new Date(interaction.guild.createdAt);
        const guildDateCreatedTimestamp = time(guildDateCreated, TimestampStyles.RelativeTime);

        const ephemeral = interaction.options.getBoolean('ephemeral');
        
        if (ephemeral == null) {
            var ephemeralBoolean = true;
        } else {
            var ephemeralBoolean = ephemeral
        }

        const serverEmbed = new EmbedBuilder()
            .setTitle(interaction.guild.name)
            .setColor('DarkBlue')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription('Informacje o tym serwerze:')
            .addFields(
                { name: "Liczba użytkowników", value: `${interaction.guild.memberCount}`, inline: true},
                { name: "Data powstania", value: guildDateCreatedTimestamp, inline: true},
                { name: "Właściciel", value: `<@${interaction.guild.ownerId}> :crown:`, inline: true},
                { name: "Identyfikator", value: interaction.guild.id, inline: true}
            )
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })

            await interaction.reply( {embeds: [serverEmbed], ephemeral: ephemeralBoolean } )
	},
};