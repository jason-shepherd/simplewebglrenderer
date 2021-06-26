/** Helper functions for creating and manipulating matrices */
var matrixMath = {
    /** Computes the dotProduct of two vectors.
     * @param {Float32Array} vectorA - first vector.
     * @param {Float32Array} vectorB - second vector.
     */
    dotProduct: function(vectorA, vectorB) {
        let product = 0;
        for(let i = 0; i < vectorA.length; i++) {
            product += vectorA[i] * vectorB[i];
        }
        return product;
    },
    
    /** Creates and returns 3x3 identity matrix */
    identityMat3: function() {
        return [1, 0, 0, 0, 1, 0, 0, 0, 1];
    },

    /** Multiplies two 3x3 matrices together.
     * @param {Float32Array} matrixA - first 3x3 matrix.
     * @param {Float32Array} matrixB - second 3x3 matrix.
     */
    multiplyMat3: function(matrixA, matrixB) {
        return new Float32Array([
            matrixB[0] * matrixA[0] + matrixB[1] * matrixA[3] + matrixB[2] * matrixA[6],
            matrixB[0] * matrixA[1] + matrixB[1] * matrixA[4] + matrixB[2] * matrixA[7],
            matrixB[0] * matrixA[2] + matrixB[1] * matrixA[5] + matrixB[2] * matrixA[8],

            matrixB[3] * matrixA[0] + matrixB[4] * matrixA[3] + matrixB[5] * matrixA[6],
            matrixB[3] * matrixA[1] + matrixB[4] * matrixA[4] + matrixB[5] * matrixA[7],
            matrixB[3] * matrixA[2] + matrixB[4] * matrixA[5] + matrixB[5] * matrixA[8],

            matrixB[6] * matrixA[0] + matrixB[7] * matrixA[3] + matrixB[8] * matrixA[6],
            matrixB[6] * matrixA[1] + matrixB[7] * matrixA[4] + matrixB[8] * matrixA[7],
            matrixB[6] * matrixA[2] + matrixB[7] * matrixA[5] + matrixB[8] * matrixA[8],
        ]);
    },

    /** Multiplies a all inputted matrices */
    multiplySeriesMat3: function(...matrices) {
        let product = matrices[0]
        for(let i = 1; i < matrices.length; i++) {
            product = this.multiplyMat3(product, matrices[i]);
        }
        return product;
    },

    /** Creates and returns 3x3 scale matrix.
     * @param {number} sx - x scale factor.
     * @param {number} sy - y scale factor.
     */
    scaleMat3: function(sx, sy) {
        return new Float32Array([sx, 0, 0, 0, sy, 0, 0, 0, 1]);
    },

    /** Creates and returns 3x3 rotate matrix.
     * @param {number} rad - amount in radians to rotate.
     */
    rotateMat3: function(rad) {
        return new Float32Array([Math.cos(rad), -Math.sin(rad), 0, Math.sin(rad), Math.cos(rad), 0, 0, 0, 1]);
    },

    /** Creates and returns a 3x3 rotate matrix.
     * @param {number} deg - amount in degrees to rotate.
     */
    rotateDegreeMat3: function(deg) {
        return this.rotateMat3(this.degToRad(deg));
    },

    /** Creates and returns 3x3 translation matrix.
     * @param {number} tx - x translation position.
     * @param {number} ty - y translation position.
     */
    translateMat3: function(tx, ty) {
        return new Float32Array([1, 0, 0, 0, 1, 0, tx, ty, 1]);
    },

    /** Creates and returns a 3x3 projection matrix that transforms screen space to clip space.
     * @param {number} width - width of screen space.
     * @param {number} height - height of screen space.
     */
    projectionMat3: function(width, height) {
        return new Float32Array([2/width, 0, 0, 0, -2/height, 0, -1, 1, 1]);
    },

    /** Converts and returns degrees to radians.
     * @param {number} deg - amount in degrees.
     */
    degToRad: function(deg) {
        return deg * (Math.PI/180);
    },

    /** Converts and returns radians to degrees
     * @param {number} rad - amount in radians.
     */
    radToDeg: function(rad) {
        return rad / (Math.PI / 180);
    }
}
