console.log(matrixMath.dotProduct([123, 456, 789], [987, 654, 321]));

const canvas = document.querySelector('#glCanvas');
r =  new Renderer(canvas);
r.init();

let obj1 = new Drawable(new Float32Array([-1, -1, -.5, 0, 0, -1]), new Float32Array([1, 0, 0, 1]));
let obj2 = new Drawable(new Float32Array([0, 1, 1, 1, .5, 0]), new Float32Array([0, 0, 1, 1]));
let obj3 = new Drawable(new Float32Array([-1, 1, -1, 0, 0, 1, 0, 0]), new Float32Array([.7, 0, 1, 1]));

console.log(matrixMath.multiplyMat3([1, 2, 1, 0, 1, 0, 2, 3, 4], [2, 5, 1, 6, 7, 1, 1, 8, 1]));

obj1.setColor(Math.random()*255, Math.random()*255, Math.random()*255, 255);
r.toDraw(obj1);
r.toDraw(obj2);
r.toDraw(obj3);
r.render();
