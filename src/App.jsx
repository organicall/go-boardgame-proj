import React, { useState } from "react";
import "./App.css";

export default function App() {
  const size = 9; // number of intersections per side
  const spacing = 48; // px distance between adjacent lines/intersections
  const padding = 24; // outer padding so outer intersections aren't flush with edge

  // create empty board (size x size) of nulls
  const makeEmptyBoard = (n) => {
    const b = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) row.push(null);
      b.push(row);
    }
    return b;
  };

  const [board, setBoard] = useState(() => makeEmptyBoard(size));
  const [currentPlayer, setCurrentPlayer] = useState("black");

  function handleClick(r, c) {
    // guard: can't place on already occupied intersection
    if (board[r][c] !== null) return;

    // deep copy and place stone
    const newBoard = board.map((row) => row.slice());
    newBoard[r][c] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
  }

  // container dimensions (px)
  const boardInnerSize = spacing * (size - 1); // distance between first and last line
  const boardPixelSize = boardInnerSize + padding * 2;

  return (
    <div className="app-root">
      <div
        className="board"
        style={{ width: boardPixelSize, height: boardPixelSize }}
      >
        {/* draw horizontal lines */}
        {Array.from({ length: size }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="line horizontal"
            style={{ top: padding + i * spacing }}
          />
        ))}

        {/* draw vertical lines */}
        {Array.from({ length: size }).map((_, j) => (
          <div
            key={`v-${j}`}
            className="line vertical"
            style={{ left: padding + j * spacing }}
          />
        ))}

        {/* clickable intersections & stones */}
        {board.map((row, r) =>
          row.map((stone, c) => {
            const left = padding + c * spacing;
            const top = padding + r * spacing;
            return (
              <div
                key={`pt-${r}-${c}`}
                className={`intersection ${stone || ""}`}
                style={{ left, top }}
                onClick={() => handleClick(r, c)}
                title={`(${r}, ${c})`}
              />
            );
          })
        )}
      </div>

      <div className="info">
        Turn: <span className={`player-indicator ${currentPlayer}`}>{currentPlayer}</span>
      </div>
    </div>
  );
}
