const pdfService = require('../services/pdfService');
const Event = require('../models/event');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const events = await pdfService.extractEventsFromPDF(req.file.path);

    // Save events to database
    await Event.insertMany(events);

    res.status(200).json({ message: 'File processed successfully', events });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
};