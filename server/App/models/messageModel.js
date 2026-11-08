const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    recipientEmail: {
      type: String,
      default: "admin@eventsphere.com",
    },
    message: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: "General",
    },
    replyMessage: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    direction: {
      type: String,
      enum: ["incoming", "outgoing"],
      default: "outgoing",
    },
    repliedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);