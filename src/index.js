"use strict"

function cell(spec) {
    let that = {};
    
    that.getX = function() { return spec.coordinates.x; }
    that.getY = function() { return spec.coordinates.y; }
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
                inMaze: false
            });
        }
    }
    let verticalWalls = []
    for(let i=0; i<mazeSize-1; i++){
        verticalWalls[i] = [];
        for(let j=0; j<mazeSize; j++){
            verticalWalls[i][j] = true;
        }
    }
    let horizontalWalls = []
    for(let i=0; i<mazeSize; i++){
        horizontalWalls[i] = [];
        for(let j=0; j<mazeSize-1; j++){
            horizontalWalls[i][j] = true;
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

                    } else if (coordinates.y < connectionCoords.y) {

                    }
                } else if (coordinates.y === connectionCoords.y) {
                    if (coordinates.x > connectionCoords.x) {

                    } else if (coordinates.x < connectionCoords.x) {

                    }
                }
            }
        } while(frontier.length > 0)
    }

    that.draw = function(width, height, context) {

        let cellWidth = width / mazeSize;
        let cellHeight = height / mazeSize;

        context.moveTo(0,0);
        context.lineTo(width, 0);
        context.lineTo(width, height);
        context.lineTo(0, height);
        context.lineTo(0,0);

        for(let i=0; i<verticalWalls.length; i++) {
            for(let j=0; j<verticalWalls[i].length; j++) { 
                if(verticalWalls[i][j]) {
                    context.moveTo((i + 1) * cellWidth, j * cellHeight);
                    context.lineTo((i + 1) * cellWidth, (j + 1) * cellHeight);
                }
            }
        }
        console.log(horizontalWalls);
        for(let i=0; i<horizontalWalls.length; i++) {
            for(let j=0; j<horizontalWalls[i].length; j++) { 
                if(horizontalWalls[i][j]) {
                    context.moveTo(i * cellWidth, (j + 1) * cellHeight)
                    context.lineTo((i + 1) * cellWidth, (j + 1) * cellHeight)
                }
            }
        }

        context.lineWidth = 4;
        context.strokeStyle = 'rgba(255, 0, 0, 1)';
        context.stroke();
    }

    return that;
}

window.onload = (event) => {
    console.log("page is fully loaded");
    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');
    
    let mymaze = maze(20);
    mymaze.generate();
    mymaze.draw(canvas.width, canvas.height, context);
};

