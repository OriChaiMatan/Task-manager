import express from "express";
import { createServer } from "node:http";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);

// ניהול נתיבים
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// יצירת פורט
const PORT = process.env.PORT || 5001;

// ✅ זיהוי סביבת עבודה
const isProduction = process.env.NODE_ENV === "production";
console.log(`🌍 Environment: ${isProduction ? "Production" : "Development"}`);

// ✅ טיפול ב־CORS לפי סביבה
if (!isProduction) {
  // מצב פיתוח (localhost)
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });
} else {
  // פרודקשן — ניתן לפתוח לכולם או להגדיר דומיין ספציפי
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });
}

app.use(cookieParser());
app.use(express.json());

// ✅ בסיס הנתונים המקומי (db.json)
const dbPath = path.join(__dirname, "db.json");

function readDB() {
  if (!fs.existsSync(dbPath)) return { tasks: [] };
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// ✅ REST API
app.get("/api/tasks", (req, res) => {
  const db = readDB();
  res.json(db.tasks);
});

app.post("/api/tasks", (req, res) => {
  const db = readDB();
  const newTask = {
    id: Date.now().toString(),
    title: req.body.title || "Untitled Task",
    completed: false,
  };
  db.tasks.unshift(newTask);
  writeDB(db);
  res.json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const db = readDB();
  const idx = db.tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Task not found" });
  db.tasks[idx] = { ...db.tasks[idx], ...req.body };
  writeDB(db);
  res.json(db.tasks[idx]);
});

app.delete("/api/tasks/:id", (req, res) => {
  const db = readDB();
  db.tasks = db.tasks.filter((t) => t.id !== req.params.id);
  writeDB(db);
  res.json({ message: "Task deleted" });
});

// ✅ הגשת React Build בפרודקשן בלבד
if (isProduction) {
  const clientPath = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Development mode – React runs separately on http://localhost:5173");
  });
}

// ✅ הפעלת השרת
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
