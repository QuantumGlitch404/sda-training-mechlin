# Week 4 - Day 22: AI/ML Fundamentals

## Overview

This project demonstrates the basic workflow of Artificial
Intelligence and Machine Learning.

## Features

- Data pipeline
- Data cleaning
- Feature scaling
- Dataset splitting
- Machine-learning model factory
- Random Forest model training
- Model evaluation
- Model saving and loading
- Flask prediction API
- Web AI integration
- Mobile AI integration
- Offline prediction caching
- AI/ML documentation

## Project Structure

```text
week4/day22/
├── ai/
│   ├── __init__.py
│   ├── data_pipeline.py
│   ├── models.py
│   ├── train_model.py
│   └── ai_service.py
├── data/
├── docs/
│   └── ai-ml-guide.md
├── mobile/
│   └── mobile-integration.ts
├── models/
├── screenshots/
├── tests/
│   └── test_day22.py
├── web/
│   └── web-integration.js
├── .gitignore
├── README.md
└── requirements.txt
```

## Setup

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment.

Install the dependencies:

```bash
pip install -r requirements.txt
```

## Train the Model

Run:

```bash
python -m ai.train_model
```

The following files will be created:

```text
models/iris_model.joblib
models/data_pipeline.joblib
models/metrics.json
```

## Start the AI API

Run:

```bash
python -m ai.ai_service
```

The API will run at:

```text
http://127.0.0.1:5000
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Check API status |
| `/predict` | POST | Make one prediction |
| `/batch_predict` | POST | Make multiple predictions |

## Example Prediction Request

```json
{
  "sepal_length": 5.1,
  "sepal_width": 3.5,
  "petal_length": 1.4,
  "petal_width": 0.2
}
```

## Testing

Run:

```bash
pytest
```

Compile the Python files:

```bash
python -m compileall ai tests
```

## Important Notes

This is a learning project.

The web and mobile integration files require the Flask API to be
running.

Production applications should use:

- HTTPS
- Authentication
- Secure model storage
- Input validation
- Model monitoring
- Proper logging
- Data privacy controls

## Learning Outcomes

After completing Day 22, the learner understands:

- Machine-learning data pipelines
- Model training
- Model evaluation
- Model inference
- API-based AI integration
- Web and mobile AI integration
- Offline prediction caching
- Responsible AI practices