const discord = require("discord.js");

const Schema = require("../../database/models/stats");

module.exports = async (client, channel, guild) => {
  if (channel.type == discord.ChannelType.GuildAnnouncement) {
    try {
      var channelName = await client.getTemplate(guild);
      channelName = channelName.replace(`{emoji}`, "📢");
      channelName = channelName.replace(
        `{name}`,
        `News Channels: ${
          guild.channels.cache.filter(
            (channel) => channel.type === discord.ChannelType.GuildAnnouncement
          ).size || 0
        }`
      );

      const data = await Schema.findOne({ Guild: guild.id });
      const changeChannel = guild.channels.cache.get(data.NewsChannels);
      await changeChannel.setName(channelName);
    } catch {}
  }
};
