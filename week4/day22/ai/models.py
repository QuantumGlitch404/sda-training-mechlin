import logging
from typing import Any

import joblib

from sklearn.ensemble import (
    GradientBoostingClassifier,
    RandomForestClassifier,
)
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.svm import SVC


logger = logging.getLogger(__name__)


class MLModelFactory:
    """Creates, trains, saves, and loads machine-learning models."""

    def create_classifier(
        self,
        model_type: str,
        **kwargs: Any,
    ):
        models = {
            "random_forest": RandomForestClassifier(
                n_estimators=kwargs.get("n_estimators", 100),
                random_state=42,
            ),
            "gradient_boosting": GradientBoostingClassifier(
                random_state=42,
            ),
            "logistic_regression": LogisticRegression(
                max_iter=1000,
                random_state=42,
            ),
            "svm": SVC(
                probability=True,
                random_state=42,
            ),
            "neural_network": MLPClassifier(
                hidden_layer_sizes=(50,),
                max_iter=1000,
                random_state=42,
            ),
        }

        if model_type not in models:
            raise ValueError(
                f"Unsupported model type: {model_type}"
            )

        return models[model_type]

    def train_model(self, model, X_train, y_train):
        logger.info("Training model: %s", type(model).__name__)
        model.fit(X_train, y_train)
        logger.info("Model training completed")
        return model

    def save_model(self, model, file_path: str) -> None:
        joblib.dump(model, file_path)
        logger.info("Model saved to %s", file_path)

    def load_model(self, file_path: str):
        return joblib.load(file_path)