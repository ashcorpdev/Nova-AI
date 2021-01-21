const Discord = require('discord.js')
const client = new Discord.Client()
const {discord} = require('../config.json')
const webhookClient = new Discord.WebhookClient(discord.webhook_id, discord.webhook_token)

module.exports = {
    Discord: Discord,
    client: client,
    webhookClient: webhookClient
}