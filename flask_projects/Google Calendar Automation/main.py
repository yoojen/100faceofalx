import os.path
import datetime as dt
from typing import Union

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/calendar",
          "https://www.googleapis.com/auth/calendar.readonly",
          "https://www.googleapis.com/auth/calendar.events.readonly"]


def check_credentials():
    """
        Create credentials to be used to authenticate with googleapi to gain access to Google Calendar API
        Returns: Credentials
    """
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)

            with open("token.json", "w") as token:
                token.write(creds.to_json())

    return creds


def get_events(creds):
    """
        Build service and fetch events that are available on personal Google Calendar
        Returns events as list
    """
    service = build("calendar", "v3", credentials=creds)

    # Call the Calendar API
    now = dt.datetime.utcnow().isoformat() + "Z"
    events_result = (
        service.events()
        .list(
            calendarId="primary",
            timeMin=now,
            maxResults=10,
            singleEvents=True,
            orderBy="startTime"
        )
        .execute()
    )
    events = events_result.get("items", [])

    return events


def main():

    try:
        creds = check_credentials()
        events = get_events(creds=creds)

        if not events:
            print("No upcoming events found")
            return

        for event in events:
            start = event["start"].get("dateTime", event["start"].get("date"))
            print(start, event["summary"])

    except HttpError as error:
        print("An error occured: ", error)
    except Exception as e:
        print("Something unexpected happened: ", e)


if __name__ == "__main__":
    main()
