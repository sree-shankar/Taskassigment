import React from "react";

export default function TaskCard({ task, columnId, index, onEdit, onDelete }) {
  function handleDragStart(e) {
    e.dataTransfer.setData("application/json", JSON.stringify({ fromColumnId: columnId, taskId: task.id }));

    e.dataTransfer.effectAllowed = "move";

    const crt = document.createElement("div");
    crt.className = "drag-preview";
    crt.textContent = task.title || "Task";
    document.body.appendChild(crt);
    e.dataTransfer.setDragImage(crt, 10, 10);
    setTimeout(() => document.body.removeChild(crt), 0);
  }

  function handleDragEnd() {
  
  }

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-title">{task.title}</div>
      {task.description && <div className="task-desc">{task.description}</div>}
      <div className="task-actions">
        <button className="btn tiny" onClick={onEdit}>Edit</button>
        <button className="btn tiny ghost" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
