function Renderer(canvas) {
    /** @type {WebGLRenderingContext} */
    var gl = canvas.getContext("webgl");
    var program;
    
    var globalUniforms = {};
    var objectsToDraw = [];

    var resizeCanvasToDisplay = function(canvas, multiplier) {
        multiplier = multiplier || 1;
        const width = canvas.clientWidth * multiplier | 0;
        const height = canvas.clientHeight * multiplier | 0;
        if(canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
        return {width: width, height: height};
    }

    let screenDimensions = resizeCanvasToDisplay(canvas);
    this.width = screenDimensions.width;
    this.height = screenDimensions.height;

    this.init = function() {
        program = new ShaderProgram(gl);
        program.createProgram("shader-vs", "shader-fs");
    }

    //TODO look for better way to do this
    this.toDraw = function(object) {
        objectsToDraw.push(object);
    }

    this.render = function() {
        program.use();
        
        gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        objectsToDraw.forEach((object) => {
            object.computeTransformation(matrixMath.projectionMat3(this.width, this.height));

            program.fillAttribs(object.attribData);
            program.fillUniforms(object.uniformData);

            gl.drawArrays(gl[object.drawMode], 0, object.attribData.a_position.data.length/2);
        });
    }
}

//TODO matrix transformations
function Drawable(verts, color) {
    this.attribData = {a_position: {data: verts, length: 2}};
    this.uniformData = {u_color: color, u_matrix: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])};
    this.drawMode = "TRIANGLE_STRIP";

    var transform = {
        position: {x: 0, y:0},
        scale: {x: 1, y:1},
        rotation: 0
    }

    this.setColor = function(r, g, b, a=255) {
        this.uniformData.u_color = new Float32Array([r/255, g/255, b/255, a/255]);
    }

    this.scale = function(scaleX, scaleY) {
        transform.scale.x = scaleX;
        transform.scale.y = scaleY;
    }

    this.translate = function(x, y) {
        transform.position.x = x;
        transform.position.y = y;
    }

    this.rotate = function(deg) {
        transform.rotation = deg;
    }

    this.computeTransformation = function(projection) {
        this.uniformData.u_matrix = matrixMath.multiplySeriesMat3(projection, matrixMath.translateMat3(transform.position.x, transform.position.y),
                                                                  matrixMath.rotateMat3(transform.rotation), matrixMath.scaleMat3(transform.scale.x, transform.scale.y));
    }
}
