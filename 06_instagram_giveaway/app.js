const fs = require('fs');
const path = require('path');
const directoryPath = './2kk_words_400x400';
const {uniqueValues, existInAllFiles, existInAtLeastTen} = require('./functions')

function mainProgram() {
    try {
        const arrOfAllFilesArr = readAllFiles();
        if (arrOfAllFilesArr) {
            const uniqueWords = uniqueValues(arrOfAllFilesArr.flat());
            const uniqueWordsExistsInAllFiles = existInAllFiles(arrOfAllFilesArr);
            const uniqueWordsExistsIn10Files = existInAtLeastTen(arrOfAllFilesArr);

            console.log(`Unique values: ${uniqueWords.length}`);
            console.log(`Values exist in all files: ${uniqueWordsExistsInAllFiles.length}`);
            console.log(`Values exist in at least ten files: ${uniqueWordsExistsIn10Files.length}`);
        }
    } catch (error) {
        console.error('Error while reading the files:', error);
    }
}

function readAllFiles() {
    try {
        const files = fs.readdirSync(directoryPath);
        const allFileContents = files.map(file => {
            const filePath = path.join(directoryPath, file);
            const data = fs.readFileSync(filePath, 'utf8');
            return data.split('\n');
        });
        return allFileContents;
    } catch (error) {
        throw error;
    }
}

mainProgram();

