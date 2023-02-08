"use strict"

let gameModel = GameModel();
let prevTime = 0;

function start(size) {

    let newMaze = maze({ size });
    newMaze.generate();

    let newPlayer = player({ size });

    let gameScreen = document.getElementById('game');
    gameScreen.classList.remove("hidden");
    let menuScreen = document.getElementById('menu');
    menuScreen.classList.add("hidden");

    gameModel.startNewGame(newMaze, newPlayer);
    prevTime = performance.now();
    gameLoop(prevTime);

    //when calculating shortest path, use a stack
}

function reset() {
    gameModel.reset();

    // rename to screens
    let gameScreen = document.getElementById('game');
    gameScreen.classList.add("hidden");
    let menuScreen = document.getElementById('menu');
    menuScreen.classList.remove("hidden");
}


