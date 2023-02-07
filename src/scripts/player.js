
function player(spec) {
    let that = {}

    let position = {x: 0, y: 0}
    let score = 0;
    let rotation = 90
    let size = spec.size;

    that.getX = function() {
        return position.x;
    }

    that.getY = function() {
        return position.y;
    }

    that.getRotation = function() {
        return rotation * Math.PI / 180
    }

    that.getSize = function() {
        return size;
    }

    that.getScore = function() {
        return score;
    }

    return that;
}