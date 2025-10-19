import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // ✅ חדש

  // טעינה ראשונית
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
      } catch (err) {
        console.error("❌ Failed to fetch tasks:", err);
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

  // ✅ מסנן לפי סוג המשימות
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container" style={{ maxWidth: "600px" }}>
        <h1 className="text-center mb-4 fw-bold text-primary">Task Manager</h1>

        <TaskForm onAdd={addTask} />

        {/* ✅ כפתורי פילטר */}
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
