const mango = require("mongoose");
const path = require("path");

module.exports = mango.model(
  path.basename(__filename, path.extname(__filename)),
  new mango.Schema({
    userID: { type: String },
    guildID: { type: String },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: new Date() },
  })
);
