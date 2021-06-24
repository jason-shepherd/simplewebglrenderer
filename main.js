const canvas = document.querySelector('#glCanvas');

r =  new Renderer(canvas);
r.init();

var player = new Drawable(new Float32Array([0, 0, 100, 0, 0, 100, 100, 100]), new Float32Array([1, 0, 0, 1]));
r.toDraw(player);
r.render(player);

var position = {x:0, y:0};
var speed = 5;

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'w':
            position.y -= speed;
            break;
        case 's':
            position.y += speed;
            break;
        case 'd':
            position.x += speed;
            break;
        case 'a':
            position.x -= speed;
            break;
    }
    
    console.log(position);
    player.translate(position.x, position.y);
    r.render();
});

