const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const Task = require('../models/Task');
const Gallery = require('../models/Gallery');

// Expenses
router.get('/expenses', auth, async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});
router.post('/expenses', auth, async (req, res) => {
  await Expense.create(req.body);
  res.json(await Expense.find());
});

// Tasks
router.get('/tasks', auth, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});
router.post('/tasks', auth, async (req, res) => {
  await Task.create(req.body);
  res.json(await Task.find());
});

// Update task status (only assignee can update)
router.patch('/tasks/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const userName = req.user.name;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.assignee !== userName) {
    return res.status(403).json({ message: "Only the assignee can update this task's status" });
  }

  task.status = status;
  await task.save();
  res.json(task);
});

// Gallery
router.get('/gallery', auth, async (req, res) => {
  const gallery = await Gallery.find();
  res.json(gallery);
});
router.post('/gallery', auth, async (req, res) => {
  await Gallery.create(req.body);
  res.json(await Gallery.find());
});

module.exports = router;