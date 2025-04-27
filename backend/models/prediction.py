from odmantic import Model
from typing import Optional
from datetime import datetime

class Prediction(Model):
    user_id: Optional[str]
    predicted_risk_level: int  # 1 to 5
    predicted_time: datetime
    latitude: float
    longitude: float
