const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String,
  avatar: String,
  message: String,
  timestamp: String
});

module.exports = mongoose.model('Message', messageSchema);