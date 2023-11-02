const axios = require('axios')

const endpoints = [
'https://jsonbase.com/sls-team/json-793',
'https://jsonbase.com/sls-team/json-955',
'https://jsonbase.com/sls-team/json-231',
'https://jsonbase.com/sls-team/json-931',
'https://jsonbase.com/sls-team/json-93',
'https://jsonbase.com/sls-team/json-342',
'https://jsonbase.com/sls-team/json-770',
'https://jsonbase.com/sls-team/json-491',
'https://jsonbase.com/sls-team/json-281',
'https://jsonbase.com/sls-team/json-718',
'https://jsonbase.com/sls-team/json-310',
'https://jsonbase.com/sls-team/json-806',
'https://jsonbase.com/sls-team/json-469',
'https://jsonbase.com/sls-team/json-258',
'https://jsonbase.com/sls-team/json-516',
'https://jsonbase.com/sls-team/json-79',
'https://jsonbase.com/sls-team/json-706',
'https://jsonbase.com/sls-team/json-521',
'https://jsonbase.com/sls-team/json-350',
'https://jsonbase.com/sls-team/json-64'
]

async function makeRequests() {
    let trueCount = 0;
    let falseCount = 0;

    for (const endpoint of endpoints) {
        let response;
        let retries = 3;

        while (retries > 0) {
            try {
                response = await axios.get(endpoint);
                const isDone = findIsDone(response.data);
                if (isDone !== null) {
                    console.log('[Success]', endpoint, `isDone - ${isDone}`);
                    if (isDone === true) {
                        trueCount++;
                    } else if (isDone === false) {
                        falseCount++;
                    }
                    break;
                } else {
                    console.error('[Fail]', endpoint, 'isDone key not found');
                    break;
                }
            } catch (error) {
                console.error('[Fail]', endpoint, error.message);
                retries--;
            }
        }

        if (retries === 0) {
            console.error('[Fail]', `${endpoint}: The endpoint is unavailable`);
        }
    }

    console.log(`Found True values: ${trueCount}`);
    console.log(`Found False values: ${falseCount}`);
}


function findIsDone(data) {
    if (typeof data === 'object' && data !== null) {
        if ('isDone' in data) {
            return data.isDone;
        } else {
            for (const key in data) {
                const result = findIsDone(data[key]);
                if (result !== null) {
                    return result;
                }
            }
        }
    }
    return null;
}

makeRequests();
