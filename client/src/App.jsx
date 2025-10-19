import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/tasks`).then(res => setTasks(res.data));
  }, []);

  const addTask = async (title) => {
    const res = await axios.post(`${API_URL}/tasks`, { title });
    setTasks([res.data, ...tasks]);
  };

  const toggleTask = async (id, completed) => {
    const res = await axios.put(`${API_URL}/tasks/${id}`, { completed: !completed });
    setTasks(tasks.map(t => t._id === id ? res.data : t));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 my-4">Task Manager</h1>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  );
}
