const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contribution', contributionSchema);