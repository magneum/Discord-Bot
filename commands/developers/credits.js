const discord = require("discord.js");

const db = require("../../database/models/votecredits");

const webhookClientLogs = new discord.WebhookClient({
  id: "",
  token: "",
});

module.exports = async (client, interaction, args) => {
  const type = interaction.options.getString("type");
  const user = interaction.options.getUser("user");
  const amount = interaction.options.getNumber("amount");

  if (type == "add") {
    db.findOne({ User: user.id }, async (err, data) => {
      if (data) {
        data.Credits += amount;
        data.save();
      } else {
        new db({
          User: user.id,
          Credits: amount,
        }).save();
      }
    });

    client.succNormal(
      {
        text: `Added **${amount} credits** to ${user}`,
        type: "editreply",
      },
      interaction
    );

    let embedLogs = new discord.EmbedBuilder()
      .setTitle(`🪙・Credits added`)
      .setDescription(`Added credits to ${user} (${user.id})`)
      .addFields(
        {
          name: "👤┆Added By",
          value: `${interaction.user} (${interaction.user.tag})`,
          inline: true,
        },
        { name: "🔢┆Amount", value: `${amount}`, inline: true }
      )
      .setColor(client."#5865F2")
      .setTimestamp();
    webhookClientLogs.send({
      username: "Bot Credits",
      embeds: [embedLogs],
    });
  } else if (type == "remove") {
    db.findOne({ User: user.id }, async (err, data) => {
      if (data) {
        data.Credits -= amount;
        data.save();
      }
    });

    client.succNormal(
      {
        text: `Removed **${amount} credits** from ${user}`,
        type: "editreply",
      },
      interaction
    );

    let embedLogs = new discord.EmbedBuilder()
      .setTitle(`🪙・Credits removed`)
      .setDescription(`Removed credits from ${user} (${user.id})`)
      .addFields(
        {
          name: "👤┆Removed By",
          value: `${interaction.user} (${interaction.user.tag})`,
          inline: true,
        },
        { name: "🔢┆Amount", value: `${amount}`, inline: true }
      )
      .setColor(client."#5865F2")
      .setTimestamp();
    webhookClientLogs.send({
      username: "Bot Credits",
      embeds: [embedLogs],
    });
  }
};
