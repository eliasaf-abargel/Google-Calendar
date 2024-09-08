const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const calendarController = require('../controllers/calendarController');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes
router.post('/upload', upload.single('pdfFile'), fileController.uploadFile);
router.get('/events', calendarController.getEvents);
router.post('/events/add-to-calendar', calendarController.addToCalendar);

module.exports = router;