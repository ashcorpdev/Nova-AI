const { twitch } = require('../config.json')
const tokenData = require('../tokens.json')
const fs = require('fs')
const { RefreshableAuthProvider, StaticAuthProvider } = require('twitch-auth');
const { ChatClient } = require('twitch-chat-client');
const { PubSubClient } = require('twitch-pubsub-client');
const { ApiClient, ChattersList } = require('twitch');
const { WebHookListener, SimpleAdapter } = require('twitch-webhooks')

const auth = new RefreshableAuthProvider(
    new StaticAuthProvider(twitch.bot_clientid, tokenData.accessToken),
    {
        clientSecret: twitch.bot_secret,
        refreshToken: tokenData.refreshToken,
        expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
        onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
            const newTokenData = {
                accessToken,
                refreshToken,
                expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
            };
            fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), () =>{})
        }
    }
);

const apiClient = new ApiClient({ authProvider:auth });
const chatList = new ChattersList();
const chatClient = new ChatClient(auth, { channels: [twitch.bot_channel] });
const pubsubClient = new PubSubClient();
const webhookListener = new WebHookListener(apiClient, new SimpleAdapter({
    hostname: 'localhost',
    listenerPort: 9090
}));

module.exports = {
    apiClient: apiClient,
    auth: auth,
    chatClient: chatClient,
    chatList: chatList,
    pubsubClient: pubsubClient,
    webhookListener: webhookListener
}