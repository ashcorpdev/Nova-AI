const { discord } = require('../../config.json')
const { Discord, client } = require('../../discord/client')


function alert(type, sender) {

    if (!sender === 'ashen' || !sender === 'dawnwhisper') {
        return;
    }

    var alertTitle, alertDescription, alertImage, alertColour, taggedRole, isRole

    switch (type) {
        case 'creeper':
            console.log('[Debug] Creeper alert received')
            alertTitle = 'Creeper Alert'
            alertDescription = 'Someone is being creepy in chat!'
            taggedRole = discord.roles.moderator_role_id
            isRole = true;
            break;
        case 'help':
            console.log('[Debug] Help alert received')
            alertTitle = 'Help Requested'
            alertDescription = 'Need some moderators in chat!'
            taggedRole = discord.roles.moderator_role_id
            isRole = true;
            break;
        case 'techsupport':
            console.log('[Debug] Tech support alert received')
            alertTitle = 'Tech Support Requested'
            alertDescription = 'Something is going wrong!'
            taggedRole = discord.roles.owner_id
            isRole = false;
            break;
        default:
            break;
    }

    const channel = client.channels.cache.get(discord.channels.test);

    if (isRole) {
        channel.send('<@&' + taggedRole + '>')
    } else {
        channel.send('<@' + taggedRole + '>')
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(alertTitle)
        .setDescription(alertDescription)
        .setThumbnail(alertImage)
        .setColor(alertColour)
    return channel.send(embed);

}


module.exports = {
    alert: alert
}