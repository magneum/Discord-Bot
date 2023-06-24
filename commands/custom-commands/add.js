const discord = require("discord.js");
const db = require("../../database/models/customCommandAdvanced");

module.exports = async (client, interaction, args) => {
  const cmdname = interaction.options.getString("command");
  const cmdresponce = interaction.options.getString("text");

  db.findOne(
    { Guild: interaction.guild.id, Name: cmdname.toLowerCase() },
    async (err, data) => {
      if (data) {
        client.errNormal(
          {
            error:
              "This command name is already added in guild custom commands!",
            type: "editreply",
          },
          interaction
        );
      } else {
        const row = new discord.ActionRowBuilder().addComponents(
          new discord.StringSelectMenuBuilder()
            .setCustomId("customSelect")
            .setPlaceholder("❌┆Nothing selected")
            .addOptions([
              {
                label: `Embed`,
                description: `Send a message in an embed`,
                value: "command-embed",
              },
              {
                label: `Normal`,
                description: `Send a message as normal`,
                value: "command-normal",
              },
              {
                label: `Private`,
                description: `Send the message in DM`,
                value: "command-dm",
              },
            ])
        );

        client.embed(
          {
            desc: `What action should be attached to this command?`,
            components: [row],
            type: "editreply",
          },
          interaction
        );

        const filter = (i) => i.user.id === interaction.user.id;

        interaction.channel
          .awaitMessageComponent({ filter, max: 1 })
          .then(async (i) => {
            if (i.customId == "customSelect") {
              await i.deferUpdate();
              if (i.values[0] === "command-embed") {
                new db({
                  Guild: interaction.guild.id,
                  Name: cmdname.toLowerCase(),
                  Responce: cmdresponce,
                  Action: "Embed",
                }).save();

                client.succNormal(
                  {
                    text: `The command has been added successfully`,
                    fields: [
                      {
                        name: "🔧┆Command",
                        value: `\`\`\`${cmdname.toLowerCase()}\`\`\``,
                        inline: true,
                      },
                    ],
                    components: [],
                    type: "editreply",
                  },
                  i
                );
              }

              if (i.values[0] === "command-normal") {
                new db({
                  Guild: interaction.guild.id,
                  Name: cmdname.toLowerCase(),
                  Responce: cmdresponce,
                  Action: "Normal",
                }).save();

                client.succNormal(
                  {
                    text: `The command has been added successfully`,
                    fields: [
                      {
                        name: "🔧┆Command",
                        value: `\`\`\`${cmdname.toLowerCase()}\`\`\``,
                        inline: true,
                      },
                    ],
                    components: [],
                    type: "editreply",
                  },
                  i
                );
              }

              if (i.values[0] === "command-dm") {
                new db({
                  Guild: interaction.guild.id,
                  Name: cmdname.toLowerCase(),
                  Responce: cmdresponce,
                  Action: "DM",
                }).save();

                client.succNormal(
                  {
                    text: `The command has been added successfully`,
                    fields: [
                      {
                        name: "🔧┆Command",
                        value: `\`\`\`${cmdname.toLowerCase()}\`\`\``,
                        inline: true,
                      },
                    ],
                    components: [],
                    type: "editreply",
                  },
                  i
                );
              }

              await interaction.guild.commands.create({
                name: cmdname,
                description: "Custom server command",
              });
            }
          });
      }
    }
  );
};
