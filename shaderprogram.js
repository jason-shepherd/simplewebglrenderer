function ShaderProgram(glObject) {
    var gl = glObject;
    var program;
    var attribs = {};
    var uniforms = {};

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

    var getUniforms = function() {
        let getUniformSetter = function(uniformInfo) {
            const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]');
             switch(uniformInfo.type) {
                case (gl.FLOAT && isArray):
                    return function(data) { gl.uniform1fv(location, data); };
                    break;
                case (gl.FLOAT):
                    return function(data) { gl.uniform1f(location, data); };
                case (gl.FLOAT_VEC2):
                    return function(data) { gl.uniform2fv(location, data); };
                case (gl.FLOAT_VEC3):
                    return function(data) { gl.uniform3fv(location, data); };
                case (gl.FLOAT_VEC4):
                    return function(data) { gl.uniform4fv(this.location, data); };
                case (gl.INT && isArray):
                    return function(data) { gl.uniform1iv(location, data); };
                case (gl.INT):
                    return function(data) { gl.uniform1i(location, data); };
                case (gl.INT_VEC2):
                    return function(data) { gl.uniform2iv(location, data); };
                case (gl.INT_VEC3):
                    return function(data) { gl.uniform3iv(location, data); };
                case (gl.INT_VEC4):
                    return function(data) { gl.uniform4iv(location, data); };
                case (gl.BOOL):
                    return function(data) { gl.uniform1iv(location, data); };
                case (gl.BOOL_VEC2):
                    return function(data) { gl.uniform2iv(location, data); };
                case (gl.BOOL_VEC3):
                    return function(data) { gl.uniform3iv(location, data); };
                case (gl.BOOL_VEC4):
                    return function(data) { gl.uniform4iv(location, data); };
                case (gl.FLOAT_MAT2):
                    return function(data) { gl.uniformMatrix2fv(location, false, data); };
                case (gl.FLOAT_MAT3):
                    return function(data) { gl.uniformMatrix3fv(this.location, false, data); };
                case (gl.FLOAT_MAT4):
                    return function(data) { gl.uniformMatrix4fv(location, false, data); };
                default:
                    throw new Error("Unsupported uniform type in shader.");
            }
        }

        let numOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for(let i = 0; i < numOfUniforms; i++) {
            const uniformInfo = gl.getActiveUniform(program, i);
            if(!uniformInfo)
                break;

            let location = gl.getUniformLocation(program, uniformInfo.name);
            uniforms[uniformInfo.name] = {location: location, type: uniformInfo.type, fill: getUniformSetter(uniformInfo)};
        }
    }

    var getAttributes = function() {
        attribs = {};
        
        const numOfAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        
        for(let i = 0; i < numOfAttribs; i++) {
            const attribInfo = gl.getActiveAttrib(program, i);
            if(!attribInfo) {
                break;
            }

            let location = gl.getAttribLocation(program, attribInfo.name);
            let buffer = gl.createBuffer();
            let fillFunction = function(attribData) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, attribData.data, gl.STATIC_DRAW);
                gl.vertexAttribPointer(this.location, attribData.length, gl.FLOAT, attribData.normalize, 0, 0);
                gl.enableVertexAttribArray(this.location);
            }

            attribs[attribInfo.name] = {location: location, type: attribInfo.type, buffer: buffer, fill: fillFunction};
        }

    }

    this.createProgram = function(vertexShaderId, fragmentShaderId) {
        const vertexShader = createShaderFromScript(vertexShaderId, gl.VERTEX_SHADER);
        const fragmentShader = createShaderFromScript(fragmentShaderId, gl.FRAGMENT_SHADER);

        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        getAttributes();
        getUniforms();
    }

    this.use = function() {
        gl.useProgram(program);
    }

    this.fillUniforms = function(uniformsData) {
        Object.keys(uniforms).forEach((uniformName) => {
            if(uniformName in uniformsData) {
                uniforms[uniformName].fill(uniformsData[uniformName]);
            }
        });
    }

    this.fillAttribs = function(attribsData) {
        Object.keys(attribs).forEach((attribName) => {
            if(attribName in attribsData) {
                attribs[attribName].fill(attribsData[attribName]);
            }
        });
    }
}
