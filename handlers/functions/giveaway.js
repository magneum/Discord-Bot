const { GiveawaysManager } = require("discord-giveaways");
const discord = require("discord.js");
const fs = require("fs");

const giveawayModel = require("../../database/models/giveaways");

module.exports = (client) => {
  const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    async getAllGiveaways() {
      return await giveawayModel.find().lean().exec();
    }

    async saveGiveaway(messageId, giveawayData) {
      await giveawayModel.create(giveawayData);
      return true;
    }

    async editGiveaway(messageId, giveawayData) {
      await giveawayModel
        .updateOne({ messageId }, giveawayData, { omitUndefined: true })
        .exec();
      return true;
    }

    async deleteGiveaway(messageId) {
      await giveawayModel.deleteOne({ messageId }).exec();
      return true;
    }

    async refreshStorage() {
      return client.shard.broadcastEval(() =>
        this.giveawaysManager.getAllGiveaways()
      );
    }
  };

  const manager = new GiveawayManagerWithOwnDatabase(
    client,
    {
      default: {
        botsCanWin: false,
        embedColor: client."#5865F2",
        embedColorEnd: client."#ED4245",
        reaction: "🥳",
      },
    },
    true
  );

  client.giveawaysManager = manager;

  const events = fs
    .readdirSync(`./events/giveaway`)
    .filter((files) => files.endsWith(".js"));

  for (const file of events) {
    const event = require(`../../events/giveaway/${file}`);
    manager.on(file.split(".")[0], event.bind(null, client)).setMaxListeners(0);
  }
};
