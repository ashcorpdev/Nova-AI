const Discord = require('discord.js')
const client = new Discord.Client()
const { discord } = require('../config.json')
const webhookClient = new Discord.WebhookClient(discord.webhooks.playground.webhook_id, discord.webhooks.playground.webhook_token)

module.exports = {
    Discord: Discord,
    client: client,
    webhookClient: webhookClient
}