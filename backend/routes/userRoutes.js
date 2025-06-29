const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get profile of logged-in user
router.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

// Get all team members (all registered users, no passwords)
router.get('/team', auth, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team", error: error.message });
  }
});

// Save a new expense
router.post('/expenses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.expenses.push(req.body);
    await user.save();
    res.json(user.expenses);
  } catch (error) {
    res.status(500).json({ message: "Error saving expense", error: error.message });
  }
});

// Get all expenses for the logged-in user
router.get('/expenses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error: error.message });
  }
});

// Save a new task
router.post('/tasks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.tasks.push(req.body);
    await user.save();
    res.json(user.tasks);
  } catch (error) {
    res.status(500).json({ message: "Error saving task", error: error.message });
  }
});

// Get all tasks for the logged-in user
router.get('/tasks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

// Add image to gallery
router.post('/gallery', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.gallery.push(req.body);
    await user.save();
    res.json(user.gallery);
  } catch (error) {
    res.status(500).json({ message: "Error saving gallery image", error: error.message });
  }
});

// Get gallery images for the logged-in user
router.get('/gallery', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.gallery || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery", error: error.message });
  }
});

module.exports = router;