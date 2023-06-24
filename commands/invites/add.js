const discord = require("discord.js");

const db = require("../../database/models/invites");

module.exports = async (client, interaction, args) => {
  let user = interaction.options.getUser("user");
  let amount = interaction.options.getNumber("amount");

  const perms = await client.checkUserPerms(
    {
      flags: [discord.PermissionsBitField.Flags.ManageMessages],
      perms: [discord.PermissionsBitField.Flags.ManageMessages],
    },
    interaction
  );

  if (perms == false) return;

  const data = await db.findOne({
    Guild: interaction.guild.id,
    User: user.id,
  });
  if (data) {
    data.Invites += amount;
    data.Total += amount;
    data.save();
  } else {
    new db({
      Guild: interaction.guild.id,
      User: user.id,
      Invites: amount,
      Total: amount,
      Left: 0,
    }).save();
  }

  client.succNormal(
    {
      text: `Added **${amount}** invites to ${user}`,
      fields: [
        {
          name: "📨┆Total invites",
          value: `${data.Invites}`,
          inline: true,
        },
      ],
      type: "editreply",
    },
    interaction
  );
};
