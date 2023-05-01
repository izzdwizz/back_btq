const mongoose = require("mongoose");

const gridSchema = new mongoose.Schema({
  tradeKey: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Grid = mongoose.model("Grid", gridSchema);
module.exports = Grid;
