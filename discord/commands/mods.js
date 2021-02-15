const { twitch } = require('../../config.json')
const { chatClient, chatList } = require('../../twitch/client')

async function execute(message, args){

    //console.log('Mod command called')
    const modslist = await chatClient.getMods(twitch.streamer_channel).then((mods) => {
        const exclude = ['logviewer', 'streamelements', 'novaai', 'e1fb0t', 'streamcaptainbot']

        // This checks if any of the names are in the 'exclude' list and removes them from the final array.
        const modslist_final = mods.filter(a => !exclude.includes(a)).join(', ')
        message.channel.send('Channel mods: ' + modslist_final)
    })
}

module.exports = {
    name: 'mods',
    description: 'Mods command',
    execute: execute
}