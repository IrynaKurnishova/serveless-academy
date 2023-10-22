const inquirer = require('inquirer');
const fs = require('fs');
const prompt = inquirer.createPromptModule();

const questions = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter the user\'s name. To cancel press ENTER: ',
    },
    {
        type: 'list',
        name: 'gender',
        message: 'Choose your gender',
        choices: ['Male', 'Female'],
        when: (answers) => answers.name !== '',
    },
    {
        type: 'input',
        name: 'age',
        message: 'Enter your age: ',
        when: (answers) => answers.name !== '',
    },
    {
        type: 'confirm',
        name: 'showDB',
        message: function (answers) {
            if (answers.name === '') return  'Would you like to search values in DB?'
        },
        when: (answers) => answers.name === '',
    },
    {
        type: 'input',
        name: 'searchByName',
        message: function (answers) {
            if (answers.showDB) return 'Enter the user\'s name you want to find in DB: '
        },
        when: (answers) => answers.name === '' && answers.showDB
    }
];

const handleUsersResponse = (answers) => {
    if (answers.searchByName) {
        showDBFile(usersArr => {
            searchUserInDB(usersArr, answers.searchByName)
        })} else {
        recordAnswersToFile(answers);
    }

}

function recordAnswersToFile(answers) {
    const data = JSON.stringify(answers, null);
        if (answers.name !== '') {
            fs.appendFile('./docs/users.txt', data.toLowerCase(), () => {
                prompt(questions).then(handleUsersResponse);
            })
        }
}

function showDBFile(callback) {
    fs.readFile('./docs/users.txt', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const jsonData = data.toString().replace(/}{/g, '}\n{');
            const separatedData = jsonData.split('\n');
            const dataArray= separatedData.map(item => JSON.parse(item));
            callback(dataArray)
        }
    });
}

function searchUserInDB(usersArr, name) {
    const users = usersArr.filter(user => user.name === name.toLowerCase());
    if (users.length > 0) {
        console.log('Found user:', users);
    } else {
        console.log(`User ${name} not found.`);
    }
}

prompt(questions).then(handleUsersResponse);
