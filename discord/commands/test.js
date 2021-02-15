module.exports = {
    name: 'test',
    description: 'Test command',
    async execute(message, args) {
        message.channel.send('This was added after the bot started!');
    }
}