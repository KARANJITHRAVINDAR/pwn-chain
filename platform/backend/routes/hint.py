from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

import models
from database import get_db
from routes.auth import get_current_user

router = APIRouter()

# Mock hints data, in a real scenario this might be in a DB table
HINTS = {
    1: [
        "Check the page source carefully for hidden endpoints.",
        "The /api/v1/health endpoint might return more than just status.",
        "Look for old versions of the API still being exposed."
    ],
    2: [
        "The authentication token seems to be easily guessable.",
        "Have you tried decoding the JWT payload?",
        "Try forging a token with the role 'admin'."
    ],
    3: [
        "The search parameter seems vulnerable to injection.",
        "Try entering a single quote to see if it breaks the query.",
        "Use a UNION SELECT to extract data from other tables."
    ],
    4: [
        "The file upload mechanism might not validate file types properly.",
        "Can you upload a file with a .php extension?",
        "Try executing the uploaded file by navigating to its path."
    ]
}

class HintRequest(BaseModel):
    session_id: str
    stage: int

class HintResponse(BaseModel):
    hint_text: str
    hints_remaining: int

@router.post("/", response_model=HintResponse)
def get_hint(request: HintRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    session = db.query(models.LabSession).filter(
        models.LabSession.id == request.session_id,
        models.LabSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if request.stage != session.max_unlocked_stage:
        raise HTTPException(status_code=400, detail="Can only request hints for the current active stage.")
        
    hints_used_attr = f"hints_used_stage{request.stage}"
    hints_used = getattr(session, hints_used_attr)
    
    if hints_used >= 3:
        raise HTTPException(status_code=400, detail="No more hints for this stage")
        
    # Deduct points
    session.total_points -= 10
    
    # Increment hints used
    setattr(session, hints_used_attr, hints_used + 1)
    db.commit()
    
    # Fetch hint
    hint_text = HINTS.get(request.stage, [])[hints_used]
    hints_remaining = 3 - (hints_used + 1)
    
    return {"hint_text": hint_text, "hints_remaining": hints_remaining}
