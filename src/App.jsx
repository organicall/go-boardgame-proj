import React, { useState } from "react";
import "./App.css";
import { getGroup, countLiberties } from "./gameLogic";


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
    if (board[r][c] !== null) return; // occupied
  
    const newBoard = board.map((row) => row.slice());
    newBoard[r][c] = currentPlayer;
  
    const opponent = currentPlayer === "black" ? "white" : "black";
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
  
    // Check neighboring opponent groups for capture
    for (const [dx, dy] of dirs) {
      const nx = r + dx;
      const ny = c + dy;
      if (
        nx >= 0 &&
        nx < size &&
        ny >= 0 &&
        ny < size &&
        newBoard[nx][ny] === opponent
      ) {
        const enemyGroup = getGroup(newBoard, nx, ny);
        if (countLiberties(newBoard, enemyGroup) === 0) {
          // capture enemy stones
          for (const [ex, ey] of enemyGroup) {
            newBoard[ex][ey] = null;
          }
        }
      }
    }
  
    // Check if our own move is suicide
    const myGroup = getGroup(newBoard, r, c);
    if (countLiberties(newBoard, myGroup) === 0) {
      // Illegal move (suicide)
      return;
    }
  
    // Apply move
    setBoard(newBoard);
    setCurrentPlayer(opponent);
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
