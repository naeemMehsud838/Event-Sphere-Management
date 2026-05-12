const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema(
  {
    title: String,
    description: String,

    expoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo",
    },

    exhibitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booth", boothSchema);


// const mongoose = require("mongoose");

// const boothSchema = new mongoose.Schema({
//   expo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Expo",
//   },

//   exhibitor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },

//   boothNumber: String,

//   size: String,

//   status: {
//     type: String,
//     enum: ["available", "reserved", "occupied"],
//     default: "available",
//   },
// },
// {
//   timestamps: true
// });

// module.exports = mongoose.model("Booth", boothSchema);