const discord = require("discord.js");

module.exports = (client, player, track) => {
  let row = new discord.ActionRowBuilder().addComponents(
    new discord.ButtonBuilder()
      .setEmoji(client.emotes.music.previous)
      .setCustomId("Bot-musicprev")
      .setStyle(discord.ButtonStyle.Secondary),

    new discord.ButtonBuilder()
      .setEmoji(client.emotes.music.pause)
      .setCustomId("Bot-musicpause")
      .setStyle(discord.ButtonStyle.Secondary),

    new discord.ButtonBuilder()
      .setEmoji(client.emotes.music.stop)
      .setCustomId("Bot-musicstop")
      .setStyle(discord.ButtonStyle.Secondary),

    new discord.ButtonBuilder()
      .setEmoji(client.emotes.music.next)
      .setCustomId("Bot-musicnext")
      .setStyle(discord.ButtonStyle.Secondary)
  );

  const channel = client.channels.cache.get(player.textChannel);

  client.embed(
    {
      title: `${client.emotes.normal.music}・${track.title}`,
      url: track.uri,
      desc: `Music started in <#${player.voiceChannel}>!`,
      thumbnail: track.thumbnail,
      fields: [
        {
          name: `👤┆Requested By`,
          value: `${track.requester}`,
          inline: true,
        },
        {
          name: `${client.emotes.normal.clock}┆Ends at`,
          value: `<t:${(Date.now() / 1000 + track.duration / 1000).toFixed(
            0
          )}:f>`,
          inline: true,
        },
        {
          name: `🎬┆Author`,
          value: `${track.author}`,
          inline: true,
        },
      ],
      components: [row],
    },
    channel
  );
};
