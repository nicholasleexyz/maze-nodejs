const roomColumns = 16;
const tileColumns = roomColumns * 2 + 1;
const { wallTile, floorTile } = { wallTile: '#', floorTile: '.' };

const coord = (x, y) => ({ x: x, y: y })
const coordIndex = ({ x: x, y: y }) => y * roomColumns + x
const applyDelta = ({ x: x, y: y }, { x: dx, y: dy }) => coord(x + dx, y + dy)

const initializeMapped2DArray = (width, height, mapFn = () => null) =>
    Array.from({ length: height },
        (_, i) => Array.from({ length: width },
            (_, j) => mapFn(i, j)));

const tiles = initializeMapped2DArray(tileColumns, tileColumns, (_) => wallTile);
const rooms = initializeMapped2DArray(roomColumns, roomColumns, (x, y) => coord(x * 2 + 1, y * 2 + 1));
const getRoomAt = ({ x: x, y: y }) => rooms[x][y]
const setFloorAt = ({ x: x, y: y }, char = floorTile) => tiles[x][y] = char

let visited = new Set()
let stack = [coord(0, 0)]

const checkVisited = (coordinate) => !visited.has(coordIndex(coordinate))
const checkBounds = ({ x: x, y: y }) => x >= 0 && y >= 0 && x < roomColumns && y < roomColumns
const checkValid = (coordinate) => checkVisited(coordinate) && checkBounds(coordinate)

const randomChoice = (a) => a[Math.floor(Math.random() * a.length)]

const getNeighborData = (coordinate) =>
{
    const deltaDirections = [coord(0, -1), coord(1, 0), coord(0, 1), coord(-1, 0)]

    return deltaDirections
        .map((deltaDirection) => ({ neighborCoordinate: applyDelta(coordinate, deltaDirection),
            neighborDelta: deltaDirection }))
        .filter(({ neighborCoordinate: neighborCoordinate }) => checkValid(neighborCoordinate))
}

while (stack.length > 0)
{
    const current = stack[stack.length - 1]
    visited.add(coordIndex(current))

    const neighborData = getNeighborData(current)
    const currentRoom = getRoomAt(current)

    if (neighborData.length > 0)
    {
        const { neighborCoordinate, neighborDelta } = randomChoice(neighborData)
        stack.push(neighborCoordinate)
        setFloorAt(applyDelta(currentRoom, neighborDelta))
    }
    else
    {
        stack.pop()
    }

    setFloorAt(getRoomAt(current), ' ')
}

tiles.forEach((row) => console.log(row.join(' ')));
