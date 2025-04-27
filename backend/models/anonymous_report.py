from odmantic import Model
from typing import Optional
from datetime import datetime

class IncidentReport(Model):
    user_id: Optional[str]  # Reference to User _id
    description: str
    latitude: float
    longitude: float
    timestamp: datetime = datetime.utcnow()
    anonymous: bool = False
