const discord = require("discord.js");
const Voice = require("@discordjs/voice");

module.exports = (client) => {
  client
    .on(discord.Events.InteractionCreate, async (interaction) => {
      if (interaction.isButton()) {
        switch (interaction.customId) {
          case "Bot-musicpause":
            interaction.deferUpdate();
            handleMusicPause(interaction, client);
            break;

          case "Bot-musicstart":
            interaction.deferUpdate();
            handleMusicStart(interaction, client);
            break;

          case "Bot-musicstop":
            interaction.deferUpdate();
            handleMusicStop(interaction, client);
            break;

          case "Bot-musicnext":
            interaction.deferUpdate();
            handleMusicNext(interaction, client);
            break;

          case "Bot-musicprev":
            interaction.deferUpdate();
            handleMusicPrevious(interaction, client);
            break;
        }
      }
    })
    .setMaxListeners(0);
};

function handleMusicPause(interaction, client) {
  const player = client.player.players.get(interaction.guild.id);
  if (!player) return;

  player.pause(true);

  const embedData = interaction.message.embeds[0];

  let row = new discord.ActionRowBuilder().addComponents(
    new discord.ButtonBuilder()
      .setEmoji(client.emotes.music.previous)
      .setCustomId("Bot-musicprev")
      .setStyle(discord.ButtonStyle.Secondary),

    new discord.ButtonBuilder()
      .setEmoji(client.emotes.music.play)
      .setCustomId("Bot-musicstart")
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

  client.embed(
    {
      title: embedData.title,
      url: embedData.url,
      desc: `Music is currently paused`,
      thumbnail: embedData.thumbnail.url,
      fields: embedData.fields,
      components: [row],
      color: "#ED4245",
      type: "edit",
    },
    interaction.message
  );
}

function handleMusicStart(interaction, client) {
  const player = client.player.players.get(interaction.guild.id);
  if (!player) return;

  player.pause(false);

  const embedData = interaction.message.embeds[0];

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

  client.embed(
    {
      title: embedData.title,
      url: embedData.url,
      desc: `Music is currently resumed`,
      thumbnail: embedData.thumbnail.url,
      fields: embedData.fields,
      components: [row],
      type: "edit",
    },
    interaction.message
  );
}

function handleMusicStop(interaction, client) {
  const player = client.player.players.get(interaction.guild.id);
  if (!player) return;

  player.destroy();

  client.embed(
    {
      desc: `Music is currently stopped`,
      color: "#ED4245",
      components: [],
      type: "edit",
    },
    interaction.message
  );
}

function handleMusicNext(interaction, client) {
  const player = client.player.players.get(interaction.guild.id);
  if (!player) return;

  player.stop();

  const track = player.queue.current;

  let row = new discord.ActionRowBuilder().addComponents(
    new discord.ButtonBuilder()
      .setEmoji("⏮️")
      .setCustomId("Bot-musicprev")
      .setStyle(discord.ButtonStyle.Primary),

    new discord.ButtonBuilder()
      .setEmoji("⏸️")
      .setCustomId("Bot-musicpause")
      .setStyle(discord.ButtonStyle.Primary),

    new discord.ButtonBuilder()
      .setEmoji("⏹️")
      .setCustomId("Bot-musicstop")
      .setStyle(discord.ButtonStyle.Primary),

    new discord.ButtonBuilder()
      .setEmoji("⏭️")
      .setCustomId("Bot-musicnext")
      .setStyle(discord.ButtonStyle.Primary)
  );

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
      type: "edit",
    },
    interaction.message
  );
}

function handleMusicPrevious(interaction, client) {
  const player = client.player.players.get(interaction.guild.id);
  if (!player || !player.queue.previous) return;

  const track = player.queue.previous;

  let row = new discord.ActionRowBuilder().addComponents(
    new discord.ButtonBuilder()
      .setEmoji("⏮️")
      .setCustomId("Bot-musicprev")
      .setStyle(discord.ButtonStyle.Primary),

    new discord.ButtonBuilder()
      .setEmoji("⏸️")
      .setCustomId("Bot-musicpause")
      .setStyle(discord.ButtonStyle.Primary),

    new discord.ButtonBuilder()
      .setEmoji("⏹️")
      .setCustomId("Bot-musicstop")
      .setStyle(discord.ButtonStyle.Primary),

    new discord.ButtonBuilder()
      .setEmoji("⏭️")
      .setCustomId("Bot-musicnext")
      .setStyle(discord.ButtonStyle.Primary)
  );

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
      type: "edit",
    },
    interaction.message
  );

  player.play(player.queue.previous);
}
