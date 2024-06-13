const columns = 4
const tileColumns = columns * 2 + 1
const roomCoords = [...Array(columns * columns).keys()].map((i) => { return { x: (i % columns) * 2 + 1, y: (Math.floor(i / columns) * 2 + 1) } })

let tiles = Array(tileColumns * tileColumns).fill('#')
for (const coord of roomCoords) {
  const x = coord.x
  const y = coord.y
  const i = x * tileColumns + y
  tiles[i] = '.'
}

let visited = []

function getNeighborsIndexes(roomIndex) {
  const x = roomIndex % columns
  const y = Math.floor(roomIndex / columns)

  const onTop = y == 0
  const onLeft = x == 0
  const onRight = x == columns - 1
  const onBottom = y == columns - 1

  let neighbors = []

  const createDirectionIndexPair = (d, i) => { return { direction: d, index: i } }

  const data =
    [
      { condition: !onTop, direction: "North", indexOffset: -columns },
      { condition: !onRight, direction: "East", indexOffset: 1 },
      { condition: !onBottom, direction: "South", indexOffset: columns },
      { condition: !onLeft, direction: "West", indexOffset: -1 },
    ]

  for (const val of data) {
    const condition = val.condition
    const direction = val.direction
    const indexOffset = val.indexOffset

    if (condition)
      neighbors.push(createDirectionIndexPair(direction, roomIndex + indexOffset))
  }

  return neighbors.filter((n) => !visited[n.index])
}

let stack = []
let currentIndex = 0
stack.push(currentIndex)
let lastDirection = ""

while (stack.length > 0) {
  visited[currentIndex] = true

  const neighborIndexes = getNeighborsIndexes(currentIndex)
  if (neighborIndexes.length > 0) {
    const x = roomCoords[currentIndex].x
    const y = roomCoords[currentIndex].y
    const tileIndex = y * tileColumns + x
    tiles[tileIndex] = '.'

    const randNeighborIndex = neighborIndexes[Math.floor(Math.random() * neighborIndexes.length)]

    stack.push(randNeighborIndex.index)
    currentIndex = randNeighborIndex.index


    const wallData =
      [
        { direction: "North", indexOffset: -tileColumns },
        { direction: "East", indexOffset: 1 },
        { direction: "South", indexOffset: tileColumns },
        { direction: "West", indexOffset: -1 },
      ]

    for (const wd of wallData) {
      if (randNeighborIndex.direction == wd.direction) {
        tiles[tileIndex + wd.indexOffset] = '.'
        lastDirection = randNeighborIndex.direction
      }
    }

  }
  else {
    stack.pop()
    currentIndex = stack[stack.length - 1] || 0
  }

}

for (let x = 0; x < tileColumns; x++) {
  let line = ""
  for (let y = 0; y < tileColumns; y++) {
    line += `${tiles[y * tileColumns + x]} `
  }
  console.log(line)
}
