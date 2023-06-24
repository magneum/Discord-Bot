const db = require("../../database/models/profile");

module.exports = async (client, interaction, args) => {
  const artist = interaction.options.getString("artist");
  const user = { User: interaction.user.id };

  db.findOne({ User: interaction.user.id }, async (err, data) => {
    if (data) {
      if (data && data.Artists) {
        if (!data.Artists.includes(artist)) {
          return client.errNormal(
            {
              error: `That artist doesn't exist in the database!`,
              type: "editreply",
            },
            interaction
          );
        }

        const filtered = data.Artists.filter((target) => target !== artist);

        await db.findOneAndUpdate(user, {
          Artists: filtered,
        });
      }
      client.succNormal(
        {
          text: "Removed your artist",
          fields: [
            {
              name: "🎤┆Artist",
              value: `\`\`\`${artist}\`\`\``,
              inline: true,
            },
          ],
          type: "editreply",
        },
        interaction
      );
    } else {
      return client.errNormal(
        {
          error: "No profile found! Open a profile with createprofile",
          type: "editreply",
        },
        interaction
      );
    }
  });
};
