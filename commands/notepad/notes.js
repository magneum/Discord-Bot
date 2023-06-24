const db = require("../../database/models/notes");

module.exports = async (client, interaction, args) => {
  const rawboard = await db.find({
    Guild: interaction.guild.id,
    User: interaction.user.id,
  });

  if (rawboard.length < 1)
    return client.errNormal(
      { error: "No notes found!", type: "editreply" },
      interaction
    );

  const lb = rawboard.map((e) => `**Note ID: ${e.Code}** \n${e.Note} \n`);

  await client.createLeaderboard(
    `📓・Notes - ${interaction.user.username}`,
    lb,
    interaction
  );
};
