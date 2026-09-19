from ai.data_pipeline import DataPipeline
from ai.models import MLModelFactory


def test_sample_dataset_has_expected_columns():
    pipeline = DataPipeline()
    data = pipeline.create_sample_dataset()

    expected_columns = {
        "sepal_length",
        "sepal_width",
        "petal_length",
        "petal_width",
        "target",
    }

    assert expected_columns.issubset(set(data.columns))
    assert len(data) > 0


def test_preprocessing_keeps_target_column():
    pipeline = DataPipeline()
    data = pipeline.create_sample_dataset()

    processed_data = pipeline.preprocess_data(data)

    assert "target" in processed_data.columns
    assert len(processed_data) > 0


def test_model_factory_creates_random_forest():
    factory = MLModelFactory()
    model = factory.create_classifier("random_forest")

    assert model.__class__.__name__ == "RandomForestClassifier"