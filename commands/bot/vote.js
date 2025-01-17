const discord = require("discord.js");
const Topgg = require(`@top-gg/sdk`);
require("moment-duration-format");

module.exports = async (client, interaction, args) => {
  let dbl = new Topgg.Api(process.env.TOPGG_TOKEN);

  let row = new discord.ActionRowBuilder().addComponents(
    new discord.ButtonBuilder()
      .setLabel("Vote for me")
      .setURL("https://top.gg/bot/798144456528363550/vote")
      .setStyle(discord.ButtonStyle.Link)
  );

  dbl
    .hasVoted(interaction.user.id)
    .then((voted) => {
      if (voted) {
        client.embed(
          {
            title: `📨・Vote`,
            desc: `You have voted!`,
            image: `https://cdn.discordapp.com/attachments/843487478881976381/874694192755007509/Bot_banner_vote.jpg`,
            color: "#57F287",
            components: [row],
            type: "editreply",
          },
          interaction
        );
      }
      if (!voted) {
        client.embed(
          {
            title: `📨・Vote`,
            desc: `You have not voted!`,
            image: `https://cdn.discordapp.com/attachments/843487478881976381/874694192755007509/Bot_banner_vote.jpg`,
            color: "#ED4245",
            components: [row],
            type: "editreply",
          },
          interaction
        );
      }
    })
    .catch((error) => {
      client.errNormal(
        { text: `There was an error by checking this vote!`, editreply: true },
        interaction
      );
    });
};
