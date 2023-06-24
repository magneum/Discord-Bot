const mango = require("mongoose");
const path = require("path");

module.exports = mango.model(
  path.basename(__filename, path.extname(__filename)),
  new mango.Schema({
    Guild: String,
    Channel: String,
    Word: { type: String, default: "start" },
  })
);
