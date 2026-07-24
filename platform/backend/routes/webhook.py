from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from pydantic import BaseModel
import hmac
import hashlib
import json
import os

import models
from database import get_db

router = APIRouter()

# In a real app this would be in env vars
WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "super-secret-webhook-key-12345")

class WebhookPayload(BaseModel):
    session_id: str
    stage: int
    proof_token: str
    timestamp: float

@router.post("/stage-complete")
async def webhook_stage_complete(
    request: Request,
    payload: WebhookPayload,
    x_signature: str = Header(None),
    db: Session = Depends(get_db)
):
    if not x_signature:
        raise HTTPException(status_code=401, detail="Missing signature")
    
    # Read raw body for HMAC verification
    body = await request.body()
    
    # Calculate HMAC
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    
    # Verify signature
    if not hmac.compare_digest(expected_signature, x_signature):
        # Log failed attempt
        failed_log = models.WebhookLog(
            session_id=payload.session_id,
            stage=payload.stage,
            payload=json.loads(body.decode()),
            verified=False
        )
        db.add(failed_log)
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid signature")

    # Log successful verification
    success_log = models.WebhookLog(
        session_id=payload.session_id,
        stage=payload.stage,
        payload=json.loads(body.decode()),
        verified=True
    )
    db.add(success_log)
    
    # Fetch session
    session = db.query(models.LabSession).filter(models.LabSession.id == payload.session_id).first()
    if not session:
        db.commit()
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Check idempotency: Have we already awarded this stage for this session?
    existing_completion = db.query(models.StageCompletion).filter(
        models.StageCompletion.session_id == payload.session_id,
        models.StageCompletion.stage == payload.stage
    ).first()

    if existing_completion:
        db.commit()
        return {"status": "success", "message": "Stage already completed"}

    # Verify stage progression
    if payload.stage > session.max_unlocked_stage:
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid stage progression. Stage is locked.")
        
    # Award points and increment stage
    points_to_award = 100 # Example point value per stage
    
    new_completion = models.StageCompletion(
        session_id=payload.session_id,
        stage=payload.stage,
        points_awarded=points_to_award
    )
    db.add(new_completion)
    
    session.max_unlocked_stage += 1
    session.total_points += points_to_award
    
    if session.max_unlocked_stage > 4: # Assuming 4 stages total
        session.completed_at = func.now()
        
    db.commit()
    
    return {"status": "success", "message": f"Stage {payload.stage} completed. Points awarded: {points_to_award}"}
