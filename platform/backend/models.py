from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Enum, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

class SessionMode(str, enum.Enum):
    story = "story"
    realtime = "realtime"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sessions = relationship("LabSession", back_populates="user")

class LabSession(Base):
    __tablename__ = "lab_sessions"

    id = Column(String(64), primary_key=True, index=True) # opaque session token
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mode = Column(Enum(SessionMode), nullable=False)
    max_unlocked_stage = Column(Integer, default=1)
    total_points = Column(Integer, default=0)
    hints_used_stage1 = Column(Integer, default=0)
    hints_used_stage2 = Column(Integer, default=0)
    hints_used_stage3 = Column(Integer, default=0)
    hints_used_stage4 = Column(Integer, default=0)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="sessions")
    completions = relationship("StageCompletion", back_populates="session")

class StageCompletion(Base):
    __tablename__ = "stage_completions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(64), ForeignKey("lab_sessions.id"), nullable=False)
    stage = Column(Integer, nullable=False)
    points_awarded = Column(Integer, nullable=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("LabSession", back_populates="completions")

class WebhookLog(Base):
    __tablename__ = "webhook_log"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(64), nullable=False)
    stage = Column(Integer, nullable=False)
    payload = Column(JSON)
    verified = Column(Boolean, default=False)
    received_at = Column(DateTime(timezone=True), server_default=func.now())
