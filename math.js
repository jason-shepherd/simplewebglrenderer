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
        let product = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        product[0] = matrixA[0] * matrixB[0] + matrixA[1] * matrixB[3] + matrixA[2] * matrixB[6];
        product[1] = matrixA[0] * matrixB[1] + matrixA[1] * matrixB[4] + matrixA[2] * matrixB[7];
        product[2] = matrixA[0] * matrixB[2] + matrixA[1] * matrixB[5] + matrixA[2] * matrixB[8];

        product[3] = matrixA[3] * matrixB[0] + matrixA[4] * matrixB[3] + matrixA[5] * matrixB[6];
        product[4] = matrixA[3] * matrixB[1] + matrixA[4] * matrixB[4] + matrixA[5] * matrixB[7];
        product[5] = matrixA[3] * matrixB[2] + matrixA[4] * matrixB[5] + matrixA[5] * matrixB[8];

        product[6] = matrixA[6] * matrixB[0] + matrixA[7] * matrixB[3] + matrixA[8] * matrixB[6];
        product[7] = matrixA[6] * matrixB[1] + matrixA[7] * matrixB[4] + matrixA[8] * matrixB[7];
        product[8] = matrixA[6] * matrixB[2] + matrixA[7] * matrixB[5] + matrixA[8] * matrixB[8];

        return product;
    },

    multiplySeriesMat3: function(...matrices) {
        let product = matrices[0]
        for(let i = 1; i < matrices.length; i++) {
           product = this.multiplyMat3(matrices[i], product);
        }
        return product;
    },

    scaleMat3: function(xScale, yScale) {
        return [xScale, 0, 0, 0, yScale, 0, 0, 0, 1];
    },

    rotateMat3: function(angle) {
        return [Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1];
    },

    translateMat3: function(xTranslate, yTranslate) {
        return [1, 0, xTranslate, 0, 1, yTranslate, 0, 0, 1];
    }
}
