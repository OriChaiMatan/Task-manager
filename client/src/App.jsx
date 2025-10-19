import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // ✅ חדש
  const [theme, setTheme] = useState("light");

  // --- טוען נושא עיצוב
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className =
      savedTheme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, []);

  // --- טוען משימות
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
      setLoading(false);
    }

    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data);
        localStorage.setItem("tasks", JSON.stringify(res.data));
      } catch {
        setError("לא ניתן לטעון את המשימות מהשרת");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // --- החלפת מצב כהה/בהיר
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className =
      newTheme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  };

  // --- CRUD פעולות
  const addTask = async (title) => {
    try {
      const res = await createTask(title);
      const newTask = { ...res.data, createdAt: new Date().toISOString() };
      const newList = [newTask, ...tasks];
      setTasks(newList);
      localStorage.setItem("tasks", JSON.stringify(newList));
    } catch {
      setError("שגיאה בהוספת משימה");
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const res = await updateTask(id, { completed: !completed });
      const newList = tasks.map((t) => (t.id === id ? res.data : t));
      setTasks(newList);
      localStorage.setItem("tasks", JSON.stringify(newList));
    } catch {
      setError("שגיאה בעדכון המשימה");
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      const newList = tasks.filter((t) => t.id !== id);
      setTasks(newList);
      localStorage.setItem("tasks", JSON.stringify(newList));
    } catch {
      setError("שגיאה במחיקת המשימה");
    }
  };

  const editTask = async (id, newTitle) => {
    try {
      const res = await updateTask(id, { title: newTitle });
      const newList = tasks.map((t) => (t.id === id ? res.data : t));
      setTasks(newList);
      localStorage.setItem("tasks", JSON.stringify(newList));
    } catch {
      setError("שגיאה בעריכת המשימה");
    }
  };

  // --- סינון
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  // --- מיון
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      case "oldest":
        return new Date(a.id) - new Date(b.id);
      case "newest":
        return new Date(b.id) - new Date(a.id);
      case "status":
        return Number(a.completed) - Number(b.completed);
      default:
        return 0;
    }
  });

  // --- ספירה
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  // --- רינדור
  return (
    <div
      className={`min-vh-100 py-5 ${
        theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <div className="container" style={{ maxWidth: "600px" }}>
        {/* כותרת + מצב תאורה */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Task Manager</h1>
          <button
            className={`btn btn-sm ${
              theme === "dark" ? "btn-light" : "btn-dark"
            }`}
            onClick={toggleTheme}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <TaskForm onAdd={addTask} />

        {/* מסננים */}
        <div className="d-flex justify-content-center gap-2 mb-3 flex-wrap">
          <button
            className={`btn ${
              filter === "all" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn ${
              filter === "pending" ? "btn-warning text-dark" : "btn-outline-warning"
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`btn ${
              filter === "completed" ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>

          {/* 🔽 תפריט מיון */}
          <select
            className="form-select w-auto ms-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
            <option value="status">By status</option>
          </select>
        </div>

        {/* פס סטטיסטיקה */}
        <div className="text-center mb-4">
          <span className="badge bg-secondary me-2">סה״כ: {total}</span>
          <span className="badge bg-success me-2">הושלמו: {completed}</span>
          <span className="badge bg-warning text-dark">פתוחות: {pending}</span>
        </div>

        {loading && <p className="text-secondary text-center mt-4">טוען משימות...</p>}
        {error && <p className="text-danger text-center mt-2">{error}</p>}

        {!loading && !error && (
          <TaskList
            tasks={sortedTasks}
            onToggle={toggleTask}
            onDelete={removeTask}
            onEdit={editTask}
          />
        )}

        {sortedTasks.length === 0 && !loading && !error && (
          <p className="text-muted text-center mt-4">אין משימות להצגה</p>
        )}
      </div>
    </div>
  );
}
