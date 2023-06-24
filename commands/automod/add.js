const db = require("../../database/models/blacklist");

module.exports = async (client, interaction, args) => {
  const word = interaction.options.getString("word");

  db.findOne({ Guild: interaction.guild.id }, async (err, data) => {
    if (data) {
      if (data.Words.includes(word)) {
        return client.errNormal(
          {
            error: `That word is already exists in the database!`,
            type: "editreply",
          },
          interaction
        );
      }
      if (!data.Words) data.Words = [];
      data.Words.push(word);
      data.save();
    } else {
      new db({
        Guild: interaction.guild.id,
        Words: word,
      }).save();
    }
  });

  client.succNormal(
    {
      text: `Word is now blacklisted!`,
      fields: [
        {
          name: `💬┆Word`,
          value: `${word}`,
        },
      ],
      type: "editreply",
    },
    interaction
  );
};
