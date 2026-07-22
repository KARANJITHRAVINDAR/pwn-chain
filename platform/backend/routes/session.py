from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import secrets

import models
from database import get_db
from routes.auth import get_current_user

router = APIRouter()

class SessionStart(BaseModel):
    mode: str

class SessionOut(BaseModel):
    session_id: str
    lab_url: str

class ProgressOut(BaseModel):
    session_id: str
    mode: str
    max_unlocked_stage: int
    total_points: int
    hints_used_stage1: int
    hints_used_stage2: int
    hints_used_stage3: int
    hints_used_stage4: int

@router.post("/start", response_model=SessionOut)
def start_session(session_data: SessionStart, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if session_data.mode not in ["story", "realtime"]:
        raise HTTPException(status_code=400, detail="Invalid mode. Must be 'story' or 'realtime'")
    
    session_id = secrets.token_hex(32)
    new_session = models.LabSession(
        id=session_id,
        user_id=current_user.id,
        mode=session_data.mode
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    # Placeholder lab URL, this would ideally be configurable or distinct per mode
    lab_url = f"http://localhost:5174/?session={session_id}"
    
    return {"session_id": session_id, "lab_url": lab_url}

@router.get("/current", response_model=ProgressOut)
def get_current_session(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    session = db.query(models.LabSession).filter(
        models.LabSession.user_id == current_user.id,
        models.LabSession.completed_at == None
    ).order_by(models.LabSession.started_at.desc()).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="No active session found")
        
    return {
        "session_id": session.id,
        "mode": session.mode.value,
        "max_unlocked_stage": session.max_unlocked_stage,
        "total_points": session.total_points,
        "hints_used_stage1": session.hints_used_stage1,
        "hints_used_stage2": session.hints_used_stage2,
        "hints_used_stage3": session.hints_used_stage3,
        "hints_used_stage4": session.hints_used_stage4,
    }

@router.get("/{session_id}/progress", response_model=ProgressOut)
def get_session_progress(session_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    session = db.query(models.LabSession).filter(
        models.LabSession.id == session_id,
        models.LabSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return {
        "session_id": session.id,
        "mode": session.mode.value,
        "max_unlocked_stage": session.max_unlocked_stage,
        "total_points": session.total_points,
        "hints_used_stage1": session.hints_used_stage1,
        "hints_used_stage2": session.hints_used_stage2,
        "hints_used_stage3": session.hints_used_stage3,
        "hints_used_stage4": session.hints_used_stage4,
    }
