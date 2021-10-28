## nova-ai

*NovaAI is a Discord bot designed to integrate some Twitch API features for streamers to use in their Discord servers.*

### Features

- Integration with Twitch API to look up usernames and set up stream alerts for when streamers are live.
- Cross-site ban system (users can be banned on Discord and Twitch simultaneously provided both usernames are given).
- Alerts system for streamers to ping a specific role to alert for help in their streams.
- Hot-reloading of Discord commands.

## Example Usage

**Example 1.** A streamer is live and something breaks! The streamer can whisper to the Twitch bot using a specified command/keyword via a Streamdeck or other hotkey, which will send a ping to a specified user. This then alerts them to quickly fix the problem.

![](https://i.imgur.com/QRNx6DC.png)

**Example 2.** The streamer wants their moderators to know that the stream is live. Nova will send an alert to a specified channel when the streamer is live, and also provides links to jump to either the normal stream view or the moderator stream view.

![](https://i.imgur.com/497cKiR.png)

**Example 3.** The streamer is unsure as to whether to ban a specified user. Using the `execute` command, the streamer can provide a Discord username and a Twitch username, and request the moderators to vote. Once over half of the moderators have voted to execute, the user will be banned.

![](https://i.imgur.com/GPPP0eF.png)

### Purpose

_The purpose of this application is to allow for some basic tools to be used by streamers in their Discord server._
