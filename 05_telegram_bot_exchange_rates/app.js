const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const {filteredForecast} = require('./weatherUtils');
const {getMonoRates, filteredPrivateRates} = require('./exchangeUtils');

const commands = [
    {
        name: "/start",
        response: "Hello choose your command",
        values: ["/exchange rates", "/weather forecast"],
    }, {
        name: "Previous menu",
        response: "Please, choose your command",
        values: ["/exchange rates", "/weather forecast"]
    },{
        name:"/exchange rates",
        response: "Please, choose your currency",
        values: ["USD", "EUR", "Previous menu"],
    },{
        name:"/weather forecast",
        response: "Please, choose something",
        values: ["for every 3 hours", "for every 6 hours", "wind", "Previous menu" ]
}];

commands.forEach(command => {
    bot.onText(new RegExp(`^${command.name}$`), (msg) => {
        bot.sendMessage(msg.chat.id, `${command.response}`, {
            "reply_markup": {
                "keyboard": [command.values]
            }
        });
    });
});

const messages = [
    {
        name: "for every 3 hours",
        interval: 3
    },
    {
        name: "for every 6 hours",
        interval: 6
    },
    {
        name: "wind",
        interval: "wind"
    },
    {
        name: "usd",
        code: 840
    },
    {
        name: "eur",
        code: 978
    },
]

bot.on('message', async (msg) => {
    for (const message of messages) {
        if (message.name.includes(msg.text.toString().toLowerCase())) {
            const result = await getResult(msg.text, message);
            bot.sendMessage(msg.chat.id, `${result}`);
        }
    }
});

 async function getResult(messageText, message) {
     if (!message.code) {
         const result =  await filteredForecast(message.interval)
         return result;
     } else {
         const resultMono =  await getMonoRates(message.code, message.name)
         const resultPrivate = await filteredPrivateRates(message.name)
         return `${resultMono}\n\n ${resultPrivate}`;
     }
 }
