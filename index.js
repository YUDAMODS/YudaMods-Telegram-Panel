// By YudaMods
// Taruh Credits
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const figlet = require('figlet');
const chalk = require('chalk');
const fs = require('fs');


const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Token Bot Bisa Di Dapatkan Dari t.me/BotFather
const pterodactylApiUrl = 'https://pterodactyl.example.com/api/application'; // Ganti Domain Lu Tanpa Hapus /api/application
const pterodactylApiKey = 'YOUR_PTERODACTYL_API_KEY'; // Ganti Apikey Panel
const ownerContact = 'YOUR_OWNER_NUMBER'; // Ganti dengan nomor kontak owner yang sebenarnya Format 62
const thumbPath = 'YOUR_URL_THUMB'; // Ganti Dengan Url Img Telegra

const bot = new TelegramBot(token, { polling: true });

// Figlet banner
figlet('YudaMods', (err, data) => {
  if (err) {
    console.error('Error rendering figlet:', err);
    return;
  }
  console.log(chalk.blue(data)); // Menggunakan chalk untuk memberikan warna biru
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const startMessage = "Selamat datang di bot YudaMods!\n\n" +
    "Berikut adalah fitur yang tersedia:\n" +
    "/addserver [Nama Server] - Menambahkan server baru\n" +
    "/adduser [Nama Pengguna] - Menambahkan pengguna baru\n" +
    "/addadmin [Nama Admin] - Menambahkan administrator baru\n" +
    "/checkuser [Nama Pengguna] - Memeriksa keberadaan pengguna\n" +
    "/checkadmin [Nama Admin] - Memeriksa keberadaan administrator\n" +
    "/deleteserver [Nama Server] - Menghapus server\n" +
    "/deleteuser [Nama Pengguna] - Menghapus pengguna\n" +
    "/deleteadmin [Nama Admin] - Menghapus administrator\n" +
    "/owner - Melihat nomor kontak owner\n" +
    "/credits - Memberikan kredit pembuat bot";
  
  bot.sendMessage(chatId, startMessage, {
    thumb: thumbPath,
  });
});

