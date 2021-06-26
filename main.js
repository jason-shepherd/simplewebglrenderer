const canvas = document.querySelector('#glCanvas');

r =  new Renderer(canvas);
r.init();

//Creates square object
var square = new RenderTarget(new Float32Array([0, 0, 100, 0, 0, 100, 100, 100]), new Float32Array([1, 0, 0, 1]));
square.translateOrigin(-50, -50);
square.translate(50, 50);

r.toDraw(square);
r.render();

//Setup sliders for transformation demo
const xSlider = document.getElementById("xSlider");
const ySlider = document.getElementById("ySlider");
const xScaleSlider = document.getElementById("xScaleSlider");
const yScaleSlider = document.getElementById("yScaleSlider");
const rotationSlider = document.getElementById("rotationSlider");

var x=0, y=0, xScale=1, yScale=1, rotation=0;

//Slider on input functions
function scaleX(value) {
    xScale = value;
    square.scale(xScale, yScale);
    r.render();
}

function scaleY(value) {
    yScale = value;
    square.scale(xScale, yScale);
    r.render();
}

function translateX(value) {
    x = value;
    square.translate(x, y);
    r.render();
}

function translateY(value) {
    y = value;
    square.translate(x, y);
    r.render();
}

function rotate(deg) {
    rotation = deg;
    square.rotate(deg);
    r.render();
}

