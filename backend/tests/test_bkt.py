import pytest
from app.services.learning.bkt_engine import BayesianKnowledgeTracingEngine
from app.schemas.mastery import BKTParameters


def test_bkt_correct_response_increases_mastery():
    bkt = BayesianKnowledgeTracingEngine()
    prior = 0.50
    prior_out, posterior, level = bkt.update_mastery(prior, is_correct=True)

    assert prior_out == prior
    assert posterior > prior
    assert 0.01 <= posterior <= 0.99
    assert level in ("Developing", "Proficient", "Mastered")


def test_bkt_incorrect_response_decreases_mastery():
    bkt = BayesianKnowledgeTracingEngine()
    prior = 0.70
    prior_out, posterior, level = bkt.update_mastery(prior, is_correct=False)

    assert prior_out == prior
    assert posterior < prior
    assert 0.01 <= posterior <= 0.99


def test_bkt_multiple_correct_steps_reach_mastered():
    bkt = BayesianKnowledgeTracingEngine()
    p = 0.40
    for _ in range(5):
        _, p, _ = bkt.update_mastery(p, is_correct=True)

    assert p >= 0.85
    assert bkt.classify_mastery(p) in ("Proficient", "Mastered")


def test_bkt_decay_estimation():
    bkt = BayesianKnowledgeTracingEngine()
    initial = 0.85
    # 30 days decay
    decayed_30 = bkt.estimate_retention_decay(initial, days_since_last_practice=30)
    # 90 days decay
    decayed_90 = bkt.estimate_retention_decay(initial, days_since_last_practice=90)

    assert decayed_30 < initial
    assert decayed_90 < decayed_30
    assert decayed_90 >= 0.15
