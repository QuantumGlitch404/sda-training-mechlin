# Day 22: AI/ML Fundamentals Guide

## 1. Introduction

Artificial Intelligence allows software to perform tasks that
normally require human intelligence.

Machine Learning is a part of Artificial Intelligence. It allows
systems to learn patterns from data and make predictions.

This project demonstrates a basic machine-learning workflow using
the Iris dataset and a Random Forest classifier.

---

## 2. Machine Learning Types

### Supervised Learning

The model learns from data that already contains correct answers.

Examples:

- Email spam detection
- House price prediction
- Image classification

### Unsupervised Learning

The model finds patterns in data without predefined answers.

Examples:

- Customer grouping
- Data clustering
- Pattern discovery

### Reinforcement Learning

An agent learns by interacting with an environment and receiving
rewards or penalties.

Examples:

- Game-playing systems
- Robot control
- Automated decision systems

---

## 3. Data Pipeline

A data pipeline prepares data for machine learning.

Common stages include:

1. Data collection
2. Data cleaning
3. Missing-value handling
4. Duplicate removal
5. Feature selection
6. Feature scaling
7. Data splitting
8. Model training

The Day 22 project uses a pipeline to prepare the Iris dataset.

---

## 4. Feature Scaling

Feature scaling places numerical features on a similar scale.

This can help some machine-learning algorithms work more effectively.

The project uses `StandardScaler` from scikit-learn.

---

## 5. Model Training

The project includes a model factory that can create:

- Random Forest
- Gradient Boosting
- Logistic Regression
- Support Vector Machine
- Neural Network

The training example uses Random Forest.

---

## 6. Model Evaluation

The project calculates the following metrics:

### Accuracy

The percentage of predictions that are correct.

### Precision

How many predicted positive results were correct.

### Recall

How many actual positive results were identified correctly.

### F1 Score

A combined measure based on precision and recall.

---

## 7. Model Inference

Inference means using a trained model to make predictions on new data.

The Flask service exposes the following endpoints:

| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Check service status |
| `/predict` | POST | Make one prediction |
| `/batch_predict` | POST | Make multiple predictions |

---

## 8. Web Integration

The web integration file uses the browser `fetch` API to send
requests to the Flask service.

The browser and API server must be allowed to communicate with each
other.

The Flask service uses CORS for this learning example.

---

## 9. Mobile Integration

The mobile integration file sends prediction requests from a mobile
application.

It also stores successful predictions in AsyncStorage.

If a request fails, the application can try to return a cached
prediction.

---

## 10. Offline Predictions

Offline prediction support can be implemented by:

- Saving previous results
- Checking network availability
- Returning cached results when necessary
- Synchronizing data when the network returns

Cached results should have an expiration time in production.

---

## 11. AI Ethics

Responsible AI development requires attention to:

- Data privacy
- Fairness
- Bias
- Transparency
- Explainability
- Security
- Human oversight

A model should not be used in a sensitive situation without
proper testing and review.

---

## 12. Data Quality

Poor-quality data can produce poor predictions.

Important data-quality checks include:

- Missing values
- Duplicate rows
- Incorrect labels
- Outliers
- Inconsistent formats
- Unbalanced classes

---

## 13. Model Monitoring

After deployment, a model should be monitored for:

- Prediction quality
- Response time
- Error rate
- Data drift
- Model drift
- Unexpected input values

---

## 14. Security Practices

Recommended practices include:

- Do not expose private model files unnecessarily.
- Validate all input data.
- Use HTTPS in production.
- Do not expose secrets in source code.
- Add authentication to production APIs.
- Limit request sizes.
- Log errors without exposing sensitive data.

---

## 15. Project Limitations

This is a learning project.

It does not include:

- Production authentication
- Model version management
- Advanced monitoring
- Automatic model retraining
- Production-grade offline synchronization
- A deployed cloud API
- A complete mobile user interface

---

## 16. Conclusion

Day 22 demonstrates the basic AI/ML workflow:

1. Prepare data
2. Train a model
3. Evaluate the model
4. Save the model
5. Create an API
6. Make predictions
7. Connect web and mobile applications
8. Consider security and responsible AI