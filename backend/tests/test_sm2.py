import pytest
from app.services.learning.sm2_scheduler import SM2Scheduler


def test_sm2_first_successful_review():
    scheduler = SM2Scheduler()
    # Grade 4 on new card (n=0, EF=2.5, I=1)
    new_n, new_ef, new_i, next_due = scheduler.calculate_review(
        repetition_number=0,
        easiness_factor=2.5,
        interval_days=1,
        quality_rating=4,
    )

    assert new_n == 1
    assert new_i == 1
    assert new_ef >= 2.4


def test_sm2_second_successful_review():
    scheduler = SM2Scheduler()
    # Grade 5 on second review (n=1, EF=2.5, I=1)
    new_n, new_ef, new_i, next_due = scheduler.calculate_review(
        repetition_number=1,
        easiness_factor=2.5,
        interval_days=1,
        quality_rating=5,
    )

    assert new_n == 2
    assert new_i == 6
    assert new_ef > 2.5


def test_sm2_failed_review_resets():
    scheduler = SM2Scheduler()
    # Grade 2 (failed) on card with n=3, I=15
    new_n, new_ef, new_i, next_due = scheduler.calculate_review(
        repetition_number=3,
        easiness_factor=2.4,
        interval_days=15,
        quality_rating=2,
    )

    assert new_n == 0
    assert new_i == 1
    # EF must decrease but stay >= 1.3
    assert new_ef < 2.4
    assert new_ef >= 1.3


def test_sm2_lower_bound_clamp():
    scheduler = SM2Scheduler()
    # Repeated 0 quality ratings
    ef = 1.35
    for _ in range(5):
        _, ef, _, _ = scheduler.calculate_review(
            repetition_number=0,
            easiness_factor=ef,
            interval_days=1,
            quality_rating=0,
        )

    assert ef == 1.3
