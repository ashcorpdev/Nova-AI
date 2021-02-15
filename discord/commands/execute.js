const { discord, twitch } = require('../../config.json')
const { Discord, client } = require('../client')
const { apiClient, chatClient } = require('../../twitch/client')
module.exports = {
    name: 'execute',
    description: 'execute command',
    async execute(message, args) {
        if (!args.length) {
            return message.channel.send(`You did not provide any valid arguments, ${message.author}.`)
        } else {

            try {
                var hasTwitch = false;
                var twitchUser, discordUser;

                // Filthy regex magic to see if the first argument contains numbers or not.
                if (/^\d+$/.test(args[0])) {
                    console.log('Only numbers found, must be a Discord ID.')

                    try {
                        discordUser = await client.users.fetch(args[0])
                    } catch (error) { }


                    if (discordUser) {
                        console.log(`Discord User found: ${discordUser.username}`)
                    } else {
                        console.log('Invalid ID provided')
                    }

                    if (args[1]) {
                        console.log('Additional ID was provided. Checking for Twitch user by that name...')
                        hasTwitch = true;
                        twitchUser = await apiClient.helix.users.getUserByName(args[1])
                        if (twitchUser) {

                            console.log(`Twitch User found: ${twitchUser.displayName}`)
                        } else {
                            console.log('Invalid user provided');
                        }
                    }
                } else {
                    // No numbers, so probably a twitch username.

                    // Must be a valid Twitch ID instead, check that.
                    hasTwitch = true;
                    twitchUser = await apiClient.helix.users.getUserByName(args[0]);

                    if (twitchUser) {
                        hasTwitch = true;
                        console.log('No Discord User found, but Twitch was found.')
                        console.log(`Twitch user: ${twitchUser.displayName}`)
                    } else {
                        console.log('Not a valid Twitch user.')
                    }


                    if (args[1]) {
                        console.log('Additional ID was provided. Checking for Discord ID...')
                        discordUser = await client.users.fetch(args[1])
                        if (discordUser) {
                            console.log(`Discord User found: ${discordUser.username}`)
                        } else {
                            console.log('Invalid Discord ID found')
                        }
                    }
                }

                if (twitchUser && discordUser) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('User to be executed:')
                        .setThumbnail(twitchUser.profilePictureUrl)
                        .addField('Twitch', twitchUser.displayName, true)
                        .addField('Discord', discordUser.username, true)
                        .addField('Discord ID', discordUser.id, true)
                    message.channel.send(embed).then(embed => {


                        message.delete()

                        // Add the reactions to the embed message.
                        embed.react('❎')
                        embed.react('✅')

                        // Filter the reactions.
                        const filter = (reaction, user) => {
                            return ['❎', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
                        };
                        embed.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                            .then(collected => {
                                const reaction = collected.first();

                                if (reaction.emoji.name === '❎') {

                                    const embed = new Discord.MessageEmbed()
                                        .setDescription(`🙏 ${twitchUser.displayName} has been spared.`)
                                    return message.channel.send(embed);
                                } else {
                                    const embed = new Discord.MessageEmbed()
                                        .setDescription(`💀 ${twitchUser.displayName} has been executed.`)
                                        
                        // Execute the ban on the Twitch user.
                        chatClient.ban(twitch.streamer_channel, twitchUser.displayName)
                        message.guild.members.ban(discordUser)
                                    return message.channel.send(embed);
                                }
                            })
                            .catch(collected => {

                                const embed = new Discord.MessageEmbed()
                                    .setDescription(`🙏 ${twitchUser.username} has been spared.`)
                                return message.channel.send(embed);
                            });
                    });

                } else if (twitchUser && !discordUser) {

                    //Send message to Discord.
                    const embed = new Discord.MessageEmbed()
                        .setTitle('User to be executed:')
                        .setThumbnail(twitchUser.profilePictureUrl)
                        .addField('Twitch', twitchUser.displayName, true)

                    message.channel.send(embed).then(embed => {
                        message.delete()

                        // Add the reactions to the embed message.
                        embed.react('❎')
                        embed.react('✅')

                        // Filter the reactions.
                        const filter = (reaction, user) => {
                            return ['❎', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
                        };
                        embed.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                            .then(collected => {
                                const reaction = collected.first();

                                if (reaction.emoji.name === '❎') {

                                    const embed = new Discord.MessageEmbed()
                                        .setDescription(`🙏 ${twitchUser.displayName} has been spared.`)
                                    return message.channel.send(embed);
                                } else {
                                    const embed = new Discord.MessageEmbed()
                                        .setDescription(`💀 ${twitchUser.displayName} has been executed.`)

                                    // Execute the ban on the Twitch user.
                                    chatClient.ban(twitch.streamer_channel, twitchUser.displayName)
                                    return message.channel.send(embed);
                                }
                            })
                            .catch(collected => {

                                const embed = new Discord.MessageEmbed()
                                    .setDescription(`🙏 ${twitchUser.username} has been spared.`)
                                return message.channel.send(embed);
                            });
                    });
                } else if (discordUser && !twitchUser) {
                    message.delete()
                    
                    const embed = new Discord.MessageEmbed()
                        .setTitle('User to be executed:')
                        .setThumbnail(discordUser.displayAvatarURL())
                        .addField('Discord', discordUser.username, true)
                        .addField('Discord ID', discordUser.id, true)
                    message.channel.send(embed).then(embed => {

                        // Add the reactions to the embed message.
                        embed.react('❎')
                        embed.react('✅')

                        // Filter the reactions.
                        const filter = (reaction, user) => {
                            return ['❎', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
                        };
                        embed.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                            .then(collected => {
                                const reaction = collected.first();

                                if (reaction.emoji.name === '❎') {

                                    const embed = new Discord.MessageEmbed()
                                        .setDescription(`🙏 ${discordUser.username} has been spared.`)
                                    return message.channel.send(embed);
                                } else {
                                    const embed = new Discord.MessageEmbed()
                                        .setDescription(`💀 ${discordUser.username} has been executed.`)

                                    message.guild.members.ban(discordUser)
                                    return message.channel.send(embed);
                                }
                            })
                            .catch(collected => {

                                const embed = new Discord.MessageEmbed()
                                    .setDescription(`🙏 ${discordUser.username} has been spared.`)
                                return message.channel.send(embed);
                            });
                    });
                }


            } catch (error) {
                console.error(error)
            }
        }
    }
}