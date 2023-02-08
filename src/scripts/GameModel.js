function GameModel() {
    let that = {};

    // Game data
    let state = "menu";
    let gameMaze = {};
    let gamePlayer = {};
    let gameTime = 0;
    let highScores = [];

    // Displays
    let timeDisplay = document.getElementById("time");
    let scoreDisplay = document.getElementById("score");

    let gameInput = Input.Keyboard();

    function movePlayerLeft() {
        console.log("left");
    }
    function movePlayerRight() {
        console.log("right");
    }
    function movePlayerDown() {
        console.log("down");
    }
    function movePlayerUp() {
        console.log("up");
    }

    gameInput.registerCommand('a', movePlayerLeft);
    gameInput.registerCommand('j', movePlayerLeft);
    gameInput.registerCommand('ArrowLeft', movePlayerLeft);
    gameInput.registerCommand('d', movePlayerRight);
    gameInput.registerCommand('l', movePlayerRight);
    gameInput.registerCommand('ArrowRight', movePlayerRight);
    gameInput.registerCommand('w', movePlayerUp);
    gameInput.registerCommand('i', movePlayerUp);
    gameInput.registerCommand('ArrowUp', movePlayerUp);
    gameInput.registerCommand('s', movePlayerDown);
    gameInput.registerCommand('k', movePlayerDown);
    gameInput.registerCommand('ArrowDown', movePlayerDown);

    // Texture declarations
    let playerIcon = {};
    let finishIcon = {};
    let background = textureMaker({
        imageSrc: 'images/space_background.png',
        center: { x: Graphics.width / 2, y: Graphics.height / 2 },
        height: Graphics.height,
        width: Graphics.width,
        rotation: 0
    });

    // Initialize game data and textures
    that.startNewGame = function (maze, player) {
        state = "game";
        gameTime = 0;
        gameMaze = maze;
        gamePlayer = player;

        let size = maze.getSize();
        let cellWidth = Graphics.width / size;
        let cellHeight = Graphics.height / size;

        playerIcon = textureMaker({
            imageSrc: 'images/player_ship.png',
            center: {
                x: (gamePlayer.getX() * Graphics.width / size) + (cellWidth / 2),
                y: (gamePlayer.getY() * Graphics.height / size) + (cellHeight / 2)
            },
            width: .75 * cellWidth,
            height: .75 * cellHeight,
            rotation: gamePlayer.getRotation()
        });

        finishIcon = textureMaker({
            imageSrc: 'images/planet.png',
            center: {
                x: (Graphics.width) - (cellWidth / 2),
                y: (Graphics.height) - (cellHeight / 2)
            },
            width: .75 * cellWidth,
            height: .75 * cellHeight,
            rotation: 0
        })
    }

    // Reset game data (except high scores)
    that.reset = function () {
        state = "menu";
        gameTime = 0;
        gamePlayer = {};
        gameMaze = {};
    }

    // game handling functions
    that.getState = function () {
        return state;
    }

    // Game loop related functions
    that.processInput = function (elapsedTime) {
        gameInput.update(elapsedTime)
    }

    that.update = function (elapsedTime) {
        gameTime += elapsedTime;
    }

    that.render = function () {
        if (state === "game") {
            Graphics.clear();
            Graphics.Texture(background.texture);
            Graphics.Maze(gameMaze);
            Graphics.Texture(finishIcon.texture);
            Graphics.Texture(playerIcon.texture);
            let timeString = (`${(Math.floor(gameTime / 60000) % 60).toString().padStart(2, "0")}:${(Math.floor(gameTime / 1000) % 60).toString().padStart(2, "0")}`)
            timeDisplay.innerHTML = timeString;
            scoreDisplay.innerHTML = gamePlayer.getScore();
        }
    }

    return that;
}