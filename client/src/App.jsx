import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState("light"); // ✅ מצב תאורה

  // טעינת נושא צבעים
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, []);

  // טעינת משימות
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
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // ✅ החלפת נושא
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  };

  const addTask = async (title) => {
    try {
      const res = await createTask(title);
      const newList = [res.data, ...tasks];
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

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className={`min-vh-100 py-5 transition ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`}>
      <div className="container" style={{ maxWidth: "600px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Task Manager</h1>
          <button
            className={`btn btn-sm ${theme === "dark" ? "btn-light" : "btn-dark"}`}
            onClick={toggleTheme}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <TaskForm onAdd={addTask} />

        <div className="d-flex justify-content-center gap-2 mb-4">
          <button
            className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn ${filter === "pending" ? "btn-warning text-dark" : "btn-outline-warning"}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`btn ${filter === "completed" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        {loading && <p className="text-secondary text-center mt-4">טוען משימות...</p>}
        {error && <p className="text-danger text-center mt-2">{error}</p>}

        {!loading && !error && (
          <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={removeTask} />
        )}

        {filteredTasks.length === 0 && !loading && !error && (
          <p className="text-muted text-center mt-4">אין משימות להצגה</p>
        )}
      </div>
    </div>
  );
}
