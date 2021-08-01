const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema({
  venues: [{ name: String }],
  participants: [{ userId: String, vote: String, name: String }],
});

module.exports = mongoose.model("Board", BoardSchema, "board");
