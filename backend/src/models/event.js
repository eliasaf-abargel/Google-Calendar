const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  meetingWith: String,
  zoomLink: String
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);