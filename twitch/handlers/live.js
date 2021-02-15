const { discord, twitch } = require('../../config.json')
const { Discord, client } = require('./../client')
const { apiClient } = require('../../twitch/client')
let liveMessage;

async function liveAnnounce() {

    const channel = client.channels.cache.get(discord.channels.test);
    const stream = await apiClient.helix.streams.getStreamByUserName(twitch.streamer_channel);
    const currentGame = await (await stream.getGame()).name;
    const alertColour = 0x00ff00
    const wispWave = message.guild.emojis.cache.find(emoji => emoji.name == "wispWave_Bot")
    const modEmbed = new Discord.MessageEmbed()
        .setDescription('Dawn is now live! Please react to this message if you are actively modding! If you step down, please remove your reaction.\n\n[**[Regular View]**](https://www.twitch.tv/dawnwhisper) [**[Mod View]**](https://www.twitch.tv/moderator/dawnwhisper)')
    channel.send(modEmbed).then(mod_embed => {
        mod_embed.react(wispWave);
        liveMessage = mod_embed;
    });

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
    liveAnnounce: liveAnnounce,
    liveMessage: liveMessage
}