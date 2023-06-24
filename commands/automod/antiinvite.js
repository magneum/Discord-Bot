const db = require("../../database/models/functions");

module.exports = async (client, interaction, args) => {
  const boolean = interaction.options.getBoolean("active");

  const data = await db.findOne({ Guild: interaction.guild.id });
  if (data) {
    data.AntiInvite = boolean;
    data.save();
  } else {
    new db({
      Guild: interaction.guild.id,
      AntiInvite: boolean,
    }).save();
  }

  client.succNormal(
    {
      text: `Anti invite is now **${
        boolean ? "enabled" : "disabled"
      }** in this guild`,
      type: "editreply",
    },
    interaction
  );
};
