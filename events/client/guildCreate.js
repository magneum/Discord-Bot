const discord = require("discord.js");
const Functions = require("../../database/models/functions");

module.exports = async (client, guild) => {
  const webhookClient = new discord.WebhookClient({
    id: client.weblogs.weblog.id,
    token: client.weblogs.weblog.token,
  });

  if (guild == undefined) return;

  new Functions({
    Guild: guild.id,
    Prefix: client.config.discord.prefix,
  }).save();

  try {
    const promises = [
      client.shard.broadcastEval((client) => client.guilds.cache.size),
      client.shard.broadcastEval((client) =>
        client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      ),
    ];
    Promise.all(promises).then(async (results) => {
      const totalGuilds = results[0].reduce(
        (acc, guildCount) => acc + guildCount,
        0
      );
      const embed = new discord.EmbedBuilder()
        .setTitle("🟢・Added to a new server!")
        .addFields(
          { name: "Total servers:", value: `${totalGuilds}`, inline: true },
          { name: "Server name", value: `${guild.name}`, inline: true },
          { name: "Server ID", value: `${guild.id}`, inline: true },
          {
            name: "Server members",
            value: `${guild.memberCount}`,
            inline: true,
          },
          {
            name: "Server owner",
            value: `<@!${guild.ownerId}> (${guild.ownerId})`,
            inline: true,
          }
        )
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/843487478881976381/852419422392156210/BotPartyEmote.png"
        )
        .setColor("#5865F2");
      webhookClient.send({
        username: "Bot Logs",
        avatarURL: client.user.avatarURL(),
        embeds: [embed],
      });
    });

    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
      if (
        channel.type == discord.ChannelType.GuildText &&
        defaultChannel == ""
      ) {
        if (
          channel
            .permissionsFor(guild.members.me)
            .has(discord.PermissionFlagsBits.SendMessages)
        ) {
          defaultChannel = channel;
        }
      }
    });

    let row = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setLabel("Invite")
        .setURL(client.config.discord.botInvite)
        .setStyle(discord.ButtonStyle.Link),

      new discord.ButtonBuilder()
        .setLabel("Support server")
        .setURL(client.config.discord.serverInvite)
        .setStyle(discord.ButtonStyle.Link)
    );

    client.embed(
      {
        title: "Thanks for inviting the bot!",
        image:
          "https://cdn.discordapp.com/attachments/843487478881976381/874694194474668052/bot_banner_invite.jpg",
        fields: [
          {
            name: "❓┆How to setup?",
            value:
              "The default prefix = `/`\nTo run setups with Bot run `/setup`",
            inline: false,
          },
          {
            name: "☎️┆I need help what now?",
            value: `You can DM <@755297485328482356> for support or joining the [[Support server]](${client.config.discord.serverInvite})`,
            inline: false,
          },
          {
            name: "💻┆What are the commands?",
            value: "See that list of commands by doing `/help`",
            inline: false,
          },
          {
            name: "📨┆Invite the bot!",
            value: `Invite the bot to click [[HERE]](${client.config.discord.botInvite})`,
            inline: false,
          },
        ],
        components: [row],
      },
      defaultChannel
    );
  } catch (err) {
    console.log(err);
  }
};
