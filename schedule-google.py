import datetime
import json
import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# If modifying these SCOPES, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_calendar_service():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    service = build('calendar', 'v3', credentials=creds)
    return service

def create_event(service, class_info):
    zoom_link = "https://us02web.zoom.us/j/6868372222"  # Zoom link
    date_str = class_info['date']
    date_obj = datetime.datetime.strptime(date_str, '%d.%m.%y')
    day_of_week = date_obj.strftime('%A')

    if day_of_week == 'Tuesday':
        start_time = '17:30:00'
        end_time = '22:15:00'
    elif day_of_week == 'Friday':
        start_time = '09:00:00'
        end_time = '13:00:00'
    else:
        # Default times if not Tuesday or Friday
        start_time = '09:00:00'
        end_time = '10:00:00'

    event = {
        'summary': class_info['course'],
        'description': 'Lecturer: ' + class_info['lecturer'] + '\nJoin Zoom Meeting: ' + zoom_link,
        'start': {
            'dateTime': date_obj.strftime('%Y-%m-%d') + 'T' + start_time,
            'timeZone': 'Asia/Jerusalem',
        },
        'end': {
            'dateTime': date_obj.strftime('%Y-%m-%d') + 'T' + end_time,
            'timeZone': 'Asia/Jerusalem',
        },
    }

    created_event = service.events().insert(calendarId='primary', body=event).execute()
    print('Event created: %s' % (created_event.get('htmlLink')))

def main():
    # Load the JSON data inside the main function
    with open('schedule.json', 'r', encoding='utf-8') as file:
        classes = json.load(file)

    service = get_calendar_service()

    for class_info in classes:
        create_event(service, class_info)

# Call the main function
if __name__ == "__main__":
    main()
