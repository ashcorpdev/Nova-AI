const { discord, twitch } = require('../../config.json')
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
                const stream = await apiClient.helix.streams.getStreamByUserName(twitch.streamer_channel);
                const currentGame = await (await stream.getGame()).name;
                const alertColour = 0x00ff00

                channel.send('Attention!')
                const embed = new Discord.MessageEmbed()
                .setTitle('Stream Live!')
                .setDescription(`${twitch.streamer_channel} is now live! Playing: ` + currentGame)
                .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitch.streamer_channel}-1280x720.jpg`)
                .addField('Stream Link', `https://twitch.tv/${twitch.streamer_channel}`, true)
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