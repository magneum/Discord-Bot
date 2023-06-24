const mango = require("mongoose");
const path = require("path");

module.exports = mango.model(
  path.basename(__filename, path.extname(__filename)),
  new mango.Schema({
    Guild: String,
    Name: String,
    Responce: String,
    Action: { type: String, default: "Normal" },
  })
);
