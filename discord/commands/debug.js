const { discord, twitch } = require('../../config.json')
const { Discord, client } = require('./../client')
const { apiClient, chatClient } = require('../../twitch/client')
let liveMessage;
module.exports = {
    name: 'debug',
    description: 'Debug command',
    async execute(message, args) {
        if (!args.length) {
            return message.channel.send(`You did not provide any valid arguments, ${message.author}.`)
        } else {
            if (args[0] == 'live') {

                const channel = client.channels.cache.get(discord.channels.test);
                const wispWave = message.guild.emojis.cache.find(emoji => emoji.name == "wispWave_Bot")
                const modEmbed = new Discord.MessageEmbed()
                    .setDescription('Dawn is now live! Please react to this message if you are actively modding! If you step down, please remove your reaction.\n\n[**[Regular View]**](https://www.twitch.tv/dawnwhisper) [**[Mod View]**](https://www.twitch.tv/moderator/dawnwhisper)')
                return channel.send(modEmbed).then(mod_embed => {
                    mod_embed.react(wispWave);
                    liveMessage = mod_embed;
                });
            }else if(args[0] == 'notlive'){
                return liveMessage.delete();
            }

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