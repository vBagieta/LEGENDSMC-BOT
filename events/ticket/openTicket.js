const { Events, ChannelType, PermissionsBitField } = require('discord.js');
const { ticketCategoryId, adminRoleId } = require('../../configs/main.json')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (interaction.customId === 'ticketMenuSelector') {
            if (interaction.guild.channels.cache.find(channel => channel.name === `ticket-${interaction.user.globalName}`)) {
                interaction.reply({ content: 'Możesz utworzyć tylko 1 ticket.', ephemeral: true})
                return;
            } else {

                const createdTicket = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.globalName}`,
                    type: ChannelType.GuildText,
                    parent: ticketCategoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                        {
                            id: adminRoleId,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                    ],
                });
                
                if (createdTicket) {
                    interaction.reply({ content: 'Stworzono ticket!', ephemeral: true })
                } else {
                    interaction.reply({ content: 'Nie udalo stworzyc sie ticketa!', ephemeral: true })
                }
            }
        }
    }
};