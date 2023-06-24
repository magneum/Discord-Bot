const db = require("../../database/models/channelList");

module.exports = async (client, interaction, args) => {
  const type = interaction.options.getString("type");
  const channel = interaction.options.getChannel("channel");

  if (type == "add") {
    db.findOne({ Guild: interaction.guild.id }, async (err, data) => {
      if (data) {
        if (data.Channels.includes(channel.id)) {
          return client.errNormal(
            {
              error: `The channel ${channel} is already in the database!`,
              type: "editreply",
            },
            interaction
          );
        }

        data.Channels.push(channel.id);
        data.save();
      } else {
        new db({
          Guild: interaction.guild.id,
          Channels: channel.id,
        }).save();
      }
    });

    client.succNormal(
      {
        text: `Channel has been added to the whitelist!`,
        fields: [
          {
            name: `📘┆Channel`,
            value: `${channel} (${channel.name})`,
          },
        ],
        type: "editreply",
      },
      interaction
    );
  } else if (type == "remove") {
    db.findOne({ Guild: interaction.guild.id }, async (err, data) => {
      if (data) {
        if (!data.Channels.includes(channel.id)) {
          return client.errNormal(
            {
              error: `The channel ${channel} doesn't exist in the database!`,
              type: "editreply",
            },
            interaction
          );
        }

        const filtered = data.Channels.filter(
          (target) => target !== channel.id
        );

        await db.findOneAndUpdate(
          { Guild: interaction.guild.id },
          {
            Guild: interaction.guild.id,
            Channels: filtered,
          }
        );

        client.succNormal(
          {
            text: `Channel has been removed from the whitelist!`,
            fields: [
              {
                name: `📘┆Channel`,
                value: `${channel} (${channel.name})`,
              },
            ],
            type: "editreply",
          },
          interaction
        );
      } else {
        return client.errNormal(
          {
            error: `This guild has not data!`,
            type: "editreply",
          },
          interaction
        );
      }
    });
  }
};
