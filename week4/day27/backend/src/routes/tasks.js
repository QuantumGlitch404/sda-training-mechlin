const express = require("express");

const router = express.Router();

let tasks = [
  {
    id: 1,
    title: "Complete Day 27",
    description: "Build the capstone project.",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-09-30",
    tags: ["training", "capstone"],
  },
  {
    id: 2,
    title: "Prepare project documentation",
    description: "Complete technical documentation.",
    priority: "medium",
    status: "pending",
    dueDate: "2026-10-01",
    tags: ["documentation"],
  },
];

router.get("/", (req, res) => {
  const { status, priority, search } = req.query;

  let result = [...tasks];

  if (status) {
    result = result.filter((task) => task.status === status);
  }

  if (priority) {
    result = result.filter((task) => task.priority === priority);
  }

  if (search) {
    const value = search.toLowerCase();

    result = result.filter(
      (task) =>
        task.title.toLowerCase().includes(value) ||
        task.description.toLowerCase().includes(value)
    );
  }

  res.json({
    success: true,
    count: result.length,
    tasks: result,
  });
});

router.post("/", (req, res) => {
  const { title, description, priority, status, dueDate, tags } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Task title is required",
    });
  }

  const task = {
    id: Date.now(),
    title: title.trim(),
    description: description || "",
    priority: priority || "medium",
    status: status || "pending",
    dueDate: dueDate || null,
    tags: tags || [],
  };

  tasks.push(task);

  res.status(201).json({
    success: true,
    task,
  });
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  tasks[index] = {
    ...tasks[index],
    ...req.body,
    id,
  };

  res.json({
    success: true,
    task: tasks[index],
  });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = tasks.some((task) => task.id === id);

  if (!exists) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  tasks = tasks.filter((task) => task.id !== id);

  res.json({
    success: true,
    message: "Task deleted",
  });
});

module.exports = router;