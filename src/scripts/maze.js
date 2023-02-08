"use strict"

function cell(spec) {
    let that = {};

    that.getX = function () { return spec.coordinates.x; }
    that.getY = function () { return spec.coordinates.y; }
    that.inMaze = function () { return spec.inMaze; }
    that.addToMaze = function () { spec.inMaze = true; }
    return that;
}

function maze(spec) {
    let that = {};

    let mazeSize = spec.size;
    let cells = [];
    for (let i = 0; i < mazeSize; i++) {
        cells[i] = [];
        for (let j = 0; j < mazeSize; j++) {
            // give cells references to neighbors? null means wall, cell means opening
            cells[i][j] = {
                x: i, 
                y: j, 
                edges: {
                    n: null,
                    s: null,
                    w: null,
                    e: null
                },
                inMaze: false
            };
        }
    }

    that.getSize = function () {
        return mazeSize
    }

    that.getCell = function (x, y) {
        return cells[x][y]
    }

    that.generate = function () {
        let startX = Math.floor(Math.random() * mazeSize);
        let startY = Math.floor(Math.random() * mazeSize);

        let frontier = [{ x: startX, y: startY }];
        do {
            let index = Math.floor(Math.random() * frontier.length)
            let coordinates = frontier.splice(index, 1)[0]

            let nextCell = that.getCell(coordinates.x, coordinates.y);
            if (nextCell.inMaze) {
                continue;
            }
            nextCell.inMaze = true;

            let neighbors = [
                { x: coordinates.x - 1, y: coordinates.y },
                { x: coordinates.x + 1, y: coordinates.y },
                { x: coordinates.x, y: coordinates.y - 1 },
                { x: coordinates.x, y: coordinates.y + 1 },
            ];

            let mazeNeighbors = [];

            NeighborLoop:
            for (let i = 0; i < neighbors.length; i++) {
                let x = neighbors[i].x;
                let y = neighbors[i].y;
                if (x < 0 || x >= mazeSize) {
                    continue NeighborLoop;
                }
                if (y < 0 || y >= mazeSize) {
                    continue NeighborLoop;
                }

                let neighborCell = that.getCell(x, y);
                if (neighborCell.inMaze) {
                    mazeNeighbors.push(neighborCell)
                } else {
                    frontier.push({ x, y })
                }
            }

            if (mazeNeighbors.length > 0) {
                let connectionIndex = Math.floor(Math.random() * mazeNeighbors.length)
                let neighborCell = mazeNeighbors[connectionIndex];

                if (nextCell.x === neighborCell.x) {
                    if (nextCell.y > neighborCell.y) {
                        nextCell.edges.n = neighborCell;
                        neighborCell.edges.s = nextCell;
                    } else if (nextCell.y < neighborCell.y) {
                        nextCell.edges.s = neighborCell;
                        neighborCell.edges.n = nextCell;
                    }
                } else if (nextCell.y === neighborCell.y) {
                    if (nextCell.x > neighborCell.x) {
                        nextCell.edges.w = neighborCell;
                        neighborCell.edges.e = nextCell;
                    } else if (nextCell.x < neighborCell.x) {
                        nextCell.edges.e = neighborCell;
                        neighborCell.edges.w = nextCell 
                    }
                }
            }
        } while (frontier.length > 0)
    }

    return that;
}