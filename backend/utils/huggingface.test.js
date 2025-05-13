const { areSentencesSimilar } = require('./huggingface');

// Improved mock to return different embeddings based on input sentence
// and simulate semantic similarity for specific cases
jest.mock('@xenova/transformers', () => ({
    pipeline: jest.fn(() => {
        return async (sentence) => {
            const normalized = sentence.toLowerCase().trim();
            if (normalized === 'the quick brown fox') {
                return [[0.1, 0.2, 0.3]];
            } else if (normalized === 'a fast dark fox') {
                // Adjusted to be closer to 'the quick brown fox' for higher cosine similarity
                return [[0.1, 0.205, 0.305]];
            } else if (normalized === 'milton') {
                return [[0.05, 0.1, 0.15]];
            } else if (normalized === 'miltoon') {
                return [[0.051, 0.101, 0.151]]; // close to 'milton'
            } else if (normalized === 'apple') {
                return [[0.5, 0.6, 0.7]];
            } else {
                // Simple mock: return embedding vector based on sentence length and char codes sum
                const baseValue = sentence.length + sentence.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                const embedding = Array(3).fill(0).map((_, i) => (baseValue + i) * 0.01);
                return [embedding];
            }
        };
    }),
}));

describe('areSentencesSimilar', () => {
    jest.setTimeout(30000); // Increase timeout for async calls

    test('exact match returns true', async () => {
        const result = await areSentencesSimilar('Milton', 'Milton', 0.7, true);
        expect(result).toBe(true);
    });

    test('close typo within Levenshtein distance returns true', async () => {
        const result = await areSentencesSimilar('Milton', 'Miltoon', 0.7, true);
        expect(result).toBe(true);
    });

    test('different words returns false', async () => {
        const result = await areSentencesSimilar('Milton', 'Apple', 0.7, true);
        expect(result).toBe(false);
    });

    test('semantically similar sentences returns true', async () => {
        const result = await areSentencesSimilar('The quick brown fox', 'A fast dark fox', 0.7, true);
        expect(result).toBe(true);
    });

    test('empty strings returns true', async () => {
        const result = await areSentencesSimilar('', '', 0.7, true);
        expect(result).toBe(true);
    });
});
