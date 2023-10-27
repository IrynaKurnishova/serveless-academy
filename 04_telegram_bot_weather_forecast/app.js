const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
const {getSearchResults, responseToUser} = require('./utils')

const keyboardStart = {
    reply_markup: {
        keyboard: [
            [{ text: 'Forecast in Kharkiv' }],
        ],
        one_time_keyboard: true,
    },
};

const keyboardIntervals = {
    reply_markup: {
        keyboard: [
            [{ text: 'At intervals of 3 hours' }],
            [{ text: 'At intervals of 6 hours' }]
        ],
        one_time_keyboard: true,
    },
};

const commandActions = {
    'Forecast in Kharkiv': sendIntervalChoice,
    'At intervals of 3 hours': sendWeatherMessage(3),
    'At intervals of 6 hours': sendWeatherMessage(6)
};

function sendIntervalChoice(chatId) {
    bot.sendMessage(chatId, 'Choose interval', keyboardIntervals);
}

function sendWeatherMessage(interval) {
    return async (chatId) => {
        console.log(chatId)
        const result = await getSearchResults();
        const filteredData = interval === 6 ? result.filter((_, index) => index % 2 === 0) : result;
        const mainMessage = filteredData.map((data) => {
            return `Time: ${data.time.split(" ")[1]}\nTemperature: ${data.temperature}\nPrecipitation: ${data.precipitation}\n\n`
        }).join('\n');
        const response = responseToUser(mainMessage);
        bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
    }
}

bot.onText(/\/start/, ({ chat }) => {
    const chatId = chat.id;
    bot.sendMessage(chatId, 'Choose forecast', keyboardStart);
});

bot.on('message', async ({ chat, text }) => {
    const chatId = chat.id;
    if (commandActions[text]) {
        commandActions[text](chatId)
    }
});


