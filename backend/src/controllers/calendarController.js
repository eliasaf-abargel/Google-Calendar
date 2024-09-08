const Event = require('../models/event');
const googleCalendarService = require('../services/googleCalendarService');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

exports.addToCalendar = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const result = await googleCalendarService.addEventToCalendar(event);
    res.status(200).json({ message: 'Event added to calendar', result });
  } catch (error) {
    res.status(500).json({ message: 'Error adding event to calendar' });
  }
};