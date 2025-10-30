import React, { useEffect, useState } from "react";
import Board from "./Board";
import './App.css'

const STORAGE_KEY = "kanban-board-v1";

const initialBoard = {
  columns: [
    { id: "col-1", name: "To Do", tasks: [] },
    { id: "col-2", name: "In Progress", tasks: [] },
    { id: "col-3", name: "Done", tasks: [] },
  ],
};

export default function App() {
  const [board, setBoard] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialBoard;
    } catch {
      return initialBoard;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    } catch (e) {
      console.error("Failed to save board:", e);
    }
  }, [board]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Kanban Board</h1>
        <p className="muted">Drag tasks between columns • State saved in localStorage</p>
      </header>

      <Board board={board} setBoard={setBoard} />
    </div>
  );
}
