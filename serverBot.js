let TelegramBot = require('node-telegram-bot-api');

let token = '201017974:AAFEXs-5MOchzq4auJQq1RETPenoRNPXXYw';

// Setup polling way
//let bot = new TelegramBot(token, {polling: true});

// setup webHook
let bot = new TelegramBot(token);
bot.setWebHook('https://alesia-telegram-bot.herokuapp.com/' + bot.token);

console.log('bot server started...');

/*
// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, (msg, match) => {
  let fromId = msg.from.id;
  let resp = match[1];
  bot.sendMessage(fromId, resp);
});

// Any kind of message
bot.on('message', (msg) => {
  let chatId = msg.chat.id;

  // photo can be: a file path, a stream or a Telegram file_id
  let photo = 'assets/baba.jpg';
  bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});


});
*/

let password = '1459';

let managerIds = [];

let recipientId = 0;


//==============Команды для менеджера=============

bot.onText(/\/login (.+)/, (msg, match) => {
  let chatId = msg.chat.id;

  let resp = match[1];
  if (resp == password) {
    let index = managerIds.indexOf(chatId);
    if (index == -1) {
      managerIds.push(chatId);
      bot.sendMessage(chatId, 'Таки вы менеджер!');
    } else {
      bot.sendMessage(chatId, 'Та шо вы беспокоитесь, менеджер вы, менеджер...');
    }
  }
});

bot.onText(/\/logout/, (msg, match) => {
  let chatId = msg.chat.id;

  let index = managerIds.indexOf(chatId);
  if (index != -1) {
    managerIds.splice(index, 1);
    bot.sendMessage(chatId, 'Таки вы уже не менеджер, ариведерчи!');
  }
});

bot.onText(/\/send_to (\d+)/, (msg, match) => {
  let chatId = msg.chat.id;

  let index = managerIds.indexOf(chatId);
  if (index != -1) {
    let id = match[1];
    recipientId = id;
    bot.sendMessage(chatId, 'Сообщения уходят пользователю id=' + recipientId);
  }
});


//=========== перенаправление сообщений ========
bot.on('message', (msg) => {
  let chatId = msg.chat.id;
  if (!managerIds.length)
    return;

  let index = managerIds.indexOf(chatId);
  if (index != -1) {
    if (recipientId) {
      if (msg.text)
        bot.sendMessage(recipientId, msg.text);
    }
  } else {
    if (recipientId != chatId) {
      recipientId = chatId;
      bot.sendMessage(managerIds[0], 'Сообщения уходят пользователю id=' + recipientId);
    }
    bot.forwardMessage(managerIds[0], chatId, msg.message_id);
  }
});

module.exports = bot;