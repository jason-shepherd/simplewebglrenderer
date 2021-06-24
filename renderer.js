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
            object.transformMatrix(matrixMath.projectionMat3(this.width, this.height));

            program.fillAttribs(object.attribData);
            program.fillUniforms(object.uniformData);
            object.uniformData.u_matrix = matrixMath.identityMat3();

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

    this.scale = function(scaleX, scaleY) {
        this.uniformData.u_matrix = matrixMath.multiplyMat3(matrixMath.scaleMat3(scaleX, scaleY), this.uniformData.u_matrix);
    }

    this.translate = function(x, y) {
        this.uniformData.u_matrix = matrixMath.multiplyMat3(matrixMath.translateMat3(x, y), this.uniformData.u_matrix);
    }

    this.rotate = function(deg) {
        this.uniformData.u_matrix = matrixMath.multiplyMat3(matrixMath.rotateMat3(deg), this.uniformData.u_matrix);
    }

    this.transformMatrix = function(transformationMatrix) {
        this.uniformData.u_matrix = matrixMath.multiplyMat3(transformationMatrix, this.uniformData.u_matrix);
    }
}
