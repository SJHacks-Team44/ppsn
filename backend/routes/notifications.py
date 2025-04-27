# notification.py

import requests

def send_notification(crime_data):
    """
    Sends a notification to all users when a new crime is reported.

    Args:
        crime_data (dict): A dictionary containing crime information.
    """

    try:
        # For now, let's just print the notification
        # Later, you can hook it to real push notification systems
        message = f"""
        🚨 NEW CRIME REPORTED! 🚨
        Type: {crime_data.get('type')}
        Description: {crime_data.get('description')}
        Location: {crime_data.get('address')}
        Severity: {crime_data.get('severity')}
        Date: {crime_data.get('date')}
        """

        print(message)

        # TODO: (future) Send this message to email, SMS, push notification, or app alert
        # Example: integrate Firebase Cloud Messaging, Twilio SMS, or Email API
        
        return True

    except Exception as e:
        print(f"❌ Error sending notification: {e}")
        return False
