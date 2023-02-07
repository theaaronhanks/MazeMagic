"use strict"

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
    if (gameModel.getState() == "game") {
        requestAnimationFrame(gameLoop);
    }
}