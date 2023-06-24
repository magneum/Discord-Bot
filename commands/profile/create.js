const db = require("../../database/models/profile");

module.exports = async (client, interaction, args) => {
  db.findOne({ User: interaction.user.id }, async (err, data) => {
    if (data) {
      return client.errNormal(
        { error: "You already have a Bot profile", type: "editreply" },
        interaction
      );
    } else {
      new db({
        User: interaction.user.id,
      }).save();

      client.succNormal(
        {
          text: "Profile created! View your profile by running `profile`",
          type: "editreply",
        },
        interaction
      );
    }
  });
};
