const textForm = document.getElementById('text-form');
const result = document.getElementById('result');


const stopwords = new Set(["a", "an", "the", "is", "to", "of", "and", "in", "that", "it", "as", "for", "with", "on", "this", "at", "by", "from", "be", "are"]);

function tokenize(text) {
    return text.toLowerCase().match(/\b[a-zA-Z]+\b/g) || [];
}

function preprocessText(text) {
    const sentences = text.match(/[^.!?]+[.!?]/g) || [text];
    let wordFrequencies = {};

    sentences.forEach(sentence => {
        let words = tokenize(sentence).filter(word => !stopwords.has(word));

        words.forEach(word => {
            wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
        });
    });

    return { sentences, wordFrequencies };
}

function scoreSentences(sentences, wordFrequencies) {
    let sentenceScores = {};

    sentences.forEach(sentence => {
        let words = tokenize(sentence);
        let score = 0;

        words.forEach(word => {
            if (wordFrequencies[word]) {
                score += wordFrequencies[word];
            }
        });

        sentenceScores[sentence] = score;
    });

    return sentenceScores;
}

function getSummary(text, numSentences) {
    const { sentences, wordFrequencies } = preprocessText(text);
    const sentenceScores = scoreSentences(sentences, wordFrequencies);

    return Object.entries(sentenceScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, numSentences)
        .map(entry => entry[0])
        .join(" ");
}


textForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = new FormData(this);

    result.textContent = getSummary(data.get('text'), data.get('num-sentences'));
})
