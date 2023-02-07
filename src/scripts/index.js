"use strict"

let gameModel = GameModel();
let prevTime = 0;

function start(size) {

    let myMaze = maze({ size });
    myMaze.generate();

    let myPlayer = player({ size });

    let myGame = document.getElementById('game');
    myGame.classList.remove("hidden");
    let myMenu = document.getElementById('menu');
    myMenu.classList.add("hidden");

    gameModel.startGame(myMaze, myPlayer);
    prevTime = performance.now();
    gameLoop(prevTime);
}

function reset() {
    gameModel.reset();

    let game = document.getElementById('game');
    game.classList.add("hidden");
    let menu = document.getElementById('menu');
    menu.classList.remove("hidden");
}


