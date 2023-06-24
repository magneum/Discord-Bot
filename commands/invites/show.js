const discord = require("discord.js");

const db = require("../../database/models/invites");

module.exports = async (client, interaction, args) => {
  let user = interaction.options.getUser("user") || interaction.user;

  db.findOne(
    { Guild: interaction.guild.id, User: user.id },
    async (err, data) => {
      if (data) {
        client.embed(
          {
            title: "📨・Invites",
            desc: `**${user.tag}** has \`${data.Invites}\` invites`,
            fields: [
              {
                name: "Total",
                value: `${data.Total}`,
                inline: true,
              },
              {
                name: "Left",
                value: `${data.Left}`,
                inline: true,
              },
            ],
            type: "editreply",
          },
          interaction
        );
      } else {
        client.embed(
          {
            title: "📨・Invites",
            desc: `**${user.tag}** has \`0\` invites`,
            fields: [
              {
                name: "Total",
                value: `0`,
                inline: true,
              },
              {
                name: "Left",
                value: `0`,
                inline: true,
              },
            ],
            type: "editreply",
          },
          interaction
        );
      }
    }
  );
};
