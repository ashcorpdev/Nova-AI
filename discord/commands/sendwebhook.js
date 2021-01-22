const { Discord, client, webhookClient } = require('./../client')
module.exports = {
    name: 'sendwebhook',
    description: 'Send Webhook command',
    async execute(message, args) {
        if (!args.length) {
            return message.channel.send(`You did not provide any valid arguments, ${message.author}.`)
        } else {

            try {
                const message = args.join(' ');
                const embed = new Discord.MessageEmbed()
                    .setDescription(message)
                    .setColor('#0099ff');

                webhookClient.send('', {
                    embeds: [embed],
                });
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