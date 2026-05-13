const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema({

  title: String,
  category: String,
  description: String,
  location: String,
  email: String,

}, { timestamps: true });

module.exports = mongoose.model("Booth", boothSchema);