const db = require("../../database/models/notes");

module.exports = async (client, interaction, args) => {
  let id = interaction.options.getString("id");

  db.findOne(
    { Guild: interaction.guild.id, Code: id },
    async (err, data) => {
      if (data) {
        db.findOneAndDelete({ Guild: interaction.guild.id, Code: id }).then(
          () => {
            client.succNormal(
              { text: `Note **#${id}** has been deleted!`, type: "editreply" },
              interaction
            );
          }
        );
      } else {
        client.errNormal(
          { error: `No note found with the id **#${id}**`, type: "editreply" },
          interaction
        );
      }
    }
  );
};
