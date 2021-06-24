const canvas = document.querySelector('#glCanvas');

r =  new Renderer(canvas);
r.init();

var player = new Drawable(new Float32Array([0, 0, 100, 0, 0, 100, 100, 100]), new Float32Array([1, 0, 0, 1]));

player.translate(200, 100);
player.scale(2, 2);
player.rotate(45);

r.toDraw(player);
r.render(player);
