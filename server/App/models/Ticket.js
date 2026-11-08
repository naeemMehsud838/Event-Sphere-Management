const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true
    },
    user: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Open", "Pending", "Closed"],
      default: "Open"
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium"
    },
    category: {
      type: String,
      enum: ["Billing", "Technical", "Security", "General"],
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: () => {
        const now = new Date();
        return now.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
      }
    }
  },
  { timestamps: true }
);

// ✅ NO pre-save middleware - ticketId will be generated in route

module.exports = mongoose.model("Ticket", ticketSchema);