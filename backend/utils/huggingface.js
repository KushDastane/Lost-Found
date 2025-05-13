const { pipeline } = require('@xenova/transformers');

let extractor = null;

function normalizeVector(vec) {
    const magnitude = Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
    if (magnitude === 0) return vec;
    return vec.map(val => val / magnitude);
}

// Cosine similarity function
function cosineSimilarity(vecA, vecB) {
    const normA = normalizeVector(vecA);
    const normB = normalizeVector(vecB);
    const dotProduct = normA.reduce((acc, val, i) => acc + val * normB[i], 0);
    return dotProduct;
}

// Initialize the extractor pipeline once
async function getExtractor() {
    if (!extractor) {
        try {
            extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        } catch (error) {
            console.error("Error initializing extractor pipeline:", error);
            throw error;
        }
    }
    return extractor;
}

async function getSentenceEmbedding(sentence) {
    try {
        const extractor = await getExtractor();
        const output = await extractor(sentence);
        if (!output || !output[0]) {
            console.error("Invalid output from extractor:", output);
            return null;
        }
        // output shape: [1][sequence_length][embedding_length]
        // Convert Tensor to array
        const tokenEmbeddingsTensor = output[0];

        function tensorToArray(tensor) {
            const { data, dims } = tensor;
            if (!data || !dims || dims.length !== 2) {
                console.error("Invalid tensor format for conversion:", tensor);
                return null;
            }
            const [rows, cols] = dims;
            const arr = [];
            for (let i = 0; i < rows; i++) {
                const row = [];
                for (let j = 0; j < cols; j++) {
                    row.push(data[i * cols + j]);
                }
                arr.push(row);
            }
            return arr;
        }

        let tokenEmbeddings;
        if (tokenEmbeddingsTensor.toArray && typeof tokenEmbeddingsTensor.toArray === 'function') {
            tokenEmbeddings = await tokenEmbeddingsTensor.toArray();
        } else if (tokenEmbeddingsTensor.arraySync && typeof tokenEmbeddingsTensor.arraySync === 'function') {
            tokenEmbeddings = tokenEmbeddingsTensor.arraySync();
        } else if (tokenEmbeddingsTensor.data && tokenEmbeddingsTensor.dims) {
            tokenEmbeddings = tensorToArray(tokenEmbeddingsTensor);
        } else {
            console.warn("Tensor does not have toArray or arraySync method, using as is.");
            tokenEmbeddings = tokenEmbeddingsTensor;
        }
        if (!Array.isArray(tokenEmbeddings) || tokenEmbeddings.length === 0) {
            console.error("Invalid token embeddings:", tokenEmbeddings);
            return null;
        }
        const embeddingLength = tokenEmbeddings[0].length;
        const summed = new Array(embeddingLength).fill(0);
        for (const tokenVec of tokenEmbeddings) {
            if (!Array.isArray(tokenVec) || tokenVec.length !== embeddingLength) {
                console.error("Invalid token vector:", tokenVec);
                continue;
            }
            for (let i = 0; i < embeddingLength; i++) {
                const val = tokenVec[i];
                if (typeof val !== 'number' || isNaN(val)) {
                    console.error("Invalid value in token vector:", val);
                    continue;
                }
                summed[i] += val;
            }
        }
        const avgEmbedding = summed.map(val => val / tokenEmbeddings.length);
        if (avgEmbedding.some(val => typeof val !== 'number' || isNaN(val))) {
            console.error("Invalid average embedding:", avgEmbedding);
            return null;
        }
        return avgEmbedding;
    } catch (error) {
        console.error("Error extracting sentence embedding:", error);
        throw error;
    }
}

function levenshteinDistance(a, b) {
    const matrix = [];

    // increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

async function areSentencesSimilar(sentence1, sentence2, threshold = 0.8, debug = false, maxLevenshteinDistance = 2) {
    try {
        const embedding1 = await getSentenceEmbedding(sentence1);
        const embedding2 = await getSentenceEmbedding(sentence2);
        if (!embedding1 || !embedding2) {
            if (debug) {
                console.log("One or both embeddings are null, falling back to exact match.");
            }
            return sentence1.toLowerCase().trim() === sentence2.toLowerCase().trim();
        }
        if (debug) {
            console.log(`Embedding1 for "${sentence1}":`, embedding1);
            console.log(`Embedding2 for "${sentence2}":`, embedding2);
        }
        const similarity = cosineSimilarity(embedding1, embedding2);
        if (debug) {
            console.log(`Similarity between "${sentence1}" and "${sentence2}":`, similarity);
        }
        const levDistance = levenshteinDistance(sentence1.toLowerCase().trim(), sentence2.toLowerCase().trim());
        if (debug) {
            console.log(`Levenshtein distance between "${sentence1}" and "${sentence2}":`, levDistance);
        }
        return similarity >= threshold || levDistance <= maxLevenshteinDistance;
    } catch (error) {
        console.error("Error in local similarity check:", error);
        // Fallback to exact match if error occurs
        return sentence1.toLowerCase().trim() === sentence2.toLowerCase().trim();
    }
}

module.exports = {
    areSentencesSimilar
};
