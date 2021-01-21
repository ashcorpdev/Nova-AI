const { twitch } = require('../config.json')
const fs = require('fs')
const { RefreshableAuthProvider, StaticAuthProvider, ClientCredentialsAuthProvider } = require('twitch-auth');
const { ChatClient } = require('twitch-chat-client');
const { PubSubClient } = require('twitch-pubsub-client');
const { ApiClient } = require('twitch');

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
const chatClient = new ChatClient(auth, { channels: [twitch.bot_channel] });
const pubsubClient = new PubSubClient();

module.exports = {
    apiClient: apiClient,
    auth: auth,
    chatClient: chatClient,
    pubsubClient: pubsubClient
}