from pathlib import Path
import logging
from typing import Tuple

import joblib
import numpy as np
import pandas as pd

from sklearn.datasets import load_iris
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DataPipeline:
    """Loads, prepares, splits, and evaluates machine-learning data."""

    def __init__(self) -> None:
        self.scaler = StandardScaler()

    def create_sample_dataset(self) -> pd.DataFrame:
        """Create a small dataset using scikit-learn's Iris dataset."""
        iris = load_iris()

        data = pd.DataFrame(
            iris.data,
            columns=[
                "sepal_length",
                "sepal_width",
                "petal_length",
                "petal_width",
            ],
        )

        data["target"] = iris.target

        logger.info("Created dataset with shape: %s", data.shape)
        return data

    def load_data(self, file_path: str) -> pd.DataFrame:
        """Load CSV, JSON, or Parquet data."""
        path = Path(file_path)

        if path.suffix == ".csv":
            return pd.read_csv(path)

        if path.suffix == ".json":
            return pd.read_json(path)

        if path.suffix == ".parquet":
            return pd.read_parquet(path)

        raise ValueError(f"Unsupported file format: {path.suffix}")

    def preprocess_data(
        self,
        data: pd.DataFrame,
        target_column: str = "target",
    ) -> pd.DataFrame:
        """Clean data and scale numerical feature columns."""
        cleaned_data = data.dropna().drop_duplicates().copy()

        feature_columns = [
            column
            for column in cleaned_data.columns
            if column != target_column
        ]

        cleaned_data[feature_columns] = self.scaler.fit_transform(
            cleaned_data[feature_columns]
        )

        logger.info(
            "Preprocessed dataset with shape: %s",
            cleaned_data.shape,
        )

        return cleaned_data

    def split_data(
        self,
        data: pd.DataFrame,
        target_column: str = "target",
    ) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
        """Split data into training and testing sets."""
        X = data.drop(columns=[target_column])
        y = data[target_column]

        return train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42,
            stratify=y,
        )

    def evaluate_model(self, model, X_test, y_test) -> dict:
        """Calculate classification metrics."""
        predictions = model.predict(X_test)

        return {
            "accuracy": accuracy_score(y_test, predictions),
            "precision": precision_score(
                y_test,
                predictions,
                average="weighted",
                zero_division=0,
            ),
            "recall": recall_score(
                y_test,
                predictions,
                average="weighted",
                zero_division=0,
            ),
            "f1_score": f1_score(
                y_test,
                predictions,
                average="weighted",
                zero_division=0,
            ),
        }

    def save_pipeline(self, file_path: str) -> None:
        """Save the fitted scaler."""
        joblib.dump({"scaler": self.scaler}, file_path)

    def load_pipeline(self, file_path: str) -> None:
        """Load a saved scaler."""
        pipeline_data = joblib.load(file_path)
        self.scaler = pipeline_data["scaler"]