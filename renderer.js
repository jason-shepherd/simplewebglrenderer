function Renderer(canvas) {
    /** @type {WebGLRenderingContext} */
    var gl = canvas.getContext("webgl");
    
    var program;

    var attribs = {};
    var uniforms = {};
    var bufferInfo = {};

    var globalUniformData = {};
    var buffers = {};

    var objectsToDraw = [];

    var createShaderFromScript = function(sourceId, type) {
        const sourceScript = document.getElementById(sourceId);
        if(!sourceScript)
            throw new Error("Invalid source id for shader.");
        let source = sourceScript.text

        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        return shader;
    }

    var createProgramFromScript = function(vertexShaderId, fragmentShaderId) {
        const vertexShader = createShaderFromScript(vertexShaderId, gl.VERTEX_SHADER);
        const fragmentShader = createShaderFromScript(fragmentShaderId, gl.FRAGMENT_SHADER);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);
        return program;
    }

    //Get uniforms from shader program
    //TODO add "fill" function to uniform object
    var getUniforms = function() {
        uniforms = {};
        const numOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for(let i = 0; i < numOfUniforms; i++) {
            const uniformInfo = gl.getActiveUniform(program, i);
            if(!uniformInfo) {
                break;
            }
            
            let location = gl.getUniformLocation(program, uniformInfo.name);
            uniforms[uniformInfo.name] = {type: uniformInfo.type};
            uniforms[uniformInfo.name].location = location;
            
            let fillFunction;
            const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]');
            switch(uniformInfo.type) {
                case (gl.FLOAT && isArray):
                    fillFunction = (data) => { gl.uniform1fv(location, data); };
                    break;
                case (gl.FLOAT):
                    fillFunction = (data) => { gl.uniform1fv(location, data); };
                    break;
                case (gl.FLOAT_VEC2):
                    fillFunction = (data) => { gl.uniform2fv(location, data); };
                    break;
                case (gl.FLOAT_VEC3):
                    fillFunction = (data) => { gl.uniform3fv(location, data); };
                    break;
                case (gl.FLOAT_VEC4):
                    fillFunction = (data) => { gl.uniform4fv(location, data); };
                    break;
                case (gl.INT && isArray):
                    fillFunction = (data) => { gl.uniform1iv(location, data); };
                    break;
                case (gl.INT):
                    fillFunction = (data) => { gl.uniform1i(location, data); };
                    break;
                case (gl.INT_VEC2):
                    fillFunction = (data) => { gl.uniform2iv(location, data); };
                    break;
                case (gl.INT_VEC3):
                    fillFunction = (data) => { gl.uniform3iv(location, data); };
                    break;
                case (gl.INT_VEC4):
                    fillFunction = (data) => { gl.uniform4iv(location, data); };
                    break;
                case (gl.BOOL):
                    fillFunction = (data) => { gl.uniform1iv(location, data); };
                    break;
                case (gl.BOOL_VEC2):
                    fillFunction = (data) => { gl.uniform2iv(location, data); };
                    break;
                case (gl.BOOL_VEC3):
                    fillFunction = (data) => { gl.uniform3iv(location, data); };
                    break;
                case (gl.BOOL_VEC4):
                    fillFunction = (data) => { gl.uniform4iv(location, data); };
                    break;
                case (gl.FLOAT_MAT2):
                    fillFunction = (data) => { gl.uniformMatrix2fv(location, false, data); };
                    break;
                case (gl.FLOAT_MAT3):
                    fillFunction = (data) => { gl.uniformMatrix3fv(location, false, data); };
                    break;
                case (gl.FLOAT_MAT4):
                    fillFunction = (data) => { gl.uniformMatrix4fv(location, false, data); };
                    break;
                default:
                    throw new Error("Unsupported uniform type in shader.");

            }
            uniforms[uniformInfo.name].fillUniform = fillFunction;
        }

        return uniforms;
    }

    //Get attribs from shader program
    //TODO figure out how we want to populate buffers
    var getAttributes = function() {
        attribs = {};
        const numOfAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        
        for(let i = 0; i < numOfAttribs; i++) {
            const attribInfo = gl.getActiveAttrib(program, i);
            if(!attribInfo) {
                break;
            }

            attribs[attribInfo.name] = {};
            attribs[attribInfo.name].location = gl.getAttribLocation(program, attribInfo.name);
            attribs[attribInfo.name].buffer = gl.createBuffer();
            attribs[attribInfo.name].fillAttrib = function(attribData) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, attribData.data, gl.STATIC_DRAW);
                gl.vertexAttribPointer(this.location, attribData.length, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(this.location);
            }
        }
        return attribs;
    }

    //TODO fill buffers with data
    var fillAttribs = function(buffersData) {
        Object.keys(attribs).forEach((attribName) => {
            if(attribName in buffersData) {
                attribs[attribName].fillAttrib(buffersData[attribName]);
            }
        });
    }
    
    //TODO fill uniforms with data
    var fillUniforms = function(uniformsData) {
        Object.keys(uniforms).forEach((uniformName) => {
            if(uniformName in uniformsData) {
                uniforms[uniformName].fillUniform(uniformsData[uniformName]);
            }
        });
    }

    //TODO replace old code with new helper functions
    this.init = function() {
        program = createProgramFromScript('shader-vs', 'shader-fs');

        getAttributes();
        getUniforms();
    }

    //TODO look for better way to do this
    this.toDraw = function(object) {
        objectsToDraw.push(object);
    }

    //TODO replace old code with new helper functions
    this.render = function() {
        gl.useProgram(program);

        objectsToDraw.forEach((object) => {
            fillAttribs(object.attribData);
            fillUniforms(object.uniformData);

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
}

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
