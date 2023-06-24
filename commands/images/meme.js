const fetch = require("node-fetch");
const discord = require("discord.js");
module.exports = async (client, interaction, args) => {
  fetch(`https://www.reddit.com/r/memes` + `.json?sort=top&t=week&limit=100`)
    .then((res) => res.json())
    .then(async (json) => {
      let i = Math.floor(Math.random() * json.data.children.length);
      let image = json.data.children[i].data.url;
      let caption = json.data.children[i].data.title;
      let embed = new discord.EmbedBuilder()
        .setTitle(caption)
        .setImage(image)
        .setColor(client."#5865F2")
        .setFooter({
          text: `👍 ${json.data.children[i].data.ups} | 💬 ${json.data.children[i].data.num_comments}`,
        });
      interaction.editReply({ embeds: [embed] });
    })
    .catch({});
};
