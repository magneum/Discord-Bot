const discord = require("discord.js");

const db = require("../../database/models/functions");

module.exports = async (client, interaction, args) => {
  const perms = await client.checkUserPerms(
    {
      flags: [discord.PermissionsBitField.Flags.Administrator],
      perms: [discord.PermissionsBitField.Flags.Administrator],
    },
    interaction
  );

  if (perms == false) return;

  const rawColor = interaction.options.getString("color");
  let color = "";

  if (rawColor.toUpperCase() == "DEFAULT") {
    color = "#5865F2".replace("#", "");
  } else {
    color = rawColor;
  }

  if (!isHexColor(color))
    return client.errNormal(
      {
        error: "You did not specify an hex color! Example: ff0000",
        type: "editreply",
      },
      interaction
    );

  db.findOne({ Guild: interaction.guild.id }, async (err, data) => {
    if (data) {
      data.Color = `#${color}`;
      data.save();
    } else {
      new db({
        Guild: interaction.guild.id,
        Color: `#${color}`,
      }).save();
    }
  });

  client.succNormal(
    {
      text: `The embed color has been adjusted successfully`,
      fields: [
        {
          name: `🎨┆New color`,
          value: `#${color}`,
          inline: true,
        },
      ],
      type: "editreply",
    },
    interaction
  );
};

function isHexColor(hex) {
  return (
    typeof hex === "string" && hex.length === 6 && !isNaN(Number("0x" + hex))
  );
}
