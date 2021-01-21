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
const { Discord, client } = require('./discord/client')

// Discord Client information
client.commands = new Discord.Collection();
// Reads commands from the commands directory.
const commandFiles = fs.readdirSync('./discord/commands').filter(file => file.endsWith('.js'))

client.once('ready', () => {
    console.log(`Bot connected. Bot info: ${bot_info.name} v${bot_info.version}`)
})

client.login(discord.token)

// Loops through all of the files in the directory and loads them.
for(const file of commandFiles) {
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
        }catch(error) {
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