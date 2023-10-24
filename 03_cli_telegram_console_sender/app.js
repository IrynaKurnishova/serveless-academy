const { program } = require('commander');
const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, {polling: true});
const fileOptions = { contentType: 'application/octet-stream' }

program
    .version('1.0.0')
    .description('Usage: app [options] [command]');

program
    .command('send-message <message>')
    .description('Send message to Telegram Bot')
    .action((message) => {
        bot.sendMessage(chatId, `${message}`)
            .then(() => {
                process.exit(0)
            })
            .catch((err) => {
                console.log(err)
                process.exit(1)
            })
    });

program
    .command('send-photo <path>')
    .description('Send photo to Telegram Bot. Just specify the path to the file to console after p flag ')
    .action((path) => {
        bot.sendPhoto(chatId, path,  {}, fileOptions)
            .then(() => {
                console.log('Photo has sent successfully')
                process.exit(0)
            })
            .catch((err) => {
                console.log(err, 'Photo hasn\'t sent')
                process.exit(1)
            })
    });

program.parse(process.argv);
