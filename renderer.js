function Renderer(canvas) {
    /** @type {WebGLRenderingContext} */
    var gl = canvas.getContext("webgl");
    var program;

    var objectsToDraw = [];

    //TODO replace old code with new helper functions
    this.init = function() {
        program = new ShaderProgram(gl);
        program.createProgram("shader-vs", "shader-fs");
    }

    //TODO look for better way to do this
    this.toDraw = function(object) {
        objectsToDraw.push(object);
    }

    //TODO replace old code with new helper functions
    this.render = function() {
        program.use();

        objectsToDraw.forEach((object) => {
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

    this.setColor = function(r, g, b, a=255) {
        this.uniformData.u_color = new Float32Array([r/255, g/255, b/255, a/255]);
    }

    this.mulitplyMatrixBy = function(matrixToMultiply) {

    }
    
    this.dotProduct = function(vector) {

    }

    this.scale = function(scaleX, scaleY) {

    }

    this.translate = function(x, y) {

    }

    this.rotate = function(deg) {

    }
}
