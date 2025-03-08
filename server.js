const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const FILE_PATH = "tasks.json";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Read tasks from file
const readTasks = () => {
  if (!fs.existsSync(FILE_PATH)) return [];
  return JSON.parse(fs.readFileSync(FILE_PATH));
};

// Write tasks to file
const writeTasks = (tasks) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
};

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(readTasks());
});

// Add a new task
app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = { id: Date.now(), text: req.body.text, completed: false };
  tasks.push(newTask);
  writeTasks(tasks);
  res.json(newTask);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter(task => task.id !== parseInt(req.params.id));
  writeTasks(tasks);
  res.json({ success: true });
});

// Mark task as completed
app.put("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  tasks = tasks.map(task => task.id === parseInt(req.params.id) ? { ...task, completed: req.body.completed } : task);
  writeTasks(tasks);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
