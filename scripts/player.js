
function player(spec) {
    let that = {
        location: spec.location,
        rotation: 90,
        score: 0
    }

    that.getRotation = function() {
        return that.rotation * Math.PI / 180
    }

    return that;
}