
function player(spec) {
    let that = {}

    let location = {x: 0, y: 0}
    let score = 0;
    let rotation = 90
    let size = spec.size;

    that.getX = function() {
        return location.x;
    }

    that.getY = function() {
        return location.y;
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