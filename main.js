'use strict';

function range(size) {
  return [...Array(size).keys()];
}

function coordinatesToIndex(x, y, columns) {
  return y * columns + x;
}

// creating rooms
const roomColumns = 16;
const roomCount = roomColumns * roomColumns;

let roomStates = range(roomColumns).map((y) =>
  range(roomColumns).map((x) => {
    return { x: x, y: y, visited: false, neighbors: [] };
  })
);

function getNeighbors(current) {
  const onTop = current.y === 0;
  const onBottom = current.y >= roomColumns - 1;
  const onLeft = current.x === 0;
  const onRight = current.x >= roomColumns - 1;

  const getRelativeDirections = () => {
    return {
      North: { x: 0, y: -1 }, // north
      East: { x: 1, y: 0 }, // east
      South: { x: 0, y: 1 }, // south
      West: { x: -1, y: 0 } // west
    };
  };

  let directions = getRelativeDirections();

  if (onTop) {
    const { North, ...rest } = directions;
    directions = rest;
  }
  if (onRight) {
    const { East, ...rest } = directions;
    directions = rest;
  }
  if (onBottom) {
    const { South, ...rest } = directions;
    directions = rest;
  }
  if (onLeft) {
    const { West, ...rest } = directions;
    directions = rest;
  }

  let neighbors = [];

  for (const [key, value] of Object.entries(directions)) {
    const newX = current.x + value.x;
    const newY = current.y + value.y;
    if (newX >= 0 && newX < roomColumns && newY >= 0 && newY < roomColumns) {
      const n = roomStates[newY][newX];
      if (!n.visited) {
        neighbors.push({ roomState: n, relativeDirection: key });
      }
    }
  }

  return neighbors;
}

/* maze generation */
let stack = [];
let current = roomStates[0][0]; // starting room
stack.push(current);

while (stack.length > 0) {
  current.visited = true;
  const neighbors = getNeighbors(current);
  if (neighbors.length > 0) {
    const randNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    current.neighbors.push({ roomState: randNeighbor.roomState, relativeDirection: randNeighbor.relativeDirection });
    stack.push(current);
    current = randNeighbor.roomState;
  } else {
    current = stack.pop();
  }
}

const tileColumns = roomColumns * 2 + 1;

const rooms = range(roomCount).map((index) => {
  return {
    x: (index % roomColumns) * 2 + 1,
    y: Math.floor(index / roomColumns) * 2 + 1,
    state: roomStates[Math.floor(index / roomColumns)][index % roomColumns]
  };
});

let mazeTiles = range(tileColumns).map(() =>
  range(tileColumns).map(() => "#")
);

rooms.forEach((room) => {
  const x = room.x;
  const y = room.y;
  const state = room.state;

  mazeTiles[y][x] = ".";

  for (const n of state.neighbors) {
    if (n.relativeDirection === "North") {
      mazeTiles[y - 1][x] = ".";
    } else if (n.relativeDirection === "East") {
      mazeTiles[y][x + 1] = ".";
    } else if (n.relativeDirection === "South") {
      mazeTiles[y + 1][x] = ".";
    } else if (n.relativeDirection === "West") {
      mazeTiles[y][x - 1] = ".";
    }
  }
});

// draw maze
for (let y = 0; y < tileColumns; y++) {
  let line = "";
  for (let x = 0; x < tileColumns; x++) {
    line += `${mazeTiles[y][x]} `;
  }
  console.log(line);
}
