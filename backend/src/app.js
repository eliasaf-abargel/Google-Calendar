const express = require('express');
const multer = require('multer');
const path = require('path');
const fileController = require('./controllers/fileController');
const calendarController = require('./controllers/calendarController');

const app = express();

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
app.post('/upload', upload.single('pdfFile'), fileController.uploadFile);
app.get('/events', calendarController.getEvents);
app.post('/events/add-to-calendar', calendarController.addToCalendar);

module.exports = app;