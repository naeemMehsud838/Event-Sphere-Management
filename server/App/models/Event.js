const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Event title is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ['Technology', 'Fashion', 'Food', 'Art', 'Business', 'Science', 'Others'],
    default: 'Others'
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true
  },
  ticketPrice: {
    type: Number,
    required: [true, "Ticket price is required"],
    min: [0, "Price cannot be negative"],
    default: 0
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"]
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  coverImage: {
    type: String,
    default: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  totalSeats: {
    type: Number,
    default: 100
  },
  availableSeats: {
    type: Number,
    default: 100
  },
  registeredAttendees: {
    type: Number,
    default: 0
  },
  maxAttendees: {
    type: Number,
    default: 500
  },
   
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
eventSchema.index({ startDate: -1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model("Event", eventSchema);