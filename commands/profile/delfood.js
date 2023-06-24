const db = require("../../database/models/profile");

module.exports = async (client, interaction, args) => {
  const food = interaction.options.getString("food");
  const user = { User: interaction.user.id };

  db.findOne({ User: interaction.user.id }, async (err, data) => {
    if (data) {
      if (data && data.Food) {
        if (!data.Food.includes(food)) {
          return client.errNormal(
            {
              error: `That food doesn't exist in the database!`,
              type: "editreply",
            },
            interaction
          );
        }

        const filtered = data.Food.filter((target) => target !== food);

        await db.findOneAndUpdate(user, {
          Food: filtered,
        });
      }
      client.succNormal(
        {
          text: "Removed your food",
          fields: [
            {
              name: "🥐┆Food",
              value: `\`\`\`${food}\`\`\``,
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
