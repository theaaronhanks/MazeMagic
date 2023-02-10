function GameModel() {
    let that = {};

    // Game data
    let state = "menu";
    let gameMaze = {};
    let gamePlayer = {};
    let gameTime = 0;
    let highScores = {
        5: null,
        10: null,
        15: null,
        20: null,
    };

    // Displays
    let timeDisplay = document.getElementById("time");
    let scoreDisplay = document.getElementById("score");
    let highScoreDisplay = document.getElementById("high-scores");

    // Input configuration
    let gameInput = Input.Keyboard();

    function movePlayerLeft() {
        if (gamePlayer.location.edges.w) {
            gamePlayer.location.entered = true;
            if (gamePlayer.location.edges.w.inPath) {
                gameMaze.popFromShortestPath();
                if (!gamePlayer.location.edges.w.entered) {
                    gamePlayer.score += 5;
                }
            } else {
                gameMaze.pushToShortestPath(gamePlayer.location);
                if (!gamePlayer.location.edges.w.entered) {
                    gamePlayer.score -= 2;
                }
            }
            gamePlayer.location = gamePlayer.location.edges.w;
            gamePlayer.rotation = 270;
        }
    }
    function movePlayerRight() {
        if (gamePlayer.location.edges.e) {
            if (gamePlayer.location.edges.e.inPath) {
                gameMaze.popFromShortestPath();
                if (!gamePlayer.location.edges.e.entered) {
                    gamePlayer.score += 5;
                }
            } else {
                gameMaze.pushToShortestPath(gamePlayer.location);
                if (!gamePlayer.location.edges.e.entered) {
                    gamePlayer.score -= 2;
                }
            }
            gamePlayer.location.entered = true;
            gamePlayer.location = gamePlayer.location.edges.e;
            gamePlayer.rotation = 90;
        }
    }
    function movePlayerDown() {
        if (gamePlayer.location.edges.s) {
            if (gamePlayer.location.edges.s.inPath) {
                gameMaze.popFromShortestPath();
                if (!gamePlayer.location.edges.s.entered) {
                    gamePlayer.score += 5;
                }
            } else {
                gameMaze.pushToShortestPath(gamePlayer.location);
                if (!gamePlayer.location.edges.s.entered) {
                    gamePlayer.score -= 2;
                }
            }
            gamePlayer.location.entered = true;
            gamePlayer.location = gamePlayer.location.edges.s;
            gamePlayer.rotation = 180;
        }
    }
    function movePlayerUp() {
        if (gamePlayer.location.edges.n) {
            if (gamePlayer.location.edges.n.inPath) {
                gameMaze.popFromShortestPath();
                if (!gamePlayer.location.edges.n.entered) {
                    gamePlayer.score += 5;
                }
            } else {
                gameMaze.pushToShortestPath(gamePlayer.location);
                if (!gamePlayer.location.edges.n.entered) {
                    gamePlayer.score -= 2;
                }
            }
            gamePlayer.location.entered = true;
            gamePlayer.location = gamePlayer.location.edges.n;
            gamePlayer.rotation = 0;
        }
    }
    function toggleCrumbs() {
        Graphics.toggleCrumbs();
    }
    function toggleHint() {
        Graphics.toggleHint();
    }
    function togglePath() {
        Graphics.togglePath();
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

    gameInput.registerCommand('b', toggleCrumbs);
    gameInput.registerCommand('h', toggleHint);
    gameInput.registerCommand('p', togglePath);

    // Texture declarations
    let playerIcon = textureMaker({
        imageSrc: 'images/player_ship.png',
        center: { x: 0, y: 0 },
        width: .75,
        height: .75,
        rotation: 0
    });;
    let finishIcon = textureMaker({
        imageSrc: 'images/planet.png',
        center: {
            x: (Graphics.width),
            y: (Graphics.height)
        },
        width: .75,
        height: .75,
        rotation: 0
    });
    let background = textureMaker({
        imageSrc: 'images/space_background.png',
        center: { x: Graphics.width / 2, y: Graphics.height / 2 },
        height: Graphics.height,
        width: Graphics.width,
        rotation: 0
    });

    // Initialize game data and textures
    that.startNewGame = function (maze) {
        state = "game";
        gameTime = 0;
        gameMaze = maze;
        gamePlayer = player({
            location: gameMaze.getCell(0,0)
        });

        let size = maze.getSize();
        let cellWidth = Graphics.width / size;
        let cellHeight = Graphics.height / size;

        playerIcon.texture.center.x += (cellWidth / 2);
        playerIcon.texture.center.y += (cellHeight / 2);
        playerIcon.texture.width *= cellWidth;
        playerIcon.texture.height *= cellHeight;
        playerIcon.texture.rotation = gamePlayer.getRotation();

        finishIcon.texture.center.x -= (cellWidth / 2);
        finishIcon.texture.center.y -= (cellHeight / 2);
        finishIcon.texture.width *= cellWidth;
        finishIcon.texture.height *= cellHeight;
    }

    // Reset game data (except high scores)
    that.reset = function () {
        state = "menu";
        playerIcon.texture.center.x = 0;
        playerIcon.texture.center.y = 0;
        playerIcon.texture.width = .75;
        playerIcon.texture.height = .75;
        playerIcon.texture.rotation = 0;

        finishIcon.texture.center.x = Graphics.width;
        finishIcon.texture.center.y = Graphics.height;
        finishIcon.texture.width = .75;
        finishIcon.texture.height = .75;

        Graphics.reset();
    }

    // game handling functions
    that.getState = function () {
        return state;
    }

    that.getHighScores = function () {
        return highScores;
    }

    // Game loop related functions
    that.processInput = function (elapsedTime) {
        if (state === "game") {
            gameInput.update(elapsedTime)
        }
    }

    that.update = function (elapsedTime) {
        if (state === "game") {
            gameTime += elapsedTime;
    
            let size = gameMaze.getSize();
            let cellWidth = Graphics.width / size;
            let cellHeight = Graphics.height / size;
            playerIcon.texture.center.x = (gamePlayer.location.x * cellWidth) + (cellWidth / 2);
            playerIcon.texture.center.y = (gamePlayer.location.y * cellHeight) + (cellHeight / 2);
            playerIcon.texture.rotation = gamePlayer.getRotation();
    
            if (gamePlayer.location === gameMaze.getCell(size-1, size-1)) {
                state = "victory"
                if (gamePlayer.score > highScores[gameMaze.getSize()]) {
                    highScores[gameMaze.getSize()] = gamePlayer.score;
                }
            }
        }
    }

    that.render = function () {
        if (state === "game" || state === "victory") {
            Graphics.clear();

            Graphics.Texture(background.texture);
            Graphics.Texture(finishIcon.texture);
            Graphics.Maze(gameMaze);
            Graphics.Texture(playerIcon.texture);

            let timeString = (`${(Math.floor(gameTime / 60000) % 60).toString().padStart(2, "0")}:${(Math.floor(gameTime / 1000) % 60).toString().padStart(2, "0")}`)
            timeDisplay.innerHTML = timeString;
            scoreDisplay.innerHTML = gamePlayer.score;

            if (state === "victory") {
                scoreDisplay.style.color = "greenyellow"
                timeDisplay.style.color = "greenyellow"
            } else {
                scoreDisplay.style.color = "aliceblue"
                timeDisplay.style.color = "aliceblue"
            }

            highScoreDisplay.innerHTML = "<h4>High Scores</h4>";
            if (highScores[5]) {
                highScoreDisplay.innerHTML += "<p>5 x 5: " + highScores[5] + "</p>";
            }
            if (highScores[10]) {
                highScoreDisplay.innerHTML += "<p>10 x 10: " + highScores[10] + "</p>";
            }
            if (highScores[15]) {
                highScoreDisplay.innerHTML += "<p>15 x 15: " + highScores[15] + "</p>";
            }
            if (highScores[20]) {
                highScoreDisplay.innerHTML += "<p>20 x 20: " + highScores[20] + "</p>";
            }

            if (state === "victory") {
                let menuScoresDisplay = document.getElementById('menu-high-scores');
                menuScoresDisplay.innerHTML = "<h4>High Scores</h4>";
                if (highScores[5]) {
                    menuScoresDisplay.innerHTML += "<span>5 x 5: " + highScores[5] + "</span>";
                }
                if (highScores[10]) {
                    menuScoresDisplay.innerHTML += "<span>10 x 10: " + highScores[10] + "</span>";
                }
                if (highScores[15]) {
                    menuScoresDisplay.innerHTML += "<span>15 x 15: " + highScores[15] + "</span>";
                }
                if (highScores[20]) {
                    menuScoresDisplay.innerHTML += "<span>20 x 20: " + highScores[20] + "</span>";
                }
                if (menuScoresDisplay.innerHTML == "<h4>High Scores</h4>") {
                    menuScoresDisplay.innerHTML += "<span>No High Scores Yet</span>"
                }
            }

        }
    }

    return that;
}