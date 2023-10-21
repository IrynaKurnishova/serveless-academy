const fs = require('fs')
const readline = require('readline')

const outputQuestion = {
    firstQ: 'Hello. Enter 10 words or digits dividing them in spaces: ',
    secondQ: 'How would you like to sort values: \n'+
        '1. Words by name (from A to Z). \n'+
        '2. Show numbers from the smallest. \n'+
        '3. Show numbers from the biggest. \n'+
        '4. Words by quantity of letters. \n'+
        '5. Show only unique words. \n'+
        '6. Unique values from the set of words and numbers. \n'+
        'Select (1 - 6) and press ENTER \n'+
        ' To exit the program type "exit" and press ENTER \n'
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function askQuestion(questionText, callback) {
    rl.question(questionText, callback);
}

function outputToConsole(outputText) {
    rl.output.write(outputText + '\n');
}

function handleUserResponse(input) {
    if (input === 'exit') {
        rl.close();
    } else {
        fs.writeFile('./docs/usersResponse.txt', `${input}`, () => {
            askQuestion(outputQuestion.secondQ, handleFilterCaseFromUser);
        });
    }
}

function handleFilterCaseFromUser(input) {
    fs.readFile('./docs/usersResponse.txt', (err, data) => {
        if (err) {
            outputToConsole(err);
        }
        filterValues(data.toString(), input.toString())
    })
}

function filterValues(dataString, usersCase) {
    const valuesArr = dataString.split(' ');
    const words = valuesArr.filter(item => isNaN(item));
    const numbers = valuesArr.filter(item => !isNaN(item)).map(Number);
    switch (usersCase) {
        case '1':
            words.sort();
            outputToConsole(words);
            break;

        case '2':
            numbers.sort();
            outputToConsole(numbers);
            break;

        case '3':
            numbers.sort((prev, next) => next - prev);
            outputToConsole(numbers);
            break;

        case '4':
            words.sort((prev, next) => prev.length - next.length);
            outputToConsole(words);
            break;

        case '5':
            const uniqueWords = [...new Set(words)];
            outputToConsole(uniqueWords);
            break;

        case '6':
            const wordIncludesNumbersAndLetters = words.filter(word => word.match(/[a-zA-Z]/) && word.match(/\d/));
            outputToConsole(wordIncludesNumbersAndLetters)
            break;

        case 'exit':
            rl.close()
            return;
    }
    askQuestion(outputQuestion.firstQ, handleUserResponse)
}

askQuestion(outputQuestion.firstQ, handleUserResponse)


