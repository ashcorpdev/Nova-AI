const fs = require('fs');

module.exports = {
    name: 'reloadall',
    description: 'Reloads all commands',
    async execute(message, args) {

        const commandFiles = fs.readdirSync('./discord/commands')
        if (!commandFiles) return message.channel.send(`There are no commands to reload, ${message.author}!`);
        // ...

        try {
        let cmdCount = 0;
        for (const file of commandFiles) {
            delete require.cache[require.resolve(`./${file}`)];
            const command = require(`./${file}`)
            message.client.commands.set(command.name, command)
            cmdCount++;
        }
            message.channel.send(`${cmdCount} commands reloaded!`);
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading all commands:\n\`${error.message}\``);
        }

    },
};