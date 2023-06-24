const discord = require("discord.js");

const db = require("../../database/models/userBans");

const webhookClientLogs = new discord.WebhookClient({
  id: "",
  token: "",
});

module.exports = async (client, interaction, args) => {
  const boolean = interaction.options.getBoolean("new");
  const member = interaction.options.getUser("user");

  if (boolean == true) {
    if (member.id === interaction.user.id) {
      // add the check here
      return client.errNormal(
        {
          error: `You cannot ban yourself from the bot`,
          type: `editreply`,
        },
        interaction
      );
    }

    db.findOne({ User: member.id }, async (err, data) => {
      if (data) {
        return client.errNormal(
          {
            error: `<@!${member.id}> (${member.id}) has already been banned from the bot`,
            type: `editreply`,
          },
          interaction
        );
      } else {
        new db({
          User: member.id,
        }).save();

        client.succNormal(
          {
            text: `<@!${member.id}> (${member.id}) banned from the bot`,
            type: "editreply",
          },
          interaction
        );

        let embedLogs = new discord.EmbedBuilder()
          .setTitle(`🔨・Ban added`)
          .setDescription(`<@!${member.id}> (${member.id}) banned from the bot`)
          .addFields({
            name: "👤┆Banned By",
            value: `${interaction.user} (${interaction.user.tag})`,
            inline: true,
          })
          .setColor(client.config.colors.normal)
          .setFooter({ text: client.config.discord.footer })
          .setTimestamp();
        webhookClientLogs.send({
          username: "Bot Bans",
          embeds: [embedLogs],
        });
      }
    });
  } else if (boolean == false) {
    db.findOne({ User: member.id }, async (err, data) => {
      if (data) {
        db.findOneAndDelete({ User: member.id }).then(() => {
          client.succNormal(
            {
              text: `<@!${member.id}> (${member.id}) unbanned from the bot`,
              type: "editreply",
            },
            interaction
          );

          let embedLogs = new discord.EmbedBuilder()
            .setTitle(`🔨・Ban removed`)
            .setDescription(
              `<@!${member.id}> (${member.id}) unbanned from the bot`
            )
            .addFields({
              name: "👤┆Unbanned By",
              value: `${interaction.user} (${interaction.user.tag})`,
              inline: true,
            })
            .setColor(client.config.colors.normal)
            .setFooter({ text: client.config.discord.footer })
            .setTimestamp();
          webhookClientLogs.send({
            username: "Bot Bans",
            embeds: [embedLogs],
          });
        });
      } else {
        return client.errNormal(
          {
            error: `<@!${member.id}> (${member.id}) has not been banned from the bot`,
            type: `editreply`,
          },
          interaction
        );
      }
    });
  }
};
