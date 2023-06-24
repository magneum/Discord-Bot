const discord = require("discord.js");

const db = require("../../database/models/stickymessages");

module.exports = async (client, interaction, args) => {
  const data = await db.find({ Guild: interaction.guild.id });

  if (data) {
    let list = ``;

    for (var i = 0; i < data.length; i++) {
      list += `**${i + 1}** - Channel: ${data[i].Channel}`;
    }

    await client.embed(
      {
        title: `💬・Sticky messages`,
        desc: list,
        type: "editreply",
      },
      interaction
    );
  } else {
    client.errNormal(
      {
        error: "No data found!",
        type: "editreply",
      },
      interaction
    );
  }
};
