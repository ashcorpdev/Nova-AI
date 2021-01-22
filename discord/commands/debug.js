const { discord } = require('../../config.json')
const { Discord, client } = require('./../client')
const { apiClient, chatClient } = require('../../twitch/client')
module.exports = {
    name: 'debug',
    description: 'Debug command',
    async execute(message, args) {
        if (!args.length) {
            return message.channel.send(`You did not provide any valid arguments, ${message.author}.`)
        } else {

            try {
                const channel = client.channels.cache.get(discord.channels.test);
                const stream = await apiClient.helix.streams.getStreamByUserName('dawnwhisper');
                const currentGame = await (await stream.getGame()).name;
                const alertColour = 0x00ff00

                channel.send('Attention Wisps!')
                const embed = new Discord.MessageEmbed()
                .setTitle('Stream Live!')
                .setDescription('Dawn is now live! Playing: ' + currentGame)
                .setImage('https://static-cdn.jtvnw.net/previews-ttv/live_user_dawnwhisper-1280x720.jpg')
                .addField('Stream Link', 'https://twitch.tv/dawnwhisper', true)
                //.addField('Current Game', currentGame, true)
                .setColor(alertColour)
                return channel.send(embed);
            } catch (error) {
                console.log(error);
                const embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription('That appears to not be a valid webhook.')
                return message.channel.send(embed);
            }
        }
    }
}