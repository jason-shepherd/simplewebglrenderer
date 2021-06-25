var matrixMath = {
    dotProduct: function(vectorA, vectorB) {
        let product = 0;
        for(let i = 0; i < vectorA.length; i++) {
            product += vectorA[i] * vectorB[i];
        }
        return product;
    },

    identityMat3: function() {
        return [1, 0, 0, 0, 1, 0, 0, 0, 1];
    },

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

    multiplySeriesMat3: function(...matrices) {
        let product = matrices[0]
        for(let i = 1; i < matrices.length; i++) {
            product = this.multiplyMat3(product, matrices[i]);
        }
        return product;
    },

    scaleMat3: function(sx, sy) {
        return new Float32Array([sx, 0, 0, 0, sy, 0, 0, 0, 1]);
    },

    rotateMat3: function(angle) {
        return new Float32Array([Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1]);
    },

    translateMat3: function(tx, ty) {
        return new Float32Array([1, 0, 0, 0, 1, 0, tx, ty, 1]);
    },

    projectionMat3: function(width, height) {
        return new Float32Array([2/width, 0, 0, 0, -2/height, 0, -1, 1, 1]);
    }
}
