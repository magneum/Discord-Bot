const discord = require("discord.js");

module.exports = (client, error) => {
  if (error.message == undefined) {
    console.log(error);
    error.message = "Send to console!";
  }
  const errorlog = new discord.WebhookClient({
    id: client.webhooks.voiceErrorLogs.id,
    token: client.webhooks.voiceErrorLogs.token,
  });

  let embed = new discord.EmbedBuilder()
    .setTitle(`🚨・Voice error`)
    .addFields(
      { name: "Error", value: `\`\`\`${error.message}\`\`\`` },
      {
        name: `Stack error`,
        value: `\`\`\`${error.stack.substr(0, 1018)}\`\`\``,
      }
    )
    .setColor("#5865F2");
  errorlog
    .send({
      username: `Bot errors`,
      embeds: [embed],
    })
    .catch((error) => {
      console.log(error);
    });
};
