module.exports = {
    name: 'schedule',
    description: 'Schedule command',
    async execute(message, args) {
        message.channel.send("Dawn's schedule can be found here: https://twitch.tv/dawnwhisper/schedule");
        message.delete();
    }
}