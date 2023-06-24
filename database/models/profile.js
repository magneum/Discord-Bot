const mango = require("mongoose");
const path = require("path");

module.exports = mango.model(
  path.basename(__filename, path.extname(__filename)),
  new mango.Schema({
    User: String,
    Gender: { type: String, default: "" },
    Age: { type: String, default: "" },
    Orgin: { type: String, default: "" },
    Pets: Array,
    Songs: Array,
    Movies: Array,
    Actors: Array,
    Artists: Array,
    Food: Array,
    Hobbys: Array,
    Status: { type: String, default: "" },
    Aboutme: { type: String, default: "" },
    Color: { type: String, default: "" },
    Birthday: { type: String, default: "" },
  })
);
