from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

from flask import Flask, jsonify, request
from flask_cors import CORS


FEATURE_COLUMNS = [
    "sepal_length",
    "sepal_width",
    "petal_length",
    "petal_width",
]


class AIService:
    def __init__(
        self,
        model_path: str,
        pipeline_path: str,
    ) -> None:
        self.app = Flask(__name__)
        CORS(self.app)

        self.model = joblib.load(model_path)
        pipeline_data = joblib.load(pipeline_path)
        self.scaler = pipeline_data["scaler"]

        self.setup_routes()

    def preprocess_input(self, data: dict[str, Any]) -> np.ndarray:
        values = [[data[column] for column in FEATURE_COLUMNS]]

        frame = pd.DataFrame(
            values,
            columns=FEATURE_COLUMNS,
        )

        return self.scaler.transform(frame)

    def predict_one(self, data: dict[str, Any]) -> dict[str, Any]:
        processed_data = self.preprocess_input(data)
        prediction = self.model.predict(processed_data)[0]

        result: dict[str, Any] = {
            "success": True,
            "prediction": int(prediction),
        }

        if hasattr(self.model, "predict_proba"):
            probabilities = self.model.predict_proba(processed_data)
            result["confidence"] = float(np.max(probabilities))
        else:
            result["confidence"] = None

        return result

    def setup_routes(self) -> None:
        @self.app.get("/health")
        def health():
            return jsonify(
                {
                    "status": "healthy",
                    "model_loaded": self.model is not None,
                }
            )

        @self.app.post("/predict")
        def predict():
            try:
                data = request.get_json()

                if not isinstance(data, dict):
                    return jsonify(
                        {
                            "success": False,
                            "error": "Expected a JSON object",
                        }
                    ), 400

                result = self.predict_one(data)
                return jsonify(result)

            except Exception as error:
                return jsonify(
                    {
                        "success": False,
                        "error": str(error),
                    }
                ), 400

        @self.app.post("/batch_predict")
        def batch_predict():
            try:
                data = request.get_json()

                if not isinstance(data, list):
                    return jsonify(
                        {
                            "success": False,
                            "error": "Expected a JSON array",
                        }
                    ), 400

                predictions = [
                    self.predict_one(item)
                    for item in data
                ]

                return jsonify(
                    {
                        "success": True,
                        "predictions": predictions,
                    }
                )

            except Exception as error:
                return jsonify(
                    {
                        "success": False,
                        "error": str(error),
                    }
                ), 400


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "iris_model.joblib"
PIPELINE_PATH = BASE_DIR / "models" / "data_pipeline.joblib"

service = AIService(
    str(MODEL_PATH),
    str(PIPELINE_PATH),
)

app = service.app


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
    )