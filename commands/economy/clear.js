const discord = require("discord.js");

const db = require("../../database/models/economy");
const Schema2 = require("../../database/models/economyTimeout");
const store = require("../../database/models/economyStore");

module.exports = async (client, interaction, args) => {
  client.checkPerms(
    {
      flags: [discord.PermissionsBitField.Flags.Administrator],
      perms: [discord.PermissionsBitField.Flags.Administrator],
    },
    interaction
  );

  const row = new discord.ActionRowBuilder().addComponents(
    new discord.ButtonBuilder()
      .setCustomId("eco_go")
      .setEmoji("✅")
      .setStyle(discord.ButtonStyle.Success),

    new discord.ButtonBuilder()
      .setCustomId("eco_stop")
      .setEmoji("❌")
      .setStyle(discord.ButtonStyle.Danger)
  );

  client.embed(
    {
      title: `⏰・Reset economy`,
      desc: `Are you sure you want to reset the economy?`,
      components: [row],
      type: "editreply",
    },
    interaction
  );

  const filter = (i) => i.user.id === interaction.user.id;

  interaction.channel
    .awaitMessageComponent({
      filter,
      componentType: discord.ComponentType.Button,
      time: 60000,
    })
    .then(async (i) => {
      if (i.customId == "eco_go") {
        var remove = await db.deleteMany({ Guild: interaction.guild.id });
        var remove2 = await Schema2.deleteMany({ Guild: interaction.guild.id });
        var remove3 = await store.deleteMany({ Guild: interaction.guild.id });

        client.succNormal(
          {
            text: `The economy has been successfully reset in this guild!`,
            components: [],
            type: "editreply",
          },
          interaction
        );
      }

      if (i.customId == "eco_stop") {
        client.errNormal(
          {
            error: `The economy reset has been cancelled!`,
            components: [],
            type: "editreply",
          },
          interaction
        );
      }
    })
    .catch(() => {
      client.errNormal(
        {
          error: "Time's up! Cancelled the economy reset!",
          type: "editreply",
        },
        interaction
      );
    });
};
