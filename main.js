const canvas = document.querySelector('#glCanvas');
r =  new Renderer(canvas);
r.init();

let obj1 = new Drawable(new Float32Array([-1, -1, -.5, 0, 0, -1]), new Float32Array([1, 0, 0, 1]));
let obj2 = new Drawable(new Float32Array([0, 1, 1, 1, .5, 0]), new Float32Array([0, 0, 1, 1]));
let obj3 = new Drawable(new Float32Array([-1, 1, -1, 0, 0, 1, 0, 0]), new Float32Array([.7, 0, 1, 1]));

obj1.setColor(Math.random()*255, Math.random()*255, Math.random()*255, 255);
r.toDraw(obj1);
r.toDraw(obj2);
r.toDraw(obj3);
r.render();
