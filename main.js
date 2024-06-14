const roomColumns = 16;
const tileColumns = roomColumns * 2 + 1;
const wallTile = '#';
const passageTile = '.';
const floorTile = ' ';

const coordIndex = ({ x, y }) => y * roomColumns + x;
const applyDelta = ({ x, y }, { dx, dy }) => ({ x: x + dx, y: y + dy });
const inBounds = ({ x, y }) => x >= 0 && y >= 0 && x < roomColumns && y < roomColumns;
const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];

const initializeMapped2DArray = (width, height, mapFn = () => null) =>
    Array.from({ length: height }, (_, i) => Array.from({ length: width }, (_, j) => mapFn(i, j)));

// Initialize the maze with walls
const tiles = initializeMapped2DArray(tileColumns, tileColumns, () => wallTile);
// Initialize room coordinates
const rooms = initializeMapped2DArray(roomColumns, roomColumns, (x, y) => ({ x: x * 2 + 1, y: y * 2 + 1 }));

const visited = new Set();
const stack = [{ x: 0, y: 0 }];

const directions = [
    { dx: 0, dy: -1 }, // Up
    { dx: 1, dy: 0 }, // Right
    { dx: 0, dy: 1 }, // Down
    { dx: -1, dy: 0 } // Left
];

const getNeighborData = (current) =>
{
    return directions
        .map(delta => ({ neighbor: applyDelta(current, delta), delta }))
        .filter(({ neighbor }) => inBounds(neighbor) && !visited.has(coordIndex(neighbor)));
};

while (stack.length > 0)
{
    const current = stack[stack.length - 1];
    visited.add(coordIndex(current));

    const { x: roomX, y: roomY } = rooms[current.x][current.y];
    const neighborData = getNeighborData(current);

    if (neighborData.length > 0)
    {
        const { neighbor, delta } = randomChoice(neighborData);
        stack.push(neighbor);

        const { x: passageX, y: passageY } = applyDelta(rooms[current.x][current.y], delta);
        tiles[passageX][passageY] = passageTile;
    }
    else
    {
        stack.pop();
    }

    tiles[roomX][roomY] = floorTile; // Mark the current room as floor
}

// Print the maze
tiles.forEach(row => console.log(row.join(' ')));
