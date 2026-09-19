from pathlib import Path
import json

from ai.data_pipeline import DataPipeline
from ai.models import MLModelFactory


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "iris_model.joblib"
PIPELINE_PATH = MODEL_DIR / "data_pipeline.joblib"
METRICS_PATH = MODEL_DIR / "metrics.json"


def main() -> None:
    pipeline = DataPipeline()

    raw_data = pipeline.create_sample_dataset()
    processed_data = pipeline.preprocess_data(raw_data)

    X_train, X_test, y_train, y_test = pipeline.split_data(
        processed_data
    )

    factory = MLModelFactory()

    model = factory.create_classifier(
        "random_forest",
        n_estimators=100,
    )

    trained_model = factory.train_model(
        model,
        X_train,
        y_train,
    )

    metrics = pipeline.evaluate_model(
        trained_model,
        X_test,
        y_test,
    )

    factory.save_model(trained_model, str(MODEL_PATH))
    pipeline.save_pipeline(str(PIPELINE_PATH))

    METRICS_PATH.write_text(
        json.dumps(metrics, indent=2),
        encoding="utf-8",
    )

    print("Model training completed.")
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Pipeline saved to: {PIPELINE_PATH}")
    print(f"Metrics: {json.dumps(metrics, indent=2)}")


if __name__ == "__main__":
    main()