const roomColumns = 64;
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

const getNeighborDeltas = (coordinate) => {
    const deltaDirections = [coord(0, -1), coord(1, 0), coord(0, 1), coord(-1, 0)]

    return deltaDirections
        .map((delta) => ({ position: applyDelta(coordinate, delta), delta: delta }))
        .filter(({ position: p }) => checkValid(p))
        .map(({ delta: d }) => d)
}

while (stack.length > 0) {
    const current = stack[stack.length - 1]
    visited.add(coordIndex(current))

    const neighborDeltas = getNeighborDeltas(current)
    const currentRoom = getRoomAt(current)

    if (neighborDeltas.length > 0) {
        const randNeighborDelta = randomChoice(neighborDeltas)
        const neighbor = applyDelta(current, randNeighborDelta)
        stack.push(neighbor)
        setFloorAt(applyDelta(currentRoom, randNeighborDelta))
    } else {
        stack.pop()
    }

    setFloorAt(getRoomAt(current), ' ')
}

tiles.forEach((row) => console.log(row.join(' ')));
