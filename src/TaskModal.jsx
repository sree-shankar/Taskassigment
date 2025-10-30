import React, { useEffect, useState } from "react";


export default function TaskModal({ onClose, onSave, task = { title: "", description: "" } }) {
  const [data, setData] = useState({ ...task });

  useEffect(() => {
    setData({ ...task });
  }, [task]);

  function save() {
    const trimmed = { ...data, title: data.title.trim(), description: data.description.trim() };
    if (!trimmed.title) return alert("Title is required");
    onSave(trimmed);
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h3>{task.id ? "Edit Task" : "Add Task"}</h3>

        <label className="field">
          <div className="label">Title</div>
          <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </label>

        <label className="field">
          <div className="label">Description</div>
          <textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
        </label>

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