bot.onText(/\/addserver (.+)/, async (msg, match) => {
  try {
    const serverName = match[1];
    const chatId = msg.chat.id;

    if (msg.from.id.toString() !== ownerContact) {
      bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menggunakan perintah ini.');
      return;
    }
    
    const response = await axios.post(`${pterodactylApiUrl}/servers`, {
      name: serverName,
    }, {
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    bot.sendMessage(chatId, `Server ${serverName} berhasil ditambahkan.`, {
      thumb: thumbPath,
    });
  } catch (error) {
    console.error('Error adding server:', error);
    bot.sendMessage(ownerContact, `Error: ${error.message}`);
    bot.sendMessage(chatId, 'Gagal menambahkan server.', {
      thumb: thumbPath,
    });
  }
});

bot.onText(/\/adduser/, async (msg) => {
  try {
    const chatId = msg.chat.id;

    if (msg.from.id.toString() !== ownerContact) {
      bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menggunakan perintah ini.');
      return;
    }
    
    const response = await axios.post(`${pterodactylApiUrl}/users`, null, {
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    bot.sendMessage(chatId, 'Pengguna berhasil ditambahkan.', {
      thumb: thumbPath,
    });
  } catch (error) {
    console.error('Error adding user:', error);
    bot.sendMessage(ownerContact, `Error: ${error.message}`);
    bot.sendMessage(chatId, 'Gagal menambahkan pengguna.', {
      thumb: thumbPath,
    });
  }
});

bot.onText(/\/addadmin (.+)/, async (msg, match) => {
  try {
    const adminUsername = match[1];
    const chatId = msg.chat.id;

    if (msg.from.id.toString() !== ownerContact) {
      bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menggunakan perintah ini.');
      return;
    }
    
    const response = await axios.post(`${pterodactylApiUrl}/users`, {
      username: adminUsername,
    }, {
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    await axios.post(`${pterodactylApiUrl}/users/${response.data.id}/administrative`, null, {
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    bot.sendMessage(chatId, `Administrator ${adminUsername} berhasil ditambahkan.`, {
      thumb: thumbPath,
    });
  } catch (error) {
    console.error('Error adding admin:', error);
    bot.sendMessage(ownerContact, `Error: ${error.message}`);
    bot.sendMessage(chatId, `Gagal menambahkan administrator. Error: ${error.message}`, {
      thumb: thumbPath,
    });
  }
});

bot.onText(/\/checkuser (.+)/, async (msg, match) => {
  try {
    const username = match[1];
    const chatId = msg.chat.id;

    if (msg.from.id.toString() !== ownerContact) {
      bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menggunakan perintah ini.');
      return;
    }

    const response = await axios.get(`${pterodactylApiUrl}/users`, {
      params: {
        filter: `username=${username}`,
      },
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    if (response.data.data.length > 0) {
      bot.sendMessage(chatId, `User ${username} sudah terdaftar.`, {
        thumb: thumbPath,
      });
    } else {
      bot.sendMessage(chatId, `User ${username} belum terdaftar.`, {
        thumb: thumbPath,
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    bot.sendMessage(ownerContact, `Error: ${error.message}`);
    bot.sendMessage(chatId, `Gagal melakukan pengecekan user. Error: ${error.message}`, {
      thumb: thumbPath,
    });
  }
});

bot.onText(/\/checkadmin (.+)/, async (msg, match) => {
  try {
    const adminUsername = match[1];
    const chatId = msg.chat.id;

    // Pastikan hanya owner yang dapat menggunakan perintah ini
    if (msg.from.id.toString() !== ownerContact) {
      bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menggunakan perintah ini.');
      return;
    }
    
    // Implementasi pengecekan keberadaan administrator

    const response = await axios.get(`${pterodactylApiUrl}/users`, {
      params: {
        filter: `username=${adminUsername}`,
      },
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    if (response.data.data.length > 0) {
      bot.sendMessage(msg.chat.id, `Admin ${adminUsername} sudah terdaftar.`);
    } else {
      bot.sendMessage(msg.chat.id, `Admin ${adminUsername} belum terdaftar.`);
    }
  } catch (error) {
    console.error('Error checking admin:', error);
    bot.sendMessage(msg.chat.id, `Gagal melakukan pengecekan admin. Error: ${error.message}`);
  }
});

bot.onText(/\/deleteserver (.+)/, async (msg, match) => {
  try {
    const serverName = match[1];
    const chatId = msg.chat.id;
    
    // Implementasi penghapusan server dari Pterodactyl
    // Sesuaikan dengan endpoint dan payload yang diperlukan oleh API Pterodactyl
    
    if (msg.from.id.toString() !== ownerContact) {
      bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menggunakan perintah ini.');
      return;
    }
    
    const response = await axios.delete(`${pterodactylApiUrl}/servers/${serverName}`, {
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    bot.sendMessage(msg.chat.id, `Server ${serverName} berhasil dihapus.`);
  } catch (error) {
    console.error('Error deleting server:', error);
    bot.sendMessage(msg.chat.id, `Gagal menghapus server. Error: ${error.message}`);
  }
});

bot.onText(/\/deleteuser (.+)/, async (msg, match) => {
  try {
    const username = match[1];
    const chatId = msg.chat.id;
    // Implementasi penghapusan pengguna dari Pterodactyl
    // Sesuaikan dengan endpoint dan payload yang diperlukan oleh API Pterodactyl
    
    if (msg.from.id.toString() !== ownerContact) {
      bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menggunakan perintah ini.');
      return;
      
    }
    const response = await axios.delete(`${pterodactylApiUrl}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    bot.sendMessage(msg.chat.id, `Pengguna ${username} berhasil dihapus.`);
  } catch (error) {
    console.error('Error deleting user:', error);
    bot.sendMessage(msg.chat.id, `Gagal menghapus pengguna. Error: ${error.message}`);
  }
});

bot.onText(/\/deleteadmin (.+)/, async (msg, match) => {
  try {
    const adminUsername = match[1];
    const chatId = msg.chat.id;
    
    // Implementasi penghapusan administrator dari Pterodactyl
    // Sesuaikan dengan endpoint dan payload yang diperlukan oleh API Pterodactyl
    
    if (msg.from.id.toString() !== ownerContact) {
      bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menggunakan perintah ini.');
      return;
    }
    
    const response = await axios.delete(`${pterodactylApiUrl}/users/${adminUsername}`, {
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    bot.sendMessage(msg.chat.id, `Administrator ${adminUsername} berhasil dihapus.`);
  } catch (error) {
    console.error('Error deleting admin:', error);
    bot.sendMessage(msg.chat.id, `Gagal menghapus administrator. Error: ${error.message}`);
  }
});

// Additional features go here...

// Credits
bot.onText(/\/credits/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Dibuat oleh YudaMods. Berikan kredit jika digunakan.');
});
