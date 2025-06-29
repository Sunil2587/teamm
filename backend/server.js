const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sharedRoutes = require('./routes/sharedRoutes');
const contributionsRouter = require('./routes/contributions');
const messagesRouter = require('./routes/messages');
const eventsRouter = require('./routes/EventRoutes');


// Correct import for sponsors route (should match filename: sponsor**s**.js)
const sponsorsRouter = require('./routes/sponsors');
const galleryRouter = require('./routes/gallery');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/sponsors', sponsorsRouter);

app.use('/api/messages', messagesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/contributions', contributionsRouter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shared', sharedRoutes);

app.use('/api/gallery', galleryRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));