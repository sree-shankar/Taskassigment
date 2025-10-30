import React, { useState } from "react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";


export default function Column({
  column,
  deleteColumn,
  renameColumn,
  addTask,
  editTask,
  deleteTask,
  moveTask,
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(column.name);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [dragOver, setDragOver] = useState(false);


  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    try {
      const payload = JSON.parse(e.dataTransfer.getData("application/json"));
      // payload: { fromColumnId, taskId }
      if (payload && payload.fromColumnId && payload.taskId) {
        moveTask({ fromColumnId: payload.fromColumnId, toColumnId: column.id, taskId: payload.taskId });
      }
    } catch (err) {
  
    }
  }

  function saveName() {
    const n = nameDraft.trim();
    if (n) renameColumn(n);
    setIsEditingName(false);
  }

  return (
    <div
      className={`column ${dragOver ? "column-dragover" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="listitem"
    >
      <div className="column-header">
        {isEditingName ? (
          <div className="rename-inline">
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
            />
            <button className="btn small" onClick={saveName}>Save</button>
            <button className="btn small ghost" onClick={() => { setIsEditingName(false); setNameDraft(column.name); }}>Cancel</button>
          </div>
        ) : (
          <>
            <h3>{column.name}</h3>
            <div className="col-actions">
              <button className="btn small" onClick={() => setIsEditingName(true)}>Rename</button>
              <button className="btn small danger" onClick={() => deleteColumn(column.id)}>Delete</button>
            </div>
          </>
        )}
      </div>

      <div className="tasks-list">
        {column.tasks.map((task, idx) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            index={idx}
            onEdit={() => setEditingTask(task)}
            onDelete={() => deleteTask(task.id)}
            moveTask={moveTask}
          />
        ))}
        {column.tasks.length === 0 && <div className="empty-note">No tasks — add one!</div>}
      </div>

      <div className="column-footer">
        <button className="btn" onClick={() => setShowAddModal(true)}>+ Add Task</button>
      </div>

      {showAddModal && (
        <TaskModal
          onClose={() => setShowAddModal(false)}
          onSave={(task) => { addTask(task); setShowAddModal(false); }}
        />
      )}

      {editingTask && (
        <TaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(task) => { editTask(task); setEditingTask(null); }}
        />
      )}
    </div>
  );
}
