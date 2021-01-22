module.exports = {
    name: 'totalmembers',
    description: 'Totalmemberes command',
    async execute(message, args) {
        message.channel.send(`Total members: ${message.guild.memberCount}`)
    }
}