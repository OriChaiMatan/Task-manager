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
    <form onSubmit={handleSubmit} className="flex w-full max-w-md mb-4">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter new task..."
        className="flex-1 p-2 border border-gray-300 rounded-l"
      />
      <button className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700">Add</button>
    </form>
  );
}
