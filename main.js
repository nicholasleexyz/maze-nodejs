const roomColumns = 16;
const tileColumns = roomColumns * 2 + 1;
const wallTile = '#';
const floorTile = '.';

const coord = (x, y) => ({ x, y });
const coordIndex = ({ x, y }) => y * roomColumns + x;
const applyDelta = ({ x, y }, { dx, dy }) => coord(x + dx, y + dy);

const initializeMapped2DArray = (width, height, mapFn = () => null) =>
    Array.from({ length: height }, (_, i) => Array.from({ length: width }, (_, j) => mapFn(i, j)));

// Initialize the maze with walls
const tiles = initializeMapped2DArray(tileColumns, tileColumns, () => wallTile);
// Initialize room coordinates
const rooms = initializeMapped2DArray(roomColumns, roomColumns, (x, y) => coord(x * 2 + 1, y * 2 + 1));
const getRoomAt = ({ x, y }) => rooms[x][y];
const setFloorAt = ({ x, y }, char = floorTile) => tiles[x][y] = char;

const visited = new Set();
const stack = [coord(0, 0)];

const checkVisited = (coordinate) => !visited.has(coordIndex(coordinate));
const checkBounds = ({ x, y }) => x >= 0 && y >= 0 && x < roomColumns && y < roomColumns;
const checkValid = (coordinate) => checkVisited(coordinate) && checkBounds(coordinate);

const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];

const getNeighborData = (coordinate) =>
{
    const deltaDirections = [
        { dx: 0, dy: -1 }, // Up
        { dx: 1, dy: 0 }, // Right
        { dx: 0, dy: 1 }, // Down
        { dx: -1, dy: 0 } // Left
    ];

    return deltaDirections
        .map(delta => ({ neighborCoordinate: applyDelta(coordinate, delta), neighborDelta: delta }))
        .filter(({ neighborCoordinate }) => checkValid(neighborCoordinate));
};

while (stack.length > 0)
{
    const current = stack[stack.length - 1];
    visited.add(coordIndex(current));

    const neighbors = getNeighborData(current);
    const currentRoom = getRoomAt(current);

    if (neighbors.length > 0)
    {
        const { neighborCoordinate, neighborDelta } = randomChoice(neighbors);
        stack.push(neighborCoordinate);
        setFloorAt(applyDelta(currentRoom, neighborDelta)); // Set passage between rooms
    }
    else
    {
        stack.pop();
    }

    setFloorAt(getRoomAt(current), ' '); // Mark the current room as floor
}

// Print the maze
tiles.forEach(row => console.log(row.join(' ')));
