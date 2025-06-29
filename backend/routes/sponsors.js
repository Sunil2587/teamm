const express = require('express');
const router = express.Router();
const Sponsor = require('../models/Sponsor');

// Get all sponsors
router.get('/', async (req, res) => {
  const sponsors = await Sponsor.find();
  res.json(sponsors);
});

// Add sponsor
router.post('/', async (req, res) => {
  const { name, message } = req.body;
  const sponsor = new Sponsor({ name, message });
  await sponsor.save();
  res.status(201).json(sponsor);
});

// Delete sponsor
router.delete('/:id', async (req, res) => {
  await Sponsor.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;