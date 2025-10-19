export default function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <div className="w-full max-w-md space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id} // ✅ מזהה ייחודי לכל רכיב
          className="flex justify-between items-center bg-white p-3 rounded shadow"
        >
          <span
            onClick={() => onToggle(task.id, task.completed)}
            className={`cursor-pointer flex-1 ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </span>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
