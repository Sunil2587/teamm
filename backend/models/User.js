const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: String,
  description: String
}, { _id: false });

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignee: String,
  dueDate: String,
  priority: String,
  status: String
}, { _id: false });

const gallerySchema = new mongoose.Schema({
  url: String,
  caption: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'member' },
  amount: { type: Number, default: 0 },
  expenses: [expenseSchema],
  tasks: [taskSchema],
  gallery: [gallerySchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);