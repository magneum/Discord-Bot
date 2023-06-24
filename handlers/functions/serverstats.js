const Schema = require("../../database/models/stats");
const discord = require("discord.js");

module.exports = async (client) => {
  client.getTemplate = async (guild) => {
    try {
      const data = await Schema.findOne({ Guild: guild.id });

      if (data && data.ChannelTemplate) {
        return data.ChannelTemplate;
      } else {
        return `{emoji} {name}`;
      }
    } catch {
      return `{emoji} {name}`;
    }
  };

  client.on(discord.Events.GuildMemberAdd, async (member) => {
    client.emit("updateMembers", member.guild);
    client.emit("updateBots", member.guild);
  });
  client.on(discord.Events.GuildMemberRemove, async (member) => {
    client.emit("updateMembers", member.guild);
    client.emit("updateBots", member.guild);
  });

  client.on(discord.Events.ChannelCreate, async (channel) => {
    client.emit("updateChannels", channel, channel.guild);
    client.emit("updateNewsChannels", channel, channel.guild);
    client.emit("updateStageChannels", channel, channel.guild);
    client.emit("updateTextChannels", channel, channel.guild);
    client.emit("updateVoiceChannels", channel, channel.guild);
  });
  client.on(discord.Events.ChannelDelete, async (channel) => {
    client.emit("updateChannels", channel, channel.guild);
    client.emit("updateNewsChannels", channel, channel.guild);
    client.emit("updateStageChannels", channel, channel.guild);
    client.emit("updateTextChannels", channel, channel.guild);
    client.emit("updateVoiceChannels", channel, channel.guild);
  });

  client.on(discord.Events.RoleCreate, async (role) =>
    client.emit("updateRoles", role.guild)
  );
  client.on(discord.Events.RoleDelete, async (role) =>
    client.emit("updateRoles", role.guild)
  );

  client.on(discord.Events.GuildMemberBoost, (booster) =>
    client.emit("updateBoosts", booster.guild)
  );
  client.on(discord.Events.GuildMemberUnboost, (booster) =>
    client.emit("updateBoosts", booster.guild)
  );

  client.on(discord.Events.GuildBoostLevelUp, (tier) =>
    client.emit("updateTier", tier.guild)
  );
  client.on(discord.Events.GuildBoostLevelDown, (tier) =>
    client.emit("updateTier", tier.guild)
  );

  client.on(discord.Events.EmojiCreate, (emoji) => {
    client.emit("updateEmojis", emoji, emoji.guild);
    client.emit("updateAEmojis", emoji, emoji.guild);
    client.emit("updateSEmojis", emoji, emoji.guild);
  });
  client.on(discord.Events.EmojiDelete, (emoji) => {
    client.emit("updateEmojis", emoji, emoji.guild);
    client.emit("updateAEmojis", emoji, emoji.guild);
    client.emit("updateSEmojis", emoji, emoji.guild);
  });

  client.on(discord.Events.ClientReady, async (client) =>
    client.emit("updateClock")
  );
};
