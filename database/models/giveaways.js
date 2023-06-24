const mango = require("mongoose");
const path = require("path");

module.exports = mango.model(
  path.basename(__filename, path.extname(__filename)),
  new mango.Schema({
    messageId: String,
    channelId: String,
    guildId: String,
    startAt: Number,
    endAt: Number,
    ended: Boolean,
    winnerCount: Number,
    prize: String,
    messages: {
      giveaway: String,
      giveawayEnded: String,
      inviteToParticipate: String,
      drawing: String,
      dropMessage: String,
      winMessage: mango.Mixed,
      embedFooter: mango.Mixed,
      noWinner: String,
      winners: String,
      endedAt: String,
      hostedBy: String,
    },
    thumbnail: String,
    hostedBy: String,
    winnerIds: { type: [String], default: undefined },
    reaction: mango.Mixed,
    botsCanWin: Boolean,
    embedColor: mango.Mixed,
    embedColorEnd: mango.Mixed,
    exemptPermissions: { type: [], default: undefined },
    exemptMembers: String,
    bonusEntries: String,
    extraData: mango.Mixed,
    lastChance: {
      enabled: Boolean,
      content: String,
      threshold: Number,
      embedColor: mango.Mixed,
    },
    pauseOptions: {
      isPaused: Boolean,
      content: String,
      unPauseAfter: Number,
      embedColor: mango.Mixed,
      durationAfterPause: Number,
    },
    isDrop: Boolean,
    allowedMentions: {
      parse: { type: [String], default: undefined },
      users: { type: [String], default: undefined },
      roles: { type: [String], default: undefined },
    },
  })
);
