const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const pterodactylApiUrl = 'https://pterodactyl.example.com/api/application';
const pterodactylApiKey = 'YOUR_PTERODACTYL_API_KEY';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/checkuser (.+)/, async (msg, match) => {
  const username = match[1];

  try {
    const response = await axios.get(
      `${pterodactylApiUrl}/users`,
      { headers: { Authorization: `Bearer ${pterodactylApiKey}` } }
    );

    const users = response.data.data;
    const foundUser = users.find((user) => user.attributes.username === username);

    if (foundUser) {
      bot.sendMessage(msg.chat.id, `User ${username} sudah terdaftar.`);
    } else {
      bot.sendMessage(msg.chat.id, `User ${username} belum terdaftar.`);
    }
  } catch (error) {
    console.error('Error checking user:', error);
    bot.sendMessage(msg.chat.id, 'Gagal melakukan pengecekan user.');
  }
});

bot.onText(/\/checkadmin (.+)/, async (msg, match) => {
  const adminUsername = match[1];

  try {
    const response = await axios.get(
      `${pterodactylApiUrl}/administrators`,
      { headers: { Authorization: `Bearer ${pterodactylApiKey}` } }
    );

    const admins = response.data.data;
    const foundAdmin = admins.find((admin) => admin.attributes.username === adminUsername);

    if (foundAdmin) {
      bot.sendMessage(msg.chat.id, `Admin ${adminUsername} sudah terdaftar.`);
    } else {
      bot.sendMessage(msg.chat.id, `Admin ${adminUsername} belum terdaftar.`);
    }
  } catch (error) {
    console.error('Error checking admin:', error);
    bot.sendMessage(msg.chat.id, 'Gagal melakukan pengecekan admin.');
  }
});

console.log('Bot is running...');
