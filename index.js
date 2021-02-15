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
const fetch = require('node-fetch')
const { Discord, client } = require('./discord/client')
const { apiClient, auth, chatClient, pubsubClient, webhookListener } = require('./twitch/client')
  
// Load Twitch handlers
const alertHandler = require('./twitch/handlers/alert')
const liveHandler = require('./twitch/handlers/live');
const { randomInt } = require('crypto');

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

        if (message.content.startsWith(discord.prefix) && message.member.roles.cache.has(discord.roles.moderator_role_id)) {
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

        

        if(message.member.roles.cache.has(discord.roles.moderator_role_id)){

            switch (message.content) {
                case 'OI GOBLIN':
                    message.channel.send('WOT U WANT?');
                    break;
                
                case 'good goblin':
                    var shinies;
                    shinies = Math.floor(Math.random() * Math.floor(5));
                    if(shinies === 1){
                        message.channel.send('CHARGE ' + shinies + ' SHINY')
                    }else if(shinies < 1) {
                        shinies = 1;
                        message.channel.send('CHARGE ' + shinies + ' SHINY')
                    } else {
                        message.channel.send('CHARGE ' + shinies + ' SHINIES')
                    }
                    break;
                case 'average goblin':
                    message.channel.send('NO U')
                    break;
                case 'bad goblin':
                    var array = ['U WOT M8', "U HAVIN' A GIGGLE?!", 'FITE ME']
                    var opt = Math.floor(Math.random() * Math.floor(array.length));
                        message.channel.send(array[opt])
                    break;    
                
                    case 'pet goblin':
                        var embed = new Discord.MessageEmbed()
                        .setImage('https://cdn.discordapp.com/attachments/304280850629918722/807288940184469594/0ca5f7863628b51c2063ed590062bf25e088165e.png')
                        message.channel.send(embed)
                        break;
                default:
                    break;
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

    const userID = await pubsubClient.registerUserListener(auth).then(console.log('PubSub client connected.')).catch(console.error);
    await chatClient.connect().then(console.log('Connected to Twitch chat.')).catch(console.error);
    await webhookListener.listen();

    const listener = await pubsubClient.onWhisper(userID, (message) => {
        console.log('[Debug] Received whisper.')
        alertHandler.alert(message.text, message.senderName)
    }).catch(console.error)

    let prevStream = await apiClient.helix.streams.getStreamByUserName(twitch.streamer_channel);
    const user = await apiClient.helix.users.getUserByName(twitch.streamer_channel);

    const streamLive = await webhookListener.subscribeToStreamChanges(user, async stream => {
    if (stream) {
        if (!prevStream) {
            console.log(`${stream.userDisplayName} just went live with title: ${stream.title}`);
            liveHandler.liveAnnounce();
        }
    } else {
        // no stream, no display name
        const user = await apiClient.helix.users.getUserByName(twitch.streamer_channel);
        console.log(`${user.displayName} just went offline`);
    }
    prevStream = stream ?? null;
});


}



//Login to Twitch Chat and Discord bot.
client.login(discord.token)
main();
