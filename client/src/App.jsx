import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ שלב ראשון – טעינת משימות מהשרת
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

  // ✅ הוספת משימה
  const addTask = async (title) => {
    try {
      const res = await createTask(title);
      setTasks([res.data, ...tasks]);
    } catch (err) {
      console.error("❌ Failed to create task:", err);
      setError("שגיאה בהוספת משימה");
    }
  };

  // ✅ שינוי סטטוס משימה (בוצע/לא בוצע)
  const toggleTask = async (id, completed) => {
    try {
      const res = await updateTask(id, { completed: !completed });
      setTasks(tasks.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error("❌ Failed to update task:", err);
      setError("שגיאה בעדכון המשימה");
    }
  };

  // ✅ מחיקת משימה
  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error("❌ Failed to delete task:", err);
      setError("שגיאה במחיקת המשימה");
    }
  };

  // ✅ תוכן המסך
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-4">
        Task Manager
      </h1>

      <div className="w-full max-w-md">
        <TaskForm onAdd={addTask} />
      </div>

      {loading && <p className="text-gray-600 mt-4">טוען משימות...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {!loading && !error && (
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={removeTask}
        />
      )}

      {tasks.length === 0 && !loading && !error && (
        <p className="text-gray-500 mt-6">אין משימות כרגע</p>
      )}
    </div>
  );
}
