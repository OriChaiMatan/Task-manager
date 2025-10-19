export default function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul className="list-group shadow-sm">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`list-group-item d-flex justify-content-between align-items-center ${
            task.completed ? "list-group-item-secondary" : ""
          }`}
        >
          <span
            onClick={() => onToggle(task.id, task.completed)}
            className={`flex-grow-1 ${task.completed ? "text-decoration-line-through text-muted" : "fw-semibold"}`}
            style={{ cursor: "pointer" }}
          >
            {task.title}
          </span>
          <button
            onClick={() => onDelete(task.id)}
            className="btn btn-sm btn-outline-danger ms-3"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
