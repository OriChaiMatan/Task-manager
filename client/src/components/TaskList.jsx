import { useState } from "react";

export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const handleSave = (id) => {
    if (!editValue.trim()) return;
    onEdit(id, editValue);
    setEditingId(null);
  };

  return (
    <div className="w-100">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`d-flex align-items-center justify-content-between mb-2 p-3 rounded shadow-sm ${
            task.completed ? "bg-success-subtle" : "bg-white"
          }`}
        >
          {/* כפתור סטטוס */}
          <button
            className={"btn btn-sm me-2 btn-outline-primary"}
            onClick={() => onToggle(task.id, task.completed)}
            title={task.completed ? "סמן כלא בוצע" : "סמן כבוצע"}
          >
            {task.completed ? "✅" : "⭕"}
          </button>

          {/* תוכן המשימה */}
          <div className="flex-grow-1">
            {editingId === task.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave(task.id)}
                onKeyDown={(e) => e.key === "Enter" && handleSave(task.id)}
                autoFocus
                className="form-control"
              />
            ) : (
              <span
                className={`cursor-pointer ${
                  task.completed ? "text-decoration-line-through text-muted" : ""
                }`}
              >
                {task.title}
              </span>
            )}
          </div>

          {/* אייקון עריכה */}
          {editingId !== task.id && (
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => handleEdit(task)}
              title="ערוך משימה"
            >
              ✏️
            </button>
          )}

          {/* כפתור מחיקה */}
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(task.id)}
            title="מחק משימה"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}
