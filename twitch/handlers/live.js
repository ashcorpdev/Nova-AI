const { discord, twitch } = require('../../config.json')
const { Discord, client } = require('./../client')
const { apiClient } = require('../../twitch/client')

async function liveAnnounce() {

    const channel = client.channels.cache.get(discord.channels.test);
    const stream = await apiClient.helix.streams.getStreamByUserName(twitch.streamer_channel);
    const currentGame = await (await stream.getGame()).name;
    const alertColour = 0x00ff00

    channel.send('Attention!')
    const embed = new Discord.MessageEmbed()
    .setTitle('Stream Live!')
    .setDescription(`{twitch.streamer_channel} is now live! Playing: ` + currentGame)
    .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitch.streamer_channel}-1280x720.jpg`)
    .addField('Stream Link', `https://twitch.tv/${twitch.streamer_channel}`, true)
    .setColor(alertColour)
    return channel.send(embed);
}

module.exports = {
    liveAnnounce: liveAnnounce
}