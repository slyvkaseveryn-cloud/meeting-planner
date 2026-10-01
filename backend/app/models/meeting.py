import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from backend.app.core.database import Base

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    organizer_email = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
