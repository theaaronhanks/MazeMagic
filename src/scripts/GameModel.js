function GameModel() {
    let that = {};

    let state = "menu";
    let gameMaze = {};
    let gamePlayer = {};
    let gameTime = 0;
    let highScores = [];

    let timeDisplay = document.getElementById("time");
    let scoreDisplay = document.getElementById("score");

    let playerTexture = textureMaker('images/player_ship.png');
    let bgTexture = textureMaker('images/space_background.png');
    let finishTexture = textureMaker('images/planet.png');

    that.graphics = (function () {
        let canvas = document.getElementById('id-canvas');
        let context = canvas.getContext('2d');

        bgTexture.center = { x:canvas.width / 2, y:canvas.height / 2}
        bgTexture.height = canvas.height;
        bgTexture.width = canvas.width;

        function clear() {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        function Maze(maze) {
            let mazeSize = maze.getSize();
            let verticalWalls = maze.getVertWalls();
            let horizontalWalls = maze.getHorizWalls();
            let cellWidth = canvas.width / mazeSize;
            let cellHeight = canvas.height / mazeSize;

            context.beginPath();

            context.moveTo(0, 0);
            context.lineTo(canvas.width, 0);
            context.lineTo(canvas.width, canvas.height);
            context.lineTo(0, canvas.height);
            context.lineTo(0, 0);

            for (let i = 0; i < verticalWalls.length; i++) {
                for (let j = 0; j < verticalWalls[i].length; j++) {
                    if (verticalWalls[i][j]) {
                        context.moveTo((i + 1) * cellWidth, j * cellHeight);
                        context.lineTo((i + 1) * cellWidth, (j + 1) * cellHeight);
                    }
                }
            }
            for (let i = 0; i < horizontalWalls.length; i++) {
                for (let j = 0; j < horizontalWalls[i].length; j++) {
                    if (horizontalWalls[i][j]) {
                        context.moveTo(i * cellWidth, (j + 1) * cellHeight)
                        context.lineTo((i + 1) * cellWidth, (j + 1) * cellHeight)
                    }
                }
            }

            context.closePath();
            context.lineWidth = 4;
            context.strokeStyle = 'rgba(255, 255, 50, 1)';
            context.stroke();

        }
        function Player(player) {
            let size = player.getSize();
            let cellWidth = canvas.width / size;
            let cellHeight = canvas.height / size;
            playerTexture.width = .75 * cellWidth;
            playerTexture.height = .75 * cellWidth; 
            playerTexture.center.x = (player.getX() * canvas.width / size) + (cellWidth / 2);
            playerTexture.center.y = (player.getY() * canvas.height / size) + (cellHeight / 2);
            playerTexture.rotation = player.getRotation();
            Texture(playerTexture)
        }
        function Finish(maze) {
            let size = maze.getSize();
            let cellWidth = canvas.width / size;
            let cellHeight = canvas.height / size;
            finishTexture.width = .75 * cellWidth;
            finishTexture.height = .75 * cellWidth; 
            finishTexture.center.x = (canvas.width) - (cellWidth / 2);
            finishTexture.center.y = (canvas.height) - (cellHeight / 2);
            Texture(finishTexture)
        }
        function Texture(texture) { 
            if (texture.image.ready) {
                context.save();
                
                context.translate(texture.center.x, texture.center.y);
                context.rotate(texture.rotation);
                context.translate(-texture.center.x, -texture.center.y);
                
                context.drawImage(
                    texture.image, 
                    texture.center.x - texture.width/2,
                    texture.center.y - texture.height/2,
                    texture.width, texture.height);
                
                context.restore();
            }
        }
        return {
            clear,
            Maze,
            Player,
            Finish,
            Texture
        };
    }());

    that.getState = function () {
        return state;
    }

    that.startGame = function(maze, player) {
        gameMaze = maze;
        gamePlayer = player;
        state = "game";
        gameTime = 0;
    }

    that.reset = function() {
        state = "menu";
        gameTime = 0;
        gamePlayer = {};
        gameMaze = {};
    }

    that.processInput = function (elapsedTime) {
    }

    that.update = function (elapsedTime) {
        gameTime += elapsedTime;
    }

    that.render = function () {
        that.graphics.clear();
        that.graphics.Texture(bgTexture);
        that.graphics.Maze(gameMaze);
        that.graphics.Finish(gameMaze);
        that.graphics.Player(gamePlayer);
        let timeString = (`${(Math.floor(gameTime / 60000) % 60).toString().padStart(2, "0")}:${(Math.floor(gameTime / 1000) % 60).toString().padStart(2, "0")}`)
        timeDisplay.innerHTML = timeString;
        scoreDisplay.innerHTML = gamePlayer.getScore();
    }

    return that;
}