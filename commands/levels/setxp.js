const discord = require("discord.js");
const Canvacord = require("canvacord");

const Functions = require("../../database/models/functions");
const db = require("../../database/models/levels");

module.exports = async (client, interaction, args) => {
  const data = await Functions.findOne({ Guild: interaction.guild.id });

  const perms = await client.checkUserPerms(
    {
      flags: [discord.PermissionsBitField.Flags.ManageMessages],
      perms: [discord.PermissionsBitField.Flags.ManageMessages],
    },
    interaction
  );

  if (perms == false) return;

  if (data && data.Levels == true) {
    const target = interaction.options.getUser("user");
    const xp = interaction.options.getNumber("amount");

    const user = await client.setXP(target.id, interaction.guild.id, xp);

    client.succNormal(
      {
        text: `XP has been modified successfully`,
        fields: [
          {
            name: "🆕┆New XP",
            value: `${user.xp}`,
            inline: true,
          },
          {
            name: "👤┆User",
            value: `${target} (${target.tag})`,
            inline: true,
          },
        ],
        type: "editreply",
      },
      interaction
    );
  } else {
    client.errNormal(
      {
        error: "Levels are disabled in this guild!",
        type: "editreply",
      },
      interaction
    );
  }
};
