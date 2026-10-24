"""
SuperMemo SM-2 Spaced Repetition Scheduling Engine for Synapse.
Calculates expanding inter-repetition intervals and easiness factors (EF).
"""

from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Tuple, Optional
from pydantic import BaseModel, Field


class SM2State(BaseModel):
    repetition_number: int = Field(default=0, ge=0)
    easiness_factor: float = Field(default=2.5, ge=1.3)
    interval_days: int = Field(default=1, ge=1)
    last_reviewed_at: Optional[datetime] = None
    next_due_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SM2Scheduler:
    @staticmethod
    def calculate_review(
        repetition_number: int,
        easiness_factor: float,
        interval_days: int,
        quality_rating: int,  # 0 to 5
        review_time: Optional[datetime] = None,
    ) -> Tuple[int, float, int, datetime]:
        """
        Computes the updated SM-2 parameters after a flashcard review.
        Returns:
          (new_repetition_number, new_easiness_factor, new_interval_days, next_due_at)
        """
        now = review_time or datetime.now(timezone.utc)
        q = max(0, min(5, quality_rating))
        ef = max(1.3, easiness_factor)

        # 1. Quality rating below 3 resets repetitions
        if q < 3:
            new_n = 0
            new_i = 1
        else:
            if repetition_number == 0:
                new_i = 1
            elif repetition_number == 1:
                new_i = 6
            else:
                new_i = max(1, int(round(interval_days * ef)))
            new_n = repetition_number + 1

        # 2. Update Easiness Factor (EF)
        # EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        delta_ef = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
        new_ef = round(max(1.3, ef + delta_ef), 4)

        next_due = now + timedelta(days=new_i)
        return new_n, new_ef, new_i, next_due


sm2_scheduler = SM2Scheduler()
