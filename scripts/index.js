"use strict"

let gameModel = GameModel();
let prevTime = 0;

function start(size) {

    let newMaze = maze({ size });
    newMaze.generate();

    let gameScreen = document.getElementById('game');
    gameScreen.classList.remove("hidden");
    let menuScreen = document.getElementById('menu');
    menuScreen.classList.add("hidden");

    gameModel.startNewGame(newMaze);
    prevTime = performance.now();
    gameLoop(prevTime);
}

function reset() {
    gameModel.reset();

    let gameScreen = document.getElementById('game');
    gameScreen.classList.add("hidden");
    let menuScreen = document.getElementById('menu');
    menuScreen.classList.remove("hidden");
}


