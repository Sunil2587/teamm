const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Add event
router.post('/', async (req, res) => {
  const { name, description, date } = req.body;
  const event = new Event({ name, description, date });
  await event.save();
  res.status(201).json(event);
});

// Delete event (optional)
router.delete('/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;