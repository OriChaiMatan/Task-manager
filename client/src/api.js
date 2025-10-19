import axios from "axios";

// נקודת בסיס ל־API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// יצירת אינסטנס של axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// פונקציות נוחות לעבודה עם tasks
export const getTasks = () => api.get("/tasks");
export const createTask = (title) => api.post("/tasks", { title });
export const updateTask = (id, updates) => api.put(`/tasks/${id}`, updates);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
