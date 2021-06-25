const canvas = document.querySelector('#glCanvas');

r =  new Renderer(canvas);
r.init();

var square = new Drawable(new Float32Array([0, 0, 100, 0, 0, 100, 100, 100]), new Float32Array([1, 0, 0, 1]));

square.translate(100, 100);

r.toDraw(square);
r.render();

function scale(x, y) {
    square.scale(x, y);
    r.render();
}

function translate(x, y) {
    square.translate(x, y);
    r.render();
}

function rotate(deg) {
    square.rotate(deg);
    r.render();
}
