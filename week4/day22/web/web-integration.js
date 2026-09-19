class AIWebIntegration {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
  }

  async healthCheck() {
    const response = await fetch(`${this.apiBaseUrl}/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return response.json();
  }

  async predict(data) {
    const response = await fetch(`${this.apiBaseUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Prediction failed: ${response.status}`);
    }

    return response.json();
  }

  async batchPredict(dataArray) {
    const response = await fetch(
      `${this.apiBaseUrl}/batch_predict`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataArray),
      },
    );

    if (!response.ok) {
      throw new Error(`Batch prediction failed: ${response.status}`);
    }

    return response.json();
  }
}

const aiIntegration = new AIWebIntegration(
  "http://127.0.0.1:5000",
);

async function runExample() {
  try {
    const result = await aiIntegration.predict({
      sepal_length: 5.1,
      sepal_width: 3.5,
      petal_length: 1.4,
      petal_width: 0.2,
    });

    console.log("Prediction result:", result);
  } catch (error) {
    console.error("AI integration error:", error);
  }
}

// Run this function from a browser application.
// runExample();

if (typeof module !== "undefined") {
  module.exports = AIWebIntegration;
}