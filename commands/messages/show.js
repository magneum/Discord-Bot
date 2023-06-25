const discord = require("discord.js");

const db = require("../../database/models/messages");

module.exports = async (client, interaction, args) => {
  let user = interaction.options.getUser("user") || interaction.user;

  db.findOne(
    { Guild: interaction.guild.id, User: user.id },
    async (err, data) => {
      if (data) {
        client.embed(
          {
            title: "💬・Messages",
            desc: `**${user.tag}** has \`${data.Messages}\` messages`,
            type: "editreply",
          },
          interaction
        );
      } else {
        client.embed(
          {
            title: "💬・Messages",
            desc: `**${user.tag}** has \`0\` messages`,
            type: "editreply",
          },
          interaction
        );
      }
    }
  );
};