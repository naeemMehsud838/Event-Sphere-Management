const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  speaker: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technology', 'Business', 'Marketing', 'Startup', 'Innovation'],
    default: 'Technology'
  },
  description: {
    type: String,
    default: ''
  },
  attendees: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Live', 'Upcoming', 'Popular', 'Completed'],
    default: 'Upcoming'
  },
  attendeesList: [{
    email: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  savedBy: [{
    email: String,
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', sessionSchema);