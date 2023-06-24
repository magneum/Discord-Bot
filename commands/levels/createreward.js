const discord = require("discord.js");

const db = require("../../database/models/levelRewards");

module.exports = async (client, interaction, args) => {
  let level = interaction.options.getNumber("level");
  let role = interaction.options.getRole("role");

  const perms = await client.checkUserPerms(
    {
      flags: [discord.PermissionsBitField.Flags.ManageMessages],
      perms: [discord.PermissionsBitField.Flags.ManageMessages],
    },
    interaction
  );

  if (perms == false) return;

  db.findOne(
    { Guild: interaction.guild.id, Level: level },
    async (err, data) => {
      if (data) {
        return client.errNormal(
          {
            error: "This level already has a reward!",
            type: "editreply",
          },
          interaction
        );
      } else {
        new db({
          Guild: interaction.guild.id,
          Level: level,
          Role: role.id,
        }).save();

        client.succNormal(
          {
            text: `Level reward created`,
            fields: [
              {
                name: "📘┆Role",
                value: `${role}`,
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
