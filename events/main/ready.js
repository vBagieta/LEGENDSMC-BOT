const { Events, PresenceUpdateStatus } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log('Setting-up bot status');
		client.user.setPresence({ activities: [{ name: '/help' }], status: PresenceUpdateStatus.Online });
	},
};