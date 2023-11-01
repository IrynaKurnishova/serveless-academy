const fs = require('fs').promises;

async function main() {
    try {
        const vacationsArray = await readJSONFile();
        const filteredVacationsArray = filterVacations(vacationsArray);
        console.log(JSON.stringify(filteredVacationsArray, null, 2));

    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function readJSONFile() {
    try {
        const data = await fs.readFile('data.json', 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (error) {
        throw error;
    }
}

function filterVacations(vacationsArr) {
    return vacationsArr.reduce((result, userVacation) => {

        const vacationDate = {
            "startDate": userVacation.startDate,
            "endDate": userVacation.endDate
        };

        const userExists = result.some(item => item.userId === userVacation.user._id);

        if (userExists) {
            const user = result.find(item => item.userId === userVacation.user._id);
            user.vacations.push(vacationDate);
        } else {
            result.push({
                "userId": userVacation.user._id,
                "userName": userVacation.user.name,
                "vacations": [vacationDate]
            });
        }

        return result;
    }, []);
}

main();
