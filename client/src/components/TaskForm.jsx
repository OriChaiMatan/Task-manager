import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="input-group mb-4 shadow-sm">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter new task..."
        className="form-control"
      />
      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
}
