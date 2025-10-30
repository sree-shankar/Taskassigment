import React, { useState } from "react";
import Column from "./Column";

export default function Board({ board, setBoard }) {
  const [newColumnName, setNewColumnName] = useState("");

  function addColumn() {
    const name = newColumnName.trim();
    if (!name) return;
    const newCol = { id: "col-" + Date.now().toString(), name, tasks: [] };
    setBoard((b) => ({ ...b, columns: [...b.columns, newCol] }));
    setNewColumnName("");
  }

  function deleteColumn(columnId) {
    setBoard((b) => ({
      ...b,
      columns: b.columns.filter((c) => c.id !== columnId),
    }));
  }

  function updateColumn(columnId, patch) {
    setBoard((b) => ({
      ...b,
      columns: b.columns.map((c) => (c.id === columnId ? { ...c, ...patch } : c)),
    }));
  }

  function moveTask({ fromColumnId, toColumnId, taskId, position = null }) {
    if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) return;

    setBoard((b) => {
      const from = b.columns.find((c) => c.id === fromColumnId);
      const to = b.columns.find((c) => c.id === toColumnId);
      if (!from || !to) return b;

      const task = from.tasks.find((t) => t.id === taskId);
      if (!task) return b;

      const newFromTasks = from.tasks.filter((t) => t.id !== taskId);
      const newToTasks = [...to.tasks];

      if (position === null || position > newToTasks.length) newToTasks.push(task);
      else newToTasks.splice(position, 0, task);

      return {
        ...b,
        columns: b.columns.map((c) => {
          if (c.id === fromColumnId) return { ...c, tasks: newFromTasks };
          if (c.id === toColumnId) return { ...c, tasks: newToTasks };
          return c;
        }),
      };
    });
  }


  function addTaskToColumn(columnId, task) {
    const newTask = { ...task, id: "task-" + Date.now().toString() };
    updateColumn(columnId, { tasks: [...(board.columns.find(c => c.id === columnId)?.tasks || []), newTask] });
  }

  function editTaskInColumn(columnId, updatedTask) {
    const col = board.columns.find(c => c.id === columnId);
    if (!col) return;
    updateColumn(columnId, {
      tasks: col.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    });
  }

  function deleteTaskFromColumn(columnId, taskId) {
    const col = board.columns.find(c => c.id === columnId);
    if (!col) return;
    updateColumn(columnId, { tasks: col.tasks.filter(t => t.id !== taskId) });
  }

  return (
    <div className="board-wrap">
      <div className="columns-row" role="list">
        {board.columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            deleteColumn={() => deleteColumn(col.id)}
            renameColumn={(name) => updateColumn(col.id, { name })}
            addTask={(task) => addTaskToColumn(col.id, task)}
            editTask={(task) => editTaskInColumn(col.id, task)}
            deleteTask={(taskId) => deleteTaskFromColumn(col.id, taskId)}
            moveTask={moveTask}
          />
        ))}

        <div className="add-column-card">
          <input
            className="add-column-input"
            placeholder="New column name"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addColumn()}
          />
          <button className="btn" onClick={addColumn}>Add Column</button>
        </div>
      </div>
    </div>
  );
}
