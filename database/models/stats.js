const mango = require("mongoose");
const path = require("path");

module.exports = mango.model(
  path.basename(__filename, path.extname(__filename)),
  new mango.Schema({
    Guild: String,
    Members: String,
    Boost: String,
    Channels: String,
    Roles: String,
    Emojis: String,
    AnimatedEmojis: String,
    NewsChannels: String,
    StageChannels: String,
    StaticEmojis: String,
    TextChannels: String,
    BoostTier: String,
    VoiceChannels: String,
    Time: String,
    TimeZone: String,
    ChannelTemplate: String,
  })
);
