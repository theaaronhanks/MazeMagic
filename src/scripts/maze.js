"use strict"

function maze(spec) {
    let that = {};

    let shortestPath = [];
    let mazeSize = spec.size;
    let cells = [];
    for (let i = 0; i < mazeSize; i++) {
        cells[i] = [];
        for (let j = 0; j < mazeSize; j++) {
            cells[i][j] = {
                x: i, 
                y: j, 
                edges: {
                    n: null,
                    s: null,
                    w: null,
                    e: null
                },
                // these are for the maze generation and pathfinding algorithms
                inMaze: false,
                explored: false,
                // these are used throughout the program
                inPath: false, 
                isHint: false,
                entered: false,
            };
        }
    }

    that.getShortestPath = function () {
        return shortestPath;
    }

    that.getHint = function () {
        return shortestPath[shortestPath.length - 1];
    }

    that.pushToShortestPath = function (cell) {
        shortestPath.push(cell);
        cell.inPath = true;
    }

    that.popFromShortestPath = function () {
        let cell = shortestPath.pop();
        cell.inPath = false;
        return cell;
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

        computeShortestPath();
    }

    function computeShortestPath() {
        let goal = that.getCell(mazeSize-1, mazeSize-1);
        let Q = []
        let pre = [];
        that.getCell(0,0).explored = true;
        Q.push(that.getCell(0,0));
        do {
            let nextCell = Q.splice(0,1)[0];
            if (nextCell === goal) {
                do {
                    shortestPath.push(goal);
                    goal.inPath = true;
                    goal = that.getCell(Math.floor(pre[goal.x * mazeSize + goal.y] / mazeSize), pre[goal.x * mazeSize + goal.y] % mazeSize);
                } while (goal != that.getCell(0,0))
                return;
            }
            if (nextCell.edges.n) {
                if (!nextCell.edges.n.explored) {
                    pre[nextCell.edges.n.x * mazeSize + nextCell.edges.n.y] = nextCell.x * mazeSize + nextCell.y
                    nextCell.edges.n.explored = true;
                    Q.push(nextCell.edges.n);
                }
            }
            if (nextCell.edges.e) {
                if (!nextCell.edges.e.explored){
                    pre[nextCell.edges.e.x * mazeSize + nextCell.edges.e.y] = nextCell.x * mazeSize + nextCell.y
                    nextCell.edges.e.explored = true;
                    Q.push(nextCell.edges.e)
                }
            }
            if (nextCell.edges.s) {
                if (!nextCell.edges.s.explored) {
                    pre[nextCell.edges.s.x * mazeSize + nextCell.edges.s.y] = nextCell.x * mazeSize + nextCell.y
                    nextCell.edges.s.explored = true;
                    Q.push(nextCell.edges.s)
                }
            }
            if (nextCell.edges.w) {
                if (!nextCell.edges.w.explored) {
                    pre[nextCell.edges.w.x * mazeSize + nextCell.edges.w.y] = nextCell.x * mazeSize + nextCell.y
                    nextCell.edges.w.explored = true;
                    Q.push(nextCell.edges.w)
                }
            }
        } while (Q.length != 0);
    }

    return that;
}