"use strict"

function cell(spec) {
    let that = {};
    
    that.getX = function() { return spec.coordinates.x; }
    that.getY = function() { return spec.coordinates.y; }
    that.inMaze = function() { return spec.inMaze; }
    that.addToMaze = function() { spec.inMaze = true; }
    return that;
}

function maze(spec) {
    let that = {};

    let mazeSize = spec.size;
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
    let horizontalWalls = []
    for(let i=0; i<mazeSize-1; i++){
        verticalWalls[i] = [];
        for(let j=0; j<mazeSize; j++){
            verticalWalls[i][j] = true;
        }
    }
    for(let i=0; i<mazeSize; i++){
        horizontalWalls[i] = [];
        for(let j=0; j<mazeSize-1; j++){
            horizontalWalls[i][j] = true;
        }
    }

    that.breakHorizWall = function(x, y) {
        horizontalWalls[x][y] = false;
    }

    that.breakVertWall = function(x, y) {
        verticalWalls[x][y] = false;
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
    
                if (coordinates.x === connectionCoords.x) {
                    if (coordinates.y > connectionCoords.y) {
                        that.breakHorizWall(coordinates.x, connectionCoords.y);
                    } else if (coordinates.y < connectionCoords.y) {
                        that.breakHorizWall(coordinates.x, coordinates.y);
                    }
                } else if (coordinates.y === connectionCoords.y) {
                    if (coordinates.x > connectionCoords.x) {
                        that.breakVertWall(connectionCoords.x, coordinates.y);
                    } else if (coordinates.x < connectionCoords.x) {
                        that.breakVertWall(coordinates.x, coordinates.y);
                    }
                }
            }
        } while(frontier.length > 0)
    }

    that.draw = function(width, height, context) {
        let cellWidth = width / mazeSize;
        let cellHeight = height / mazeSize;

        context.clearRect(0, 0, width, height);

        context.beginPath();

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
        for(let i=0; i<horizontalWalls.length; i++) {
            for(let j=0; j<horizontalWalls[i].length; j++) { 
                if(horizontalWalls[i][j]) {
                    context.moveTo(i * cellWidth, (j + 1) * cellHeight)
                    context.lineTo((i + 1) * cellWidth, (j + 1) * cellHeight)
                }
            }
        }

        context.closePath();
        context.lineWidth = 4;
        context.strokeStyle = 'rgba(255, 0, 0, 1)';
        context.stroke();
    }

    return that;
}

function GameModel() {
    let that = {};

    let state = "menu"

    that.getState = function() {
        return state;
    }

    that.setState = function(newState) {
        if (newState == "menu" || newState == "game") {
            state = newState;
        }
    }

    that.processInput = function(elapsedTime) {
        console.log(elapsedTime);
    }

    that.update = function(elapsedTime) {
        console.log(elapsedTime);
    }

    that.render = function() {

    }

    return that;
}



function processInput(elapsedTime) {
    gameModel.processInput(elapsedTime);
}

function update(elapsedTime) {
    gameModel.update(elapsedTime);
}

function render() {
    gameModel.render();
}

function gameLoop(timeStamp) {
    let elapsedTime = timeStamp - prevTime;
    prevTime = timeStamp;

    processInput(elapsedTime);
    update(elapsedTime);
    render();
    if (gameModel.getState() == "game"){
        requestAnimationFrame(gameLoop);
    }
}


function start(size) {
    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    let myMaze = maze({ size });
    myMaze.generate();
    myMaze.draw(canvas.width, canvas.height, context);
    
    let myGame = document.getElementById('game');
    myGame.classList.remove("hidden");
    let myMenu = document.getElementById('menu');
    myMenu.classList.add("hidden");
    
    gameModel.setState("game")
    gameLoop(prevTime)
}

function reset() {
    gameModel.setState("menu")
    
    let game = document.getElementById('game');
    game.classList.add("hidden");
    let menu = document.getElementById('menu');
    menu.classList.remove("hidden");
}

let gameModel = GameModel();
let prevTime = performance.now();
