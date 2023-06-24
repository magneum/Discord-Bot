const db = require("../../database/models/birthday");

module.exports = async (client, interaction, args) => {
  const rawBirthdayboard = await db.find({ Guild: interaction.guild.id });

  if (rawBirthdayboard.length < 1)
    return client.errNormal(
      {
        error: "No birthdays found!",
        type: "editreply",
      },
      interaction
    );

  const lb = rawBirthdayboard.map(
    (e) =>
      `${client.emotes.normal.birthday} | **<@!${e.User}>** - ${e.Birthday} `
  );

  await client.createLeaderboard(
    `🎂・Birthdays - ${interaction.guild.name}`,
    lb,
    interaction
  );
};
