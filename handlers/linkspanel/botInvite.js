const discord = require("discord.js");

module.exports = async (client) => {
  client.on(discord.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId == "Bot-linkspanel") {
      if (interaction.values == "invite-linkspanel") {
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
            .setLabel("Bot Invite")
            .setURL(client.config.discord.botInvite)
            .setStyle(discord.ButtonStyle.Link)
        );

        client.embed(
          {
            title: `📨・Bot Invite`,
            desc: `Make your server even better with Bot!`,
            image:
              "https://cdn.discordapp.com/attachments/843487478881976381/874694194474668052/Bot_banner_invite.jpg",
            url: client.config.discord.serverInvite,
            components: [row2, row],
            type: "edit",
          },
          interaction.message
        );
      }
    }
  });
};
