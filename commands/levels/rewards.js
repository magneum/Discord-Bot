const discord = require("discord.js");

const db = require("../../database/models/levelRewards");

module.exports = async (client, interaction, args) => {
  const rawLeaderboard = await db.find({ Guild: interaction.guild.id });

  if (rawLeaderboard.length < 1)
    return client.errNormal(
      {
        error: `No rewards found!`,
        type: "editreply",
      },
      interaction
    );

  const lb = rawLeaderboard.map((e) => `**Level ${e.Level}** - <@&${e.Role}>`);

  await client.createLeaderboard(
    `🆙・Level rewards - ${interaction.guild.name}`,
    lb,
    interaction
  );
};
