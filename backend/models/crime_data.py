from odmantic import Model
from typing import List, Optional
from datetime import datetime

class DangerZone(Model):
    latitude: float
    longitude: float
    severity: int  # 1 to 5
    description: Optional[str] = None
    reported_at: datetime = datetime.utcnow()
