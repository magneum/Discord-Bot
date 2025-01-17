const discord = require("discord.js");

const db = require("../../database/models/messageRewards");

module.exports = async (client, interaction, args) => {
  let messages = interaction.options.getNumber("amount");
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
    { Guild: interaction.guild.id, Messages: messages },
    async (err, data) => {
      if (data) {
        return client.errNormal(
          {
            error: "This message amount already has a reward!",
            type: "editreply",
          },
          interaction
        );
      } else {
        new db({
          Guild: interaction.guild.id,
          Messages: messages,
          Role: role.id,
        }).save();

        client.succNormal(
          {
            text: `Message reward created`,
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
