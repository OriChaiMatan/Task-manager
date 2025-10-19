import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "db.json");

// עוזר לקרוא את המסד
const readDB = () => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

// עוזר לשמור למסד
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// ✅ קבלת כל המשימות
app.get("/tasks", (req, res) => {
  const db = readDB();
  res.json(db.tasks);
});

// ✅ יצירת משימה
app.post("/tasks", (req, res) => {
  const db = readDB();
  const newTask = { id: Date.now().toString(), title: req.body.title, completed: false };
  db.tasks.unshift(newTask);
  writeDB(db);
  res.json(newTask);
});

// ✅ עדכון משימה
app.put("/tasks/:id", (req, res) => {
  const db = readDB();
  const index = db.tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  db.tasks[index] = { ...db.tasks[index], ...req.body };
  writeDB(db);
  res.json(db.tasks[index]);
});

// ✅ מחיקת משימה
app.delete("/tasks/:id", (req, res) => {
  const db = readDB();
  const filtered = db.tasks.filter(t => t.id !== req.params.id);
  db.tasks = filtered;
  writeDB(db);
  res.json({ message: "Task deleted" });
});

// ✅ הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
