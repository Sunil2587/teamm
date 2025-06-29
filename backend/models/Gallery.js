const mongoose = require('mongoose');
const gallerySchema = new mongoose.Schema({
  url: String,
  caption: String
});
module.exports = mongoose.model('Gallery', gallerySchema);