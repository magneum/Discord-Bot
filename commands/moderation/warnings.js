const discord = require("discord.js");

const db = require("../../database/models/warnings");

module.exports = async (client, interaction, args) => {
  const perms = await client.checkUserPerms(
    {
      flags: [discord.PermissionsBitField.Flags.ManageMessages],
      perms: [discord.PermissionsBitField.Flags.ManageMessages],
    },
    interaction
  );

  if (perms == false) {
    client.errNormal(
      {
        error: "You don't have the required permissions to use this command!",
        type: "editreply",
      },
      interaction
    );
    return;
  }

  const member = interaction.options.getUser("user");

  db.findOne(
    { Guild: interaction.guild.id, User: member.id },
    async (err, data) => {
      if (data) {
        var fields = [];
        data.Warnings.forEach((element) => {
          fields.push({
            name: "Warning **" + element.Case + "**",
            value:
              "Reason: " +
              element.Reason +
              "\nModerator <@!" +
              element.Moderator +
              ">",
            inline: true,
          });
        });
        client.embed(
          {
            title: `${client.emotes.normal.error}・Warnings`,
            desc: `The warnings of **${member.tag}**`,
            fields: [
              {
                name: "Total",
                value: `${data.Warnings.length}`,
              },
              ...fields,
            ],
            type: "editreply",
          },
          interaction
        );
      } else {
        client.embed(
          {
            title: `${client.emotes.normal.error}・Warnings`,
            desc: `User ${member.user.tag} has no warnings!`,
            type: "editreply",
          },
          interaction
        );
      }
    }
  );
};
