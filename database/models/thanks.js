const mango = require("mongoose");
const path = require("path");

module.exports = mango.model(
  path.basename(__filename, path.extname(__filename)),
  new mango.Schema({
    User: String,
    UserTag: String,
    Received: Number,
  })
);
