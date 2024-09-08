const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.addEventToCalendar = async (event) => {
  // In a real application, you'd get these tokens after user authentication
  oauth2Client.setCredentials({
    access_token: 'USER_ACCESS_TOKEN',
    refresh_token: 'USER_REFRESH_TOKEN'
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const calendarEvent = {
    summary: event.title,
    start: {
      dateTime: `${event.date}T${event.time}:00`,
      timeZone: 'Asia/Jerusalem',
    },
    end: {
      dateTime: `${event.date}T${event.time}:00`,
      timeZone: 'Asia/Jerusalem',
    },
    // Add more fields as needed
  };

  try {
    const res = await calendar.events.insert({
      calendarId: 'primary',
      resource: calendarEvent,
    });
    return res.data;
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    throw error;
  }
};