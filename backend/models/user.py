from odmantic import Model
from typing import Optional
from datetime import datetime

class User(Model):
    username: str
    email: str
    password: str
    avoid_danger_zones: bool = True
    receive_notifications: bool = True
    last_check_in: Optional[datetime] = None
