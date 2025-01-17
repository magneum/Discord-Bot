const discord = require("discord.js");
const Birthdays = require("../../database/models/birthdaychannels");
const Chatbot = require("../../database/models/chatbot_channel");
const Review = require("../../database/models/reviewChannels");
const Suggestion = require("../../database/models/suggestionChannels");
const StarBoard = require("../../database/models/starboardChannels");

module.exports = async (client, interaction, args) => {
  const choice = interaction.options.getString("setup");

  if (choice == "birthdays") {
    interaction.guild.channels
      .create({
        name: "birthdays",
        type: discord.ChannelType.GuildText,
      })
      .then((ch) => {
        client.createChannelSetup(Birthdays, ch, interaction);
      });
  }

  if (choice == "chatbot") {
    interaction.guild.channels
      .create({
        name: "chatbot",
        type: discord.ChannelType.GuildText,
      })
      .then((ch) => {
        client.createChannelSetup(Chatbot, ch, interaction);
      });
  }

  if (choice == "reviews") {
    interaction.guild.channels
      .create({
        name: "reviews",
        type: discord.ChannelType.GuildText,
      })
      .then((ch) => {
        client.createChannelSetup(Review, ch, interaction);
      });
  }

  if (choice == "suggestions") {
    interaction.guild.channels
      .create({
        name: "suggestions",
        type: discord.ChannelType.GuildText,
      })
      .then((ch) => {
        client.createChannelSetup(Suggestion, ch, interaction);
      });
  }

  if (choice == "starboard") {
    interaction.guild.channels
      .create({
        name: "starboard",
        type: discord.ChannelType.GuildText,
      })
      .then((ch) => {
        client.createChannelSetup(StarBoard, ch, interaction);
      });
  }
};
