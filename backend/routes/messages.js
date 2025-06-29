const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages
router.get('/', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Add a new message
router.post('/', async (req, res) => {
  const { sender, avatar, message, timestamp } = req.body;
  const msg = new Message({ sender, avatar, message, timestamp });
  await msg.save();
  res.status(201).json(msg);
});

module.exports = router;