/* Node Operated Virtual Assistant
  Created by ashen
*/

// Required Libraries
const fs = require('fs')

// Config loading
const {
    discord,
    twitch,
    bot_info
} = require('./config.json')
const tokenData = require('./tokens.json');
const { Discord, client } = require('./discord/client')
const { RefreshableAuthProvider, StaticAuthProvider, ClientCredentialsAuthProvider } = require('twitch-auth');
const { ChatClient } = require('twitch-chat-client');
const { PubSubClient } = require('twitch-pubsub-client');
const { ApiClient } = require('twitch');

async function main() {

    /*

        DISCORD

    */

    client.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync('./discord/commands').filter(file => file.endsWith('.js'))

    client.once('ready', () => {
        console.log(`Bot connected. Bot info: ${bot_info.name} v${bot_info.version}`)
    })

    // Loops through all of the files in the directory and loads them.
    for (const file of commandFiles) {
        const command = require(`./discord/commands/${file}`)
        client.commands.set(command.name, command)
    }

    client.on('message', message => {
        //Store potential greetings for the greetings message.
        greetings = ['hi', 'hello', 'greetings', 'sup']

        // If message is from a bot, return.
        if (message.author.bot) return

        if (message.content.startsWith(discord.prefix)) {
            const args = message.content.slice(discord.prefix.length).trim().split(/ +/)
            const commandName = args.shift().toLowerCase()

            if (!client.commands.has(commandName)) return

            const command = client.commands.get(commandName)

            try {
                command.execute(message, args)
            } catch (error) {
                console.error(error)
                const embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription('There was an issue executing that command.')
                    .setFooter('User Error')
                //message.channel.send('That appears to not be a valid user.')
                return message.channel.send(embed);
            }
        }

        if (greetings.includes(message.content.toLowerCase())) {
            //Looks up the relevant server emoji, and stores it.
            const wispWave = message.guild.emojis.cache.find(emoji => emoji.name == "wispWave_Bot")
            message.channel.send(`${wispWave}`)
        }
    })

    /*

        TWITCH

    */
    const auth = new RefreshableAuthProvider(
        new StaticAuthProvider(twitch.bot_clientid, tokenData.accessToken),
        {
            clientSecret: twitch.bot_secret,
            refreshToken: tokenData.refreshToken,
            expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
            onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
                const newTokenData = {
                    accessToken,
                    refreshToken,
                    expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
                };
                fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), () => { })
            }
        }
    );

    const apiClient = new ApiClient({ authProvider: auth });
    const chatClient = new ChatClient(auth, { channels: [twitch.bot_channel] });
    const pubsubClient = new PubSubClient();
    const userID = await pubsubClient.registerUserListener(auth).then(console.log('PubSub client connected.')).catch(console.error);
    await chatClient.connect().then(console.log('Connected to Twitch chat.')).catch(console.error);
    const user = await apiClient.helix.users.getUserByName('e1fb0t');

    const listener = await pubsubClient.onWhisper(userID, (message) => {
        console.log('Received whisper.')
    }).catch(console.error)
}



//Login to Twitch Chat and Discord bot.
client.login(discord.token)
main();