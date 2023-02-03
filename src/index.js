"use strict"

function cell(spec) {
    let that = {};
    
    that.getX = function() { return spec.coordinates.x; }
    that.getY = function() { return spec.coordinates.y; }
    that.breakWall = function(wall) { spec.walls[wall] = false; }
    that.getWall = function(wall) { return spec.walls[wall]; }
    that.inMaze = function() { return spec.inMaze; }
    that.addToMaze = function() { spec.inMaze = true; }
    return that;
}

function maze(size) {
    let that = {};

    let mazeSize = size;
    let cells = [];
    for(let i=0; i<mazeSize; i++) {
        cells[i] = [];
        for(let j=0; j<mazeSize; j++) {
            cells[i][j] = cell({
                coordinates: { x: i, y: j },
                walls: { 
                    north: true,
                    east: true, 
                    south: true,
                    west: true,
                },
                inMaze: false
            });
        }
    }

    that.getCell = function(x, y) {
        return cells[x][y]
    }

    that.generate = function() {
        let startX = Math.floor(Math.random() * mazeSize);
        let startY = Math.floor(Math.random() * mazeSize);
        
        let frontier = [ {x: startX, y: startY} ];   
        do {
            let index = Math.floor(Math.random() * frontier.length)
            let coordinates = frontier.splice(index, 1)[0]
            
            let nextCell = that.getCell(coordinates.x, coordinates.y);
            if (nextCell.inMaze()) {
                continue;
            }
            nextCell.addToMaze();
            
            let neighbors = [
                { x: coordinates.x - 1, y: coordinates.y },
                { x: coordinates.x + 1, y: coordinates.y },
                { x: coordinates.x, y: coordinates.y - 1 },
                { x: coordinates.x, y: coordinates.y + 1 },
            ];
            
            let mazeNeighbors = [];

            NeighborLoop:
            for(let i=0; i<neighbors.length; i++) {
                let x = neighbors[i].x;
                let y = neighbors[i].y;
                if (x < 0 || x >= mazeSize) {
                    continue NeighborLoop;
                }
                if (y < 0 || y >= mazeSize) {
                    continue NeighborLoop;
                }

                let neighborCell = that.getCell(x, y);
                if (neighborCell.inMaze()) {
                    mazeNeighbors.push( { x, y } )
                } else {
                    frontier.push( { x, y } )
                }
            }

            if (mazeNeighbors.length > 0) {
                let connectionIndex = Math.floor(Math.random() * mazeNeighbors.length)
                let connectionCoords = mazeNeighbors[connectionIndex];
                let connectionCell = that.getCell(connectionCoords.x, connectionCoords.y);
    
                if (coordinates.x === connectionCoords.x) {
                    if (coordinates.y > connectionCoords.y) {
                        nextCell.breakWall("west");
                        connectionCell.breakWall("east");
                    } else if (coordinates.y < connectionCoords.y) {
                        nextCell.breakWall("east");
                        connectionCell.breakWall("west");
                    }
                } else if (coordinates.y === connectionCoords.y) {
                    if (coordinates.x > connectionCoords.x) {
                        nextCell.breakWall("north");
                        connectionCell.breakWall("south");
                    } else if (coordinates.x < connectionCoords.x) {
                        nextCell.breakWall("south");
                        connectionCell.breakWall("north");
                    }
                }
            }
        } while(frontier.length > 0)
    }

    that.draw = function(width, height, context) {

        let cellWidth = width / mazeSize;
        let cellHeight = height / mazeSize;

        // context.moveTo(0,0);
        // context.lineTo(width, 0);
        // context.lineTo(width, height);
        // context.lineTo(0, height);
        // context.lineTo(0,0);
        // context.moveTo(1 * cellWidth, 1 * cellHeight);
        // context.lineTo(2 * cellWidth, 1 * cellHeight);

        // context.moveTo(2 * cellWidth, 1 * cellHeight);
        // context.lineTo(2 * cellWidth, 2 * cellHeight);

        // context.moveTo(1 * cellWidth, 2 * cellHeight);
        // context.lineTo(2 * cellWidth, 2 * cellHeight);

        // context.moveTo(1 * cellWidth, 1 * cellHeight);
        // context.lineTo(1 * cellWidth, 2 * cellHeight);


        for(let i=0; i<mazeSize; i++) {
            for(let j=0; j<mazeSize; j++) {
                let cell = that.getCell(i, j);
                
                if (cell.getWall("north")) { 
                    context.moveTo(i * cellWidth, j * cellHeight)
                    context.lineTo((i + 1) * cellWidth, j * cellHeight)
                }
                if (cell.getWall("east")) { 
                    context.moveTo((i + 1) * cellWidth, j * cellHeight)
                    context.lineTo((i + 1) * cellWidth, (j + 1) * cellHeight)
                }
                if (cell.getWall("south")) { 
                    context.moveTo(i * cellWidth, (j + 1) * cellHeight)
                    context.lineTo((i + 1) * cellWidth, (j + 1) * cellHeight)
                }
                if (cell.getWall("west")) { 
                    context.moveTo(i * cellWidth, j * cellHeight)
                    context.lineTo(i * cellWidth, (j + 1) * cellHeight)
                }
            }
        }

        context.lineWidth = 2;
        context.strokeStyle = 'rgba(255, 0, 0, 1)';
        context.stroke();
    }

    return that;
}

window.onload = (event) => {
    console.log("page is fully loaded");
    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');
    
    let mymaze = maze(3);
    mymaze.generate();
    mymaze.draw(canvas.width, canvas.height, context);
};

