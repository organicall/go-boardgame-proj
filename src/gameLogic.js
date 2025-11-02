// src/gameLogic.js

// Find all connected stones of the same color starting from (r, c)
export function getGroup(board, r, c) {
    const color = board[r][c];
    const visited = new Set();
    const stack = [[r, c]];
    const group = [];
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
  
    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);
      group.push([x, y]);
  
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < board.length &&
          ny >= 0 &&
          ny < board.length &&
          board[nx][ny] === color
        ) {
          stack.push([nx, ny]);
        }
      }
    }
    return group;
  }
  
  // Count liberties (empty adjacent intersections)
  export function countLiberties(board, group) {
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const liberties = new Set();
  
    for (const [x, y] of group) {
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < board.length &&
          ny >= 0 &&
          ny < board.length &&
          board[nx][ny] === null
        ) {
          liberties.add(`${nx},${ny}`);
        }
      }
    }
    return liberties.size;
  }
  