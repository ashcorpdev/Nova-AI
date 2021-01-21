const { Discord } = require('./../client')

module.exports = {
    name: 'getid',
    description: 'Get user id command',
    args: true,
    execute(message, args) {
        if(!args.length){
            return message.channel.send(`You did not return any valid arguments, ${message.author}.`)
        }else {
        const taggedUser = message.mentions.users.first();

        try {
            //message.channel.send(`User ID is: \`${taggedUser.id}\``)
            const embed = new Discord.MessageEmbed()
            .setDescription(`User ID for ${taggedUser} is: \`\`\`\n${taggedUser.id}\`\`\``)
            return message.channel.send(embed);
        }catch(error) {
            console.log(error);
            const embed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setDescription('That appears to not be a valid user.')
            return message.channel.send(embed);
        }
        }
    }
}