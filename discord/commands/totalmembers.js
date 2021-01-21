module.exports = {
    name: 'totalmembers',
    description: 'Totalmemberes command',
    execute(message, args) {
        message.channel.send(`Total members: ${message.guild.memberCount}`)
    }
}