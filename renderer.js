/* General idea:
 * Render sets up webgl
 * creates shader program object
 * shader program object sets up webgl program and retrieves its attribs and uniforms
 * create render target object that contains data for those attribs and uniforms
 * queue it for rendering
 * give the data in the object to the webgl attribs and uniforms
 * tell webgl to draw
 */

/**
 * Renders target objects using WebGL. Create a renderer instance, run init(), toDraw(RenderTarget) to queue object for rendering, then render() to render the scene.
 * @class
 * @param {HTMLCanvasElement} canvas - canvas to render to.
 */
function Renderer(canvas) {
    /** @type {WebGLRenderingContext} */
    var gl = canvas.getContext("webgl");
    /** @type {ShaderProgram} */
    var program;
   
    //Uniform data for uniforms that don't change per object (not currently implemented)
    var globalUniforms = {};

    //List of objects queued to draw
    var objectsToDraw = [];

    /**
     * Helper function to properly size the canvas drawing buffer to canvas
     * @param {HTMLCanvasElement} canvas - HTML canvas to resize
     */
    var resizeCanvasToDisplay = function(canvas) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if(canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
    }

    /** Initialized renderer for rendering */
    this.init = function() {
        program = new ShaderProgram(gl);
        program.createProgram("shader-vs", "shader-fs");
    }
    
    /**
     * Queues RenderTarget for rendering.
     * @param {RenderTarget} object - object to render.
     */
    this.toDraw = function(object) {
        objectsToDraw.push(object);
    }

    /** Renders queued objects to canvas */
    this.render = function() {
        program.use();
        
        resizeCanvasToDisplay(gl.canvas);
        gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //Render each queued object
        objectsToDraw.forEach((object) => {
            object.computeTransformation(matrixMath.projectionMat3(gl.canvas.width, gl.canvas.height));
            
            //Fill uniforms and attributes using data from object
            program.fillAttribs(object.attribData);
            program.fillUniforms(object.uniformData);

            gl.drawArrays(gl[object.drawMode], 0, object.attribData.a_position.data.length/2);
        });
    }
}


/**
 * Target for rendering, contains information for rendering.
 * @class
 * @param {Float32Array} verts - verticies of object
 * @property {Object} attribData - attribute data passed to shader, not recommended to modify directly
 * @property {Object} uniformData - uniform data passed to shader, not recommended to modify directly
 */
function RenderTarget(verts, color) {
    //attrib and uniform data that is sent to shader program
    this.attribData = {a_position: {data: verts, length: 2}};
    this.uniformData = {u_color: color, u_matrix: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])};
    this.drawMode = "TRIANGLE_STRIP";

    //Transformation of object
    var transform = {
        origin: {x: 0, y:0},
        position: {x: 0, y:0},
        scale: {x: 1, y:1},
        rotation: 0
    }

    /** 
     * Sets the color of the object
     * @param {number} r - number from 0-255
     * @param {number} g - number from 0-255
     * @param {number} b - number from 0-255
     * @param {number} a - number from 0-255, defaults to 255
     */
    this.setColor = function(r, g, b, a=255) {
        this.uniformData.u_color = new Float32Array([r/255, g/255, b/255, a/255]);
    }

    /*
     * Scales objects non-uniformly by factor of scaleX and scaleY respectively.
     * @param {number} scaleX - x scale factor.
     * @param {number} scaleY - y scale factor.
     */
    this.scale = function(scaleX, scaleY) {
        transform.scale.x = scaleX;
        transform.scale.y = scaleY;
    }

    /*
     * Moves the object to the specified coordinates.
     * @param {number} x - x position to move.
     * @param {number} y - y position to move.
     */
    this.translate = function(x, y) {
        transform.position.x = x;
        transform.position.y = y;
    }
    
    /*
     * Rotates object in degrees by amount specified.
     * @param {number} Amount in degrees to rotate by.
     */
    this.rotate = function(deg) {
        transform.rotation = deg;
    }
    
    /** 
     * Moves the origin of the object to specified location.
     * @param {number} x - x coordinate of origin.
     * @param {number} y - y coordinate of origin.
     */
    this.translateOrigin = function(x, y) {
        transform.origin.x = x;
        transform.origin.y = y;
    }

    /**
     * Computes transformation matrix of object that is passes to shader, should only really be called by shader
     * @param {Float32Array} projection - projection matrix that transforms screen space to clip space.
     */
    this.computeTransformation = function(projection) {
        this.uniformData.u_matrix = matrixMath.multiplySeriesMat3(projection, 
                                                                  matrixMath.translateMat3(transform.position.x, transform.position.y),
                                                                  matrixMath.rotateDegreeMat3(transform.rotation),
                                                                  matrixMath.scaleMat3(transform.scale.x, transform.scale.y),
                                                                  matrixMath.translateMat3(transform.origin.x, transform.origin.y));
    }
}
