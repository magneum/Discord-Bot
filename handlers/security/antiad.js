const discord = require("discord.js");

const Schema = require("../../database/models/functions");
const Schema2 = require("../../database/models/channelList");

module.exports = (client) => {
  client
    .on(discord.Events.MessageCreate, async (message) => {
      if (message.channel.type === discord.ChannelType.DM || message.author.bot)
        return;
      Schema.findOne({ Guild: message.guild.id }, async (err, data) => {
        if (data) {
          if (data.AntiInvite == true) {
            const { content } = message;

            const code = content.split("discord.gg/")[1];
            if (code) {
              Schema2.findOne(
                { Guild: message.guild.id },
                async (err, data2) => {
                  if (data2) {
                    if (
                      data2.Channels.includes(message.channel.id) ||
                      message.member.permissions.has(
                        discord.PermissionsBitField.Flags.ManageMessages
                      )
                    ) {
                      return;
                    }

                    message.delete();

                    client.embed(
                      {
                        title: `${client.emotes.normal.error}・Moderator`,
                        desc: `discord links are not allowed in this server!`,
                        color: "#ED4245",
                        content: `${message.author}`,
                      },
                      message.channel
                    );
                  } else {
                    if (
                      message.member.permissions.has(
                        discord.PermissionsBitField.Flags.ManageMessages
                      )
                    )
                      return;
                    message.delete();

                    client.embed(
                      {
                        title: `${client.emotes.normal.error}・Moderator`,
                        desc: `discord links are not allowed in this server!`,
                        color: "#ED4245",
                        content: `${message.author}`,
                      },
                      message.channel
                    );
                  }
                }
              );
            }
          } else if (data.AntiLinks == true) {
            const { content } = message;

            if (
              content.includes("http://") ||
              content.includes("https://") ||
              content.includes("www.")
            ) {
              Schema2.findOne(
                { Guild: message.guild.id },
                async (err, data2) => {
                  if (data2) {
                    if (
                      data2.Channels.includes(message.channel.id) ||
                      message.member.permissions.has(
                        discord.PermissionsBitField.Flags.ManageMessages
                      )
                    ) {
                      return;
                    }

                    message.delete();

                    client.embed(
                      {
                        title: `${client.emotes.normal.error}・Moderator`,
                        desc: `Links are not allowed in this server!`,
                        color: "#ED4245",
                        content: `${message.author}`,
                      },
                      message.channel
                    );
                  } else {
                    if (
                      message.member.permissions.has(
                        discord.PermissionsBitField.Flags.ManageMessages
                      )
                    )
                      return;
                    message.delete();

                    client.embed(
                      {
                        title: `${client.emotes.normal.error}・Moderator`,
                        desc: `Links are not allowed in this server!`,
                        color: "#ED4245",
                        content: `${message.author}`,
                      },
                      message.channel
                    );
                  }
                }
              );
            }
          }
        }
      });
    })
    .setMaxListeners(0);

  client
    .on(discord.Events.MessageUpdate, async (oldMessage, newMessage) => {
      if (
        oldMessage.content === newMessage.content ||
        newMessage.channel.type === discord.ChannelType.DM
      )
        return;

      Schema.findOne({ Guild: newMessage.guild.id }, async (err, data) => {
        if (data) {
          if (data.AntiInvite == true) {
            const { content } = newMessage;

            const code = content.split("discord.gg/")[1];
            if (code) {
              Schema2.findOne(
                { Guild: newMessage.guild.id },
                async (err, data2) => {
                  if (data2) {
                    if (
                      data2.Channels.includes(newMessage.channel.id) ||
                      newMessage.member.permissions.has(
                        discord.PermissionsBitField.Flags.ManageMessages
                      )
                    ) {
                      return;
                    }

                    newMessage.delete();
                    let error = new discord.EmbedBuilder()
                      .setTitle(`${client.emotes.normal.error}・Moderator`)
                      .setAuthor(client.user.username, client.user.avatarURL())
                      .setDescription(
                        `discord links are not allowed in this server!`
                      )
                      .setColor("#ED4245")
                      .setFooter({ text: client.config.discord.footer })
                      .setTimestamp();
                    var msg = newMessage.channel.send({
                      content: `${newMessage.author}`,
                      embeds: [error],
                    });
                    setTimeout(() => {
                      try {
                        msg.delete();
                      } catch (e) {
                        return;
                      }
                    }, 5000);
                  } else {
                    if (
                      newMessage.member.permissions.has(
                        discord.PermissionsBitField.Flags.ManageMessages
                      )
                    )
                      return;
                    newMessage.delete();
                    let error = new discord.EmbedBuilder()
                      .setTitle(`${client.emotes.normal.error}・Moderator`)
                      .setAuthor(client.user.username, client.user.avatarURL())
                      .setDescription(
                        `discord links are not allowed in this server!`
                      )
                      .setColor("#ED4245")
                      .setFooter({ text: client.config.discord.footer })
                      .setTimestamp();
                    var msg = newMessage.channel.send({
                      content: `${newMessage.author}`,
                      embeds: [error],
                    });
                    setTimeout(() => {
                      try {
                        msg.delete();
                      } catch (e) {
                        return;
                      }
                    }, 5000);
                  }
                }
              );
            }
          } else if (data.AntiLinks == true) {
            const { guild, member, content } = newMessage;

            if (
              content.includes("http://") ||
              content.includes("https://") ||
              content.includes("www.")
            ) {
              Schema2.findOne(
                { Guild: newMessage.guild.id },
                async (err, data2) => {
                  if (data2) {
                    if (
                      data2.Channels.includes(newMessage.channel.id) ||
                      newMessage.member.permissions.has(
                        discord.PermissionsBitField.Flags.ManageMessages
                      )
                    ) {
                      return;
                    }

                    newMessage.delete();
                    var error = new discord.EmbedBuilder()
                      .setTitle(`${client.emotes.normal.error}・Moderator`)
                      .setAuthor(client.user.username, client.user.avatarURL())
                      .setDescription(`Links are not allowed in this server!`)
                      .setColor("#ED4245")
                      .setFooter({ text: client.config.discord.footer })
                      .setTimestamp();
                    var msg = newMessage.channel.send({
                      content: `${newMessage.author}`,
                      embeds: [error],
                    });
                    setTimeout(() => {
                      try {
                        msg.delete();
                      } catch (e) {
                        return;
                      }
                    }, 5000);
                  } else {
                    if (
                      newMessage.member.permissions.has(
                        discord.PermissionsBitField.Flags.ManageMessages
                      )
                    )
                      return;
                    newMessage.delete();
                    var error = new discord.EmbedBuilder()
                      .setTitle(`${client.emotes.normal.error}・Moderator`)
                      .setAuthor(client.user.username, client.user.avatarURL())
                      .setDescription(`Links are not allowed in this server!`)
                      .setColor("#ED4245")
                      .setFooter({ text: client.config.discord.footer })
                      .setTimestamp();
                    var msg = newMessage.channel.send({
                      content: `${newMessage.author}`,
                      embeds: [error],
                    });
                    setTimeout(() => {
                      try {
                        msg.delete();
                      } catch (e) {
                        return;
                      }
                    }, 5000);
                  }
                }
              );
            }
          }
        }
      });
    })
    .setMaxListeners(0);
};
