const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');

// Get all contributions
router.get('/', async (req, res) => {
  const contributions = await Contribution.find();
  res.json(contributions);
});

// Add a new contribution
router.post('/', async (req, res) => {
  const { name, amount } = req.body;
  if (!name || !amount) return res.status(400).json({ error: 'Name and amount required' });
  const contribution = new Contribution({ name, amount: Number(amount) });
  await contribution.save();
  res.status(201).json(contribution);
});

module.exports = router;