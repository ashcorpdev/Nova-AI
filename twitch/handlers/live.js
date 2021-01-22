const { discord } = require('../../config.json')
const { Discord, client } = require('./../client')
const { apiClient, chatClient } = require('../../twitch/client')

async function liveAnnounce() {

    const channel = client.channels.cache.get(discord.channels.test);
    const currentGame = (await apiClient.helix.streams.getStreamByUserName('dawnwhisper')).getGame();
    const embed = new Discord.MessageEmbed()
    const alertColour = '#00ff00'
    .setTitle('Stream Live!')
    .setDescription('Dawn is now live! Playing: ' + currentGame)
    .setThumbnail('https://static-cdn.jtvnw.net/previews-ttv/live_user_dawnwhisper-1280x720.jpg')
    .setColor(alertColour)
    return channel.send(embed);
}

module.exports = {
    liveAnnounce: liveAnnounce
}