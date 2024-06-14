const ROOM_COLUMNS = 32;
const TILE_COLUMNS = ROOM_COLUMNS * 2 + 1;

const PASSAGE_TILE = '.';
const FLOOR_TILE = ' ';
const WALL_TILE = '#';

const tiles = Array(TILE_COLUMNS * TILE_COLUMNS)
    .fill(WALL_TILE);
const rooms = Array.from({ length: ROOM_COLUMNS * ROOM_COLUMNS }, (_, i) =>
    (TILE_COLUMNS + 1) * (Math.floor(i / ROOM_COLUMNS) + 1) + i * 2
);

const visited = new Set();
const stack = [0]; // room index

const DIRECTIONS = [
    { dx: 0, dy: -1, condition: (_x, y) => y > 0 }, // Up
    { dx: 1, dy: 0, condition: (x, _y) => x < ROOM_COLUMNS - 1 }, // Right
    { dx: 0, dy: 1, condition: (_x, y) => y < ROOM_COLUMNS - 1 }, // Down
    { dx: -1, dy: 0, condition: (x, _y) => x > 0 } // Left
];

const getNeighborData = (roomIndex) => {
    const x = roomIndex % ROOM_COLUMNS;
    const y = Math.floor(roomIndex / ROOM_COLUMNS);

    return DIRECTIONS
        .filter(({ condition }) => condition(x, y))
        .map(({ dx, dy }) => ({ neighbor: roomIndex + dx + dy * ROOM_COLUMNS, dx, dy }))
        .filter(({ neighbor }) => !visited.has(neighbor));
};

while (stack.length > 0) {
    const currentRoomIndex = stack[stack.length - 1];
    visited.add(currentRoomIndex);

    const neighbors = getNeighborData(currentRoomIndex);

    if (neighbors.length > 0) {
        const { neighbor, dx, dy } = neighbors[Math.floor(Math.random() * neighbors.length)];
        stack.push(neighbor);

        const tileIndex = rooms[currentRoomIndex] + dx + dy * TILE_COLUMNS;
        tiles[tileIndex] = PASSAGE_TILE;
    } else {
        stack.pop();
    }

    tiles[rooms[currentRoomIndex]] = FLOOR_TILE;
}

const formattedTiles = tiles.map((tile, i) => `${tile}${(i + 1) % TILE_COLUMNS === 0 ? '\n' : ' '}`)
    .join('');
console.log(formattedTiles);
