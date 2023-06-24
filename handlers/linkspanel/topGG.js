const discord = require("discord.js");

module.exports = async (client) => {
  client.on(discord.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId == "Bot-linkspanel") {
      if (interaction.values == "top.gg-linkspanel") {
        interaction.deferUpdate();

        const row2 = new discord.ActionRowBuilder().addComponents(
          new discord.StringSelectMenuBuilder()
            .setCustomId("Bot-linkspanel")
            .setPlaceholder("❌┆Nothing selected")
            .addOptions([
              {
                label: `Support server`,
                description: `Join the suppport server`,
                emoji: "❓",
                value: "support-linkspanel",
              },
              {
                label: `Invite Bot`,
                description: `Invite Bot to your server`,
                emoji: "📨",
                value: "invite-linkspanel",
              },
              {
                label: `Community Server`,
                description: `Join the community server!`,
                emoji: "🌍",
                value: "community-linkspanel",
              },
              {
                label: `Top.gg`,
                description: `Show the top.gg link`,
                emoji: "📃",
                value: "top.gg-linkspanel",
              },
            ])
        );

        let row = new discord.ActionRowBuilder().addComponents(
          new discord.ButtonBuilder()
            .setLabel("Vote Now")
            .setURL("https://top.gg/bot/798144456528363550/vote")
            .setStyle(discord.ButtonStyle.Link)
        );

        client.embed(
          {
            title: `📃・Bot Vote`,
            desc: `Vote for Bot on top.gg`,
            image:
              "https://cdn.discordapp.com/attachments/843487478881976381/874694192755007509/Bot_banner_vote.jpg",
            url: "https://top.gg/bot/798144456528363550/vote",
            components: [row2, row],
            type: "edit",
          },
          interaction.message
        );
      }
    }
  });
};
