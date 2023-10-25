const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios')
const token = process.env.TOKEN;
const mapboxAPIKEY = process.env.API_KEY;
const cityName = process.env.CITY;
const bot = new TelegramBot(token, { polling: true });

const keyboard = {
    reply_markup: {
        keyboard: [
            [{ text: 'Forecast in Kharkiv'}],
        ],
        one_time_keyboard: true,
    },
};

const keyboardIntervals =  {
    reply_markup: {
        keyboard: [
            [{ text: 'At intervals of 3 hours' }],
            [{ text: 'At intervals of 6 hours' }]
        ],
        one_time_keyboard: true,
    }
}

const now = new Date();
const stringDate = `${now}\n`;
const messageDate = stringDate.replace("GMT+0200", "")
const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

const responseToUser = (mainMessage) => {
    return `<b>Weather in Kharkiv for the next 24 hours</b>\n\n${messageDate}\n${mainMessage}`
}

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === '/start') bot.sendMessage(chatId, 'Choose forecast', keyboard)
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const result = await getSearchResults();

    if (text === 'Forecast in Kharkiv') {
        bot.sendMessage(chatId, 'Choose interval', keyboardIntervals);

    } else if (text === 'At intervals of 3 hours') {

        const mainMessage = result
            .map((data) => {
                return `Time: ${data.time.split(" ")[1]}\nTemperature (°C): ${data.temperature}\nPrecipitation: ${data.precipitation}\n\n`;
            }).join('\n');
        const response = responseToUser(mainMessage)
        bot.sendMessage(chatId, response, { parse_mode: 'HTML' });

    } else if (text === 'At intervals of 6 hours') {
        const mainMessage = result
            .filter((data, index) => index % 2 === 0)
            .map((data) => {
                return `Time: ${data.time.split(" ")[1]}\nTemperature (°C): ${data.temperature}\nPrecipitation: ${data.precipitation}\n\n`;
            })
            .join('\n');
        const response = responseToUser(mainMessage)
        bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
    }
});


const getSearchResults = async () => {
    try {
        const result = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${mapboxAPIKEY}`
        );

        if (result.data.list) {
            const next24HoursData = result.data.list.filter(item => {
                const itemDate = new Date(item.dt_txt);
                return itemDate >= now && itemDate <= twentyFourHoursLater;
            });

            const filteredTimeAndTemp = next24HoursData.map(item => ({
                time: item.dt_txt.replace(":00", ""),
                temperature: Math.round(item.main.temp - 273.15),
                precipitation: item.weather[0]?.description,
            }));

            return filteredTimeAndTemp;
        } else {
            return [];
        }
    } catch (error) {
        return {error: "An error occurred while creating the report"}
    }
};

