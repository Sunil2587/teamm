const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Gallery = require('../models/Gallery');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve static files from uploads
router.use('/uploads', express.static('uploads'));

// Upload image
router.post('/upload', upload.single('image'), async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/api/gallery/uploads/${req.file.filename}`;
  const caption = req.body.caption || req.file.originalname;
  const galleryItem = new Gallery({ url, caption });
  await galleryItem.save();
  res.json({ url, caption });
});

// Get all images
router.get('/', async (req, res) => {
  const images = await Gallery.find();
  res.json(images);
});

module.exports = router;