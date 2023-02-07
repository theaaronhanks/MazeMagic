
function textureMaker(source) {
    let texture = {
        imageSrc: source,
        center: { x: 0, y: 0 },
        width: 0,
        height: 0,
        rotation: 0
    }

    texture.image = new Image();
    texture.image.ready = false;
    texture.image.onload = function () {
        this.ready = true;
    }
    texture.image.src = texture.imageSrc;
    return texture;
}

