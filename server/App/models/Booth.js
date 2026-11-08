// const mongoose = require("mongoose");

// const boothSchema = new mongoose.Schema({

//   title: String,
//   category: String,
//   description: String,
//   location: String,
//   email: String,

// }, { timestamps: true });

// module.exports = mongoose.model("Booth", boothSchema);







const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Booth name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Technology", "Design", "Business", "Healthcare", "Environment"],
      default: "Technology",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Contact email is required"],
      lowercase: true,
      trim: true,
    },
    exhibitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booth", boothSchema);