const path = require('node:path');
const fs = require('node:fs');

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '../events');
    loadEvents(eventsPath, client);
};

function loadEvents(directory, client) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            loadEvents(filePath, client);
        } else if (file.endsWith('.js')) {
            const event = require(filePath);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}
