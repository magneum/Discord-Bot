const db = require("../../database/models/profile");

module.exports = async (client, interaction, args) => {
  db.findOne({ User: interaction.user.id }, async (err, data) => {
    if (data) {
      db.findOneAndDelete({
        Guild: interaction.guild.id,
        User: interaction.user.id,
      }).then(() => {
        client.succNormal(
          {
            text: "Your profile was deleted!",
            type: "editreply",
          },
          interaction
        );
      });
    } else {
      client.errNormal(
        {
          error: "No profile found!",
          type: "editreply",
        },
        interaction
      );
    }
  });
};
