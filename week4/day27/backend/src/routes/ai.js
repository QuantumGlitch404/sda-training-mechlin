const express = require("express");

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  res.json({
    success: true,
    response:
      `I understand your request: "${message}". ` +
      "I can help break it into clear tasks, priorities and next steps.",
    model: "capstone-ai",
    response_time: 120,
  });
});

router.post("/generate", async (req, res) => {
  const {
    content_type = "task description",
    topic = "project task",
    tone = "professional",
  } = req.body;

  res.json({
    success: true,
    content:
      `Professional ${content_type} for "${topic}". ` +
      `Tone: ${tone}. The generated content is structured, clear and actionable.`,
  });
});

router.post("/recommendations", async (req, res) => {
  res.json({
    success: true,
    recommendations: [
      {
        title: "Finish high-priority tasks",
        reason: "High-priority work should be handled first.",
        score: 0.94,
      },
      {
        title: "Review upcoming deadlines",
        reason: "Checking deadlines reduces last-minute work.",
        score: 0.87,
      },
      {
        title: "Update project documentation",
        reason: "Documentation keeps the project easy to maintain.",
        score: 0.81,
      },
    ],
  });
});

router.get("/analytics", async (req, res) => {
  res.json({
    success: true,
    analytics: {
      totalRequests: 24,
      successfulRequests: 22,
      averageResponseTime: 420,
      mostUsedFeature: "chat",
    },
  });
});

module.exports = router;