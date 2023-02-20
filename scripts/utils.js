
function textureMaker(spec) {
    let that = {};

    spec.image = new Image();
    spec.image.ready = false;
    spec.image.onload = function() {
        this.ready = true;
    };
    spec.image.src = spec.imageSrc;

    that.texture = spec;
    return that;
}

let Input = (function() {
    function Keyboard() {
        let that = {
            keys : {},
            handlers : {}
        };

        function keyPress(e) {
            if(e.repeat) {
                return
            }
            that.keys[e.key] = e.timeStamp;
        }
        
        function keyRelease(e) {
            delete that.keys[e.key];
        }

        window.addEventListener('keydown', keyPress);
        window.addEventListener('keyup', keyRelease);

        that.registerCommand = function(key, handler) {
            that.handlers[key] = handler;
        };

        that.update = function(elapsedTime) {
            for (let key in that.keys) {
                if (that.keys.hasOwnProperty(key)) {
                    if (that.handlers[key]) {
                        that.handlers[key](elapsedTime);
                    }
                }
            }
            that.keys = {};
        };

        return that;
    }

    return {
        Keyboard : Keyboard
    };
}());

let Graphics = (function () {
    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    let breadcrumbs = false;
    let hint = false;
    let path = false;

    function reset() {
        breadcrumbs = false;
        hint = false;
        path = false;
    }

    function toggleCrumbs() {
        breadcrumbs = !breadcrumbs;
    }

    function toggleHint() {
        hint = !hint;
    }

    function togglePath() {
        path = !path;
    }

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function Maze(maze) {
        let mazeSize = maze.getSize();
        let cellWidth = canvas.width / mazeSize;
        let cellHeight = canvas.height / mazeSize;

        function drawCell(cell){
            if (cell.edges.n === null) {
                context.moveTo(cell.x * cellWidth, cell.y * cellHeight);
                context.lineTo((cell.x + 1) * cellWidth, cell.y * cellHeight);
            }
        
            if (cell.edges.s === null) {
                context.moveTo(cell.x * cellWidth, (cell.y + 1) * cellHeight);
                context.lineTo((cell.x + 1) * cellWidth, (cell.y + 1) * cellHeight);
            }
        
            if (cell.edges.e === null) {
                context.moveTo((cell.x + 1) * cellWidth, cell.y * cellHeight);
                context.lineTo((cell.x + 1) * cellWidth, (cell.y + 1) * cellHeight);
            }
        
            if (cell.edges.w === null) {
                context.moveTo(cell.x * cellWidth, cell.y * cellHeight);
                context.lineTo(cell.x * cellWidth, (cell.y + 1) * cellHeight);
            }
            if (hint && cell == maze.getHint()) {
                context.fillStyle = 'rgba(255, 50, 50, 1)';
                context.fillRect(cell.x * cellWidth + (cellWidth / 3),  cell.y * cellHeight + (cellHeight / 3), cellWidth / 3, cellHeight / 3)
                context.fill();
            }else if (path && cell.inPath) {
                context.fillStyle = 'rgba(50, 255, 50, 1)';
                context.fillRect(cell.x * cellWidth + (cellWidth / 3),  cell.y * cellHeight + (cellHeight / 3), cellWidth / 3, cellHeight / 3)
                context.fill();
            } else if (cell.entered && breadcrumbs) {
                context.fillStyle = 'rgba(255, 255, 50, 1)';
                context.fillRect(cell.x * cellWidth + (cellWidth / 3),  cell.y * cellHeight + (cellHeight / 3), cellWidth / 3, cellHeight / 3)
                context.fill();
            }
        }

        context.beginPath();
        for (let row = 0; row < mazeSize; row++) {
            for (let col = 0; col < mazeSize; col++) {
                drawCell(maze.getCell(row, col));
            }
        }

        context.moveTo(0, 0);
        context.lineTo(canvas.width, 0);
        context.lineTo(canvas.width, canvas.height);
        context.lineTo(0, canvas.height);
        context.lineTo(0, 0);

        context.lineWidth = 4;
        context.closePath();
        context.fillStyle = 'rgba(255, 255, 50, 1)';
        context.strokeStyle = 'rgba(255, 255, 50, 1)';
        context.stroke();

    }
    function Texture(texture) {
        if (texture.image.ready) {
            context.save();

            context.translate(texture.center.x, texture.center.y);
            context.rotate(texture.rotation);
            context.translate(-texture.center.x, -texture.center.y);

            context.drawImage(
                texture.image,
                texture.center.x - texture.width / 2,
                texture.center.y - texture.height / 2,
                texture.width, texture.height);

            context.restore();
        }
    }
    return {
        clear,
        Maze,
        Texture,
        reset,
        toggleCrumbs,
        toggleHint,
        togglePath,
        width: canvas.width,
        height: canvas.height
    };
}());

