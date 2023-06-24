const db = require("../../database/models/birthday");

module.exports = async (client, interaction, args) => {
  db.findOne(
    { Guild: interaction.guild.id, User: interaction.user.id },
    async (err, data) => {
      if (!data)
        return client.errNormal(
          {
            error: "No birthday found!",
            type: "editreply",
          },
          interaction
        );

      db.findOneAndDelete({
        Guild: interaction.guild.id,
        User: interaction.user.id,
      }).then(() => {
        client.succNormal(
          {
            text: "Deleted your birthday",
            type: "editreply",
          },
          interaction
        );
      });
    }
  );
};
