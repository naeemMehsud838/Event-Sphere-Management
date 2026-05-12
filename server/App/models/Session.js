const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  expo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expo",
  },

  title: String,

  speaker: String,

  topic: String,

  location: String,

  startTime: Date,

  endTime: Date,
},
{
  timestamps: true
});

module.exports = mongoose.model("Session", sessionSchema);