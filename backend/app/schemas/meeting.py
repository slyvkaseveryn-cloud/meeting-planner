from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    organizer_email: EmailStr

class MeetingCreate(MeetingBase):
    pass

class MeetingResponse(MeetingBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
