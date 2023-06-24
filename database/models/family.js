const mango = require("mongoose");
const path = require("path");

module.exports = mango.model(
  path.basename(__filename, path.extname(__filename)),
  new mango.Schema({
    Guild: String,
    User: String,
    Parent: { type: Array, default: null },
    Partner: { type: String, default: null },
    Children: { type: Array, default: null },
  })
);
