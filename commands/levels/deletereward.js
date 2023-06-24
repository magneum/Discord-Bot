const discord = require("discord.js");

const db = require("../../database/models/levelRewards");

module.exports = async (client, interaction, args) => {
  let level = interaction.options.getNumber("level");

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
        db.findOneAndDelete({
          Guild: interaction.guild.id,
          Level: level,
        }).then(() => {
          client.succNormal(
            {
              text: `Level reward removed`,
              fields: [
                {
                  name: "🆙┆Level",
                  value: `${level}`,
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
            error: "No level reward found at this level!",
            type: "editreply",
          },
          interaction
        );
      }
    }
  );
};
