const discord = require("discord.js");

const db = require("../../database/models/messageRewards");

module.exports = async (client, interaction, args) => {
  let messages = interaction.options.getNumber("amount");

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
        db.findOneAndDelete({
          Guild: interaction.guild.id,
          Messages: messages,
        }).then(() => {
          client.succNormal(
            {
              text: `Message reward removed`,
              fields: [
                {
                  name: "💬┆Messages",
                  value: `${messages}`,
                  inline: true,
                },
              ],
              type: "editreply",
            },
            interaction
          );
        });
      } else {
        return client.errNormal(
          {
            error: "No message reward found at this message amount!",
            type: "editreply",
          },
          interaction
        );
      }
    }
  );
};
