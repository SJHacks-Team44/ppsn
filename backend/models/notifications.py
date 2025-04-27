import requests
import os

# Load from environment variables or set manually
FIREBASE_SERVER_KEY = os.getenv('FIREBASE_SERVER_KEY')  # Your Firebase Cloud Messaging Server Key
FIREBASE_URL = 'https://fcm.googleapis.com/fcm/send'

def send_notification(token: str, title: str, body: str, data: dict = {}):
    """Send a push notification to a device using FCM."""
    headers = {
        'Authorization': f'key={FIREBASE_SERVER_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'to': token,
        'notification': {
            'title': title,
            'body': body
        },
        'data': data  # Optional additional data
    }

    response = requests.post(FIREBASE_URL, json=payload, headers=headers)
    
    if response.status_code == 200:
        print("Notification sent successfully.")
    else:
        print(f"Failed to send notification: {response.text}")

def send_danger_alert(token: str, latitude: float, longitude: float):
    """Send an alert if user is near a danger zone."""
    title = "⚠️ Danger Nearby"
    body = f"There's a reported danger zone near your location ({latitude:.4f}, {longitude:.4f}). Stay alert!"
    send_notification(token, title, body)

def send_check_in_request(token: str):
    """Send a scheduled check-in request to the user."""
    title = "✅ Safety Check-In"
    body = "Please check in to confirm you're safe."
    send_notification(token, title, body)

def send_crime_prediction_alert(token: str, risk_level: int):
    """Send a predictive crime alert."""
    title = "🔮 Safety Prediction"
    body = f"Our system predicts a risk level {risk_level} at your current time and location. Stay cautious."
    send_notification(token, title, body)
