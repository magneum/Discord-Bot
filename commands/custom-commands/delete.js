const discord = require("discord.js");
const db = require("../../database/models/customCommandAdvanced");

module.exports = async (client, interaction, args) => {
  const cmdname = interaction.options.getString("command");
  db.findOne(
    { Guild: interaction.guild.id, Name: cmdname.toLowerCase() },
    async (err, data) => {
      console.log(data);
      if (data) {
        db.findOneAndDelete({
          Guild: interaction.guild.id,
          Name: cmdname.toLowerCase(),
        }).then(async () => {
          var commands = await interaction.guild.commands.fetch();
          var command = await commands.find(
            (cmd) => cmd.name == cmdname.toLowerCase()
          );
          if (!command)
            return client.errNormal(
              { error: "Unable to find this command!", type: "editreply" },
              interaction
            );
          await interaction.guild.commands.delete(command.id);

          client.succNormal(
            {
              text: `The command has been deleted successfully`,
              fields: [
                {
                  name: "🔧┆Command",
                  value: `\`\`\`${cmdname}\`\`\``,
                  inline: true,
                },
              ],
              type: "editreply",
            },
            interaction
          );
        });
      } else {
        client.errNormal(
          { error: "Unable to find this command!", type: "editreply" },
          interaction
        );
      }
    }
  );
};
