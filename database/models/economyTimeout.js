const mango = require("mongoose");
const path = require("path");

module.exports = mango.model(
  path.basename(__filename, path.extname(__filename)),
  new mango.Schema({
    Guild: String,
    User: String,
    Beg: String,
    Crime: String,
    Daily: String,
    Weekly: String,
    Monthly: String,
    Hourly: String,
    Work: String,
    Rob: String,
    Fish: String,
    Hunt: String,
    Yearly: String,
    Present: String,
  })
);
