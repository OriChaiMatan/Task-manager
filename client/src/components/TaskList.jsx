import { motion, AnimatePresence } from "framer-motion";

export default function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <div className="row gy-3">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            className="col-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`card shadow-sm border-0 ${
                task.completed ? "bg-success-subtle" : "bg-white"
              }`}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div
                  onClick={() => onToggle(task.id, task.completed)}
                  style={{ cursor: "pointer" }}
                  className={`d-flex align-items-center flex-grow-1 ${
                    task.completed
                      ? "text-muted text-decoration-line-through"
                      : "fw-semibold"
                  }`}
                >
                  <span className="me-2">
                    {task.completed ? "✅" : "🕓"}
                  </span>
                  {task.title}
                </div>

                <button
                  onClick={() => onDelete(task.id)}
                  className="btn btn-sm btn-outline-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
