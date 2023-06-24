const discord = require("discord.js");

const db = require("../../database/models/economy");

module.exports = async (client, interaction, args) => {
  let user = interaction.user;
  var result = Math.ceil(Math.random() * 12);

  db.findOne(
    { Guild: interaction.guild.id, User: user.id },
    async (err, data) => {
      if (data) {
        let money = parseInt(interaction.options.getNumber("amount"));
        if (!money)
          return client.errUsage(
            { usage: "crash [amount]", type: "editreply" },
            interaction
          );

        if (money > data.Money)
          return client.errNormal(
            { error: `You are betting more than you have!`, type: "editreply" },
            interaction
          );

        const row = new discord.ActionRowBuilder().addComponents(
          new discord.ButtonBuilder()
            .setCustomId("crash_stop")
            .setEmoji("🛑")
            .setStyle(discord.ButtonStyle.Danger)
        );

        const disableRow = new discord.ActionRowBuilder().addComponents(
          new discord.ButtonBuilder()
            .setCustomId("crash_stop")
            .setEmoji("🛑")
            .setStyle(discord.ButtonStyle.Danger)
            .setDisabled(true)
        );

        client
          .embed(
            {
              desc: `Crash started by ${user}・React 🛑 to stop`,
              fields: [
                {
                  name: `Multiplier`,
                  value: `1x`,
                  inline: true,
                },
                {
                  name: `Profit`,
                  value: `**0**`,
                  inline: true,
                },
              ],
              components: [row],
              type: "editreply",
            },
            interaction
          )
          .then((msg) => {
            let multiplier = 1;
            let index = 0;

            let times = result + 1;
            let timer = 2000 * times;

            setInterval(() => {
              if (index === result + 1) {
                return;
              } else if (index === result) {
                db.findOne(
                  { Guild: interaction.guild.id, User: user.id },
                  async (err, data) => {
                    if (data) {
                      data.Money -= money;
                      data.save();
                    }
                  }
                );

                return client.embed(
                  {
                    title: `Crash Results of ${user}`,
                    desc: `${msg}`,
                    type: "edit",
                    fields: [
                      {
                        name: `Loss`,
                        value: `**${money}**`,
                        inline: false,
                      },
                    ],
                  },
                  msg
                );
              } else {
                index += 1;
                multiplier += 0.2;

                let calc = money * multiplier;
                let profit = calc - money;

                client.embed(
                  {
                    desc: `Crash started by ${user}・React 🛑 to stop`,
                    type: "edit",
                    fields: [
                      {
                        name: `Multiplier`,
                        value: `${multiplier.toFixed(1)}x`,
                        inline: true,
                      },
                      {
                        name: `Profit`,
                        value: `**$${profit.toFixed(2)}**`,
                        inline: true,
                      },
                    ],
                    components: [row],
                  },
                  msg
                );
              }
            }, 2000);

            const filter = (i) => i.user.id === interaction.user.id;
            interaction.channel
              .awaitMessageComponent({ filter, max: 1, time: timer })
              .then(async (i) => {
                if (i.customId == "crash_stop") {
                  i.deferUpdate();

                  index = result + 1;
                  profit = money * multiplier;

                  db.findOne(
                    { Guild: interaction.guild.id, User: user.id },
                    async (err, data) => {
                      if (data) {
                        data.Money += parseInt(profit);
                        data.save();
                      }
                    }
                  );

                  return client.embed(
                    {
                      desc: `Crash Results of ${user}`,
                      fields: [
                        {
                          name: `Profit`,
                          value: `**$${profit.toFixed(2)}**`,
                          inline: false,
                        },
                      ],
                      components: [disableRow],
                      type: "edit",
                    },
                    msg
                  );
                }
              })
              .catch(async () => {
                index = result + 1;

                db.findOne(
                  { Guild: interaction.guild.id, User: user.id },
                  async (err, data) => {
                    if (data) {
                      data.Money -= money;
                      data.save();
                    }
                  }
                );
                return client.embed(
                  {
                    desc: `Crash Results of ${user}`,
                    type: "edit",
                    fields: [
                      {
                        name: `Loss`,
                        value: `**${money}**`,
                        inline: false,
                      },
                    ],
                    components: [disableRow],
                  },
                  msg
                );
              });
          });
      } else {
        client.errNormal(
          {
            error: `You has no ${client.emotes.economy.coins}!`,
            type: "editreply",
          },
          interaction
        );
      }
    }
  );
};
