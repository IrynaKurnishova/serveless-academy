function uniqueValues(arrOfAllWords) {
    const uniqueSet = new Set(arrOfAllWords);
    return Array.from(uniqueSet);
}

function existInAllFiles(arrOfAllFilesArr) {
    const wordsInAllFiles = new Set(arrOfAllFilesArr[0]);
    for (let i = 1; i < arrOfAllFilesArr.length; i++) {
        const currentWords = new Set(arrOfAllFilesArr[i]);
        wordsInAllFiles.forEach(word => {
            if (!currentWords.has(word)) {
                wordsInAllFiles.delete(word);
            }
        });
    }
    return Array.from(wordsInAllFiles);
}

function existInAtLeastTen(arrOfAllFilesArr) {
    const wordCounts = new Map();
    arrOfAllFilesArr.forEach(wordsArray => {
        const uniqueWords = new Set(wordsArray);
        uniqueWords.forEach(word => {
            if (wordCounts.has(word)) {
                wordCounts.set(word, wordCounts.get(word) + 1);
            } else {
                wordCounts.set(word, 1);
            }
        });
    });

    const wordsInAtLeastTen = Array.from(wordCounts).filter(([, count]) => count >= 10);
    return wordsInAtLeastTen.map(([word]) => word);
}

module.exports = {uniqueValues, existInAllFiles, existInAtLeastTen}
