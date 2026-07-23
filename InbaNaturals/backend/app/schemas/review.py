from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class ReviewCreate(BaseModel):
    rating: int
    comment: str = ""

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v: int) -> int:
        if v < 1 or v > 5:
            raise ValueError("Rating must be between 1 and 5")
        return v


class ReviewOut(BaseModel):
    id: int
    product_id: int
    user_id: int
    username: str = ""
    rating: int
    comment: str
    is_approved: bool
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ReviewApprove(BaseModel):
    is_approved: bool
