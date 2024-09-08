# Google-Calendar


The extract_pdf_data.py script must be run to turn the pdf document into a json file,

Create an api with the headers against Google Calendar, and save the settings under the credentials.json file.

Run the second script schedule-google.py, a Google browser will open, 

connect with the desired email and the token.json file will be downloaded to the computer and then everything will be automatically added to the calendar.


frontend/
│
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── FileUpload.js
│   │   ├── EventList.js
│   │   └── EventItem.js
│   │
│   ├── pages/
│   │   ├── HomePage.js
│   │   └── EventsPage.js
│   │
│   ├── styles/
│   │   └── GlobalStyles.js
│   │
│   ├── App.js
│   └── index.js
│
└── package.json



backend/
│
├── src/
│   ├── controllers/
│   │   ├── fileController.js
│   │   └── calendarController.js
│   │
│   ├── services/
│   │   ├── pdfService.js
│   │   └── googleCalendarService.js
│   │
│   ├── routes/
│   │   └── api.js
│   │
│   ├── models/
│   │   └── event.js
│   │
│   └── app.js
│
├── uploads/
├── .env
├── package.json
└── server.js


