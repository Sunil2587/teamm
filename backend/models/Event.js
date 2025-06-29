const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  date: String // or Date if you want to use JS Date objects
});

module.exports = mongoose.model('Event', eventSchema);