import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch tasks:", err);
        setError("לא ניתן לטעון את המשימות מהשרת");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (title) => {
    try {
      const res = await createTask(title);
      setTasks([res.data, ...tasks]);
    } catch {
      setError("שגיאה בהוספת משימה");
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const res = await updateTask(id, { completed: !completed });
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
    } catch {
      setError("שגיאה בעדכון המשימה");
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch {
      setError("שגיאה במחיקת המשימה");
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container" style={{ maxWidth: "600px" }}>
        <h1 className="text-center mb-4 fw-bold text-primary">Task Manager</h1>

        <TaskForm onAdd={addTask} />

        {loading && <p className="text-secondary text-center mt-4">טוען משימות...</p>}
        {error && <p className="text-danger text-center mt-2">{error}</p>}

        {!loading && !error && (
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={removeTask} />
        )}

        {tasks.length === 0 && !loading && !error && (
          <p className="text-muted text-center mt-4">אין משימות כרגע</p>
        )}
      </div>
    </div>
  );
}
