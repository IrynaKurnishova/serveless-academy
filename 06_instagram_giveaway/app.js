const fs = require('fs').promises;
const path = require('path');
const directoryPath = './2kk_words_400x400';
const {uniqueValues, existInAllFiles, existInAtLeastTen} = require('./functions')

async function mainProgram() {
    try {
        const arrOfAllFilesArr = await readAllFiles();
        if (arrOfAllFilesArr) {
            const uniqueWords = uniqueValues(arrOfAllFilesArr.flat())
            const uniqueWordsExistsInAllFiles = existInAllFiles(arrOfAllFilesArr)
            const uniqueWordsExistsIn10Files = existInAtLeastTen(arrOfAllFilesArr)
            console.log(uniqueWords.length)
            console.log(uniqueWordsExistsInAllFiles.length)
            console.log(uniqueWordsExistsIn10Files.length)
        }
    } catch (error) {
        console.error('Error while reading the files:', error);
    }
}

async function readAllFiles() {
    try {
        const files = await fs.readdir(directoryPath);
        const allFileContents = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(directoryPath, file);
                const data = await fs.readFile(filePath, 'utf8');
                return data.split('\n');
            })
        );
        return allFileContents;
    } catch (error) {
        throw error;
    }
}

mainProgram();
