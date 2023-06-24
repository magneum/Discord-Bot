const mango = require("mongoose");
const path = require("path");

module.exports = mango.model(
  path.basename(__filename, path.extname(__filename)),
  new mango.Schema({
    Guild: String,
    Category: String,
    Channel: String,
    ChannelName: String,
    ChannelCount: { type: Number, default: 0 },
  })
);
