from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.app.core.database import Base, engine, get_db
from backend.app.models.meeting import Meeting
from backend.app.schemas.meeting import MeetingCreate, MeetingResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Meeting Planner API", docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "db_connected": True}

@app.get("/api/meetings", response_model=List[MeetingResponse])
def get_meetings(db: Session = Depends(get_db)):
    return db.query(Meeting).all()

@app.post("/api/meetings", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
def create_meeting(meeting: MeetingCreate, db: Session = Depends(get_db)):
    db_meeting = Meeting(**meeting.model_dump())
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

@app.delete("/api/meetings/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    db.delete(meeting)
    db.commit()
