"""
Bayesian Knowledge Tracing (BKT) Engine for Synapse.
Implements standard two-state Hidden Markov Model psychometrics
to estimate latent concept mastery from observed practice attempts.
"""

from typing import Dict, Any, Tuple, Literal
from app.schemas.mastery import BKTParameters, BKTUpdateResponse


class BayesianKnowledgeTracingEngine:
    def __init__(self, default_params: BKTParameters = None):
        self.default_params = default_params or BKTParameters()

    def update_mastery(
        self,
        current_p_know: float,
        is_correct: bool,
        params: BKTParameters = None,
    ) -> Tuple[float, float, Literal["Novice", "Developing", "Proficient", "Mastered"]]:
        """
        Updates latent mastery probability given practice response.
        Returns:
          (prior: float, posterior: float, level: str)
        """
        p = params or self.default_params
        p_l = max(0.01, min(0.99, current_p_know))

        # 1. Conditioning step (posterior given observation)
        if is_correct:
            numerator = p_l * (1.0 - p.p_s)
            denominator = numerator + (1.0 - p_l) * p.p_g
            p_l_given_obs = numerator / denominator if denominator > 0 else p_l
        else:
            numerator = p_l * p.p_s
            denominator = numerator + (1.0 - p_l) * (1.0 - p.p_g)
            p_l_given_obs = numerator / denominator if denominator > 0 else p_l

        # 2. Learning transition step
        posterior = p_l_given_obs + (1.0 - p_l_given_obs) * p.p_t
        posterior = max(0.01, min(0.99, posterior))

        # 3. Categorical classification
        level = self.classify_mastery(posterior)
        return round(p_l, 4), round(posterior, 4), level

    @staticmethod
    def classify_mastery(p_know: float) -> Literal["Novice", "Developing", "Proficient", "Mastered"]:
        if p_know >= 0.90:
            return "Mastered"
        elif p_know >= 0.70:
            return "Proficient"
        elif p_know >= 0.40:
            return "Developing"
        return "Novice"

    @staticmethod
    def estimate_retention_decay(
        initial_p_know: float,
        days_since_last_practice: float,
        half_life_days: float = 30.0,
    ) -> float:
        """
        Estimates exponential memory decay using cognitive half-life.
        Decay slows down as mastery approaches 1.0 (crystallized knowledge).
        """
        if days_since_last_practice <= 0:
            return initial_p_know
        # Effective stability factor
        stability = half_life_days * (1.0 + initial_p_know * 2.0)
        retention = initial_p_know * (0.5 ** (days_since_last_practice / stability))
        return round(max(0.15, retention), 4)


bkt_engine = BayesianKnowledgeTracingEngine()
