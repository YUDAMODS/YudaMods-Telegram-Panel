// By YudaMods
// Taruh Credits
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const figlet = require('figlet');
const chalk = require('chalk');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Token Bot Bisa Di Dapatkan Dari t.me/BotFather
const pterodactylApiUrl = 'https://pterodactyl.example.com/api/application'; // Ganti Domain Lu Tanpa Hapus /api/application
const pterodactylApiKey = 'YOUR_PTERODACTYL_API_KEY'; // Ganti Apikey Panel
let ownerContact = 'YOUR_OWNER_NUMBER'; // Ganti dengan nomor kontak owner yang sebenarnya Format Id
const thumbPath = 'YOUR_URL_THUMB'; // Ganti Dengan Url Img Telegram
const youtubeLink = 'https://youtube.com/@YUDAMODS'; // Link YouTube

const bot = new TelegramBot(token, { polling: true });

// Figlet banner
figlet('YudaMods', (err, data) => {
  if (err) {
    console.error('Error rendering figlet:', err);
    return;
  }
  console.log(chalk.blue(data)); // Menggunakan chalk untuk memberikan warna biru
  console.log(chalk.blue('Bot is Running...')); // Menampilkan pesan "Bot is Running..." dengan warna biru
});

// Fungsi untuk menampilkan menu / start
function sendStartMenu(chatId) {
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
    "/getuserid - Mendapatkan ID pengguna\n" +
    "/addowner [ID Pengguna] - Menambahkan owner baru\n" +
    "/runtime - Informasi waktu eksekusi skrip";

  // Menambahkan tombol YouTube
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎬 Kunjungi YouTube', url: youtubeLink }],
      ],
    },
  };

  bot.sendPhoto(chatId, thumbPath, { caption: startMessage, ...keyboard });
}

// Menanggapi /start dan /menu
bot.onText(/\/start|\/menu/, (msg) => {
  const chatId = msg.chat.id;
  sendStartMenu(chatId);
});

// Menanggapi perintah /addserver
bot.onText(/\/addserver (.+)/, async (msg, match) => {
  const startTime = new Date();
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

    const endTime = new Date();
    const executionTime = (endTime - startTime) / 1000; // dalam detik

    bot.sendPhoto(chatId, thumbPath, {
      caption: `Server ${serverName} berhasil ditambahkan.\nWaktu eksekusi: ${executionTime} detik`,
    });
  } catch (error) {
    console.error('Error adding server:', error);
    bot.sendMessage(ownerContact, `Error: ${error.message}`);
    bot.sendPhoto(chatId, thumbPath, {
      caption: 'Gagal menambahkan server.',
    });
  }
});

// Menanggapi perintah /adduser
bot.onText(/\/adduser/, async (msg) => {
  const startTime = new Date();
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

    const endTime = new Date();
    const executionTime = (endTime - startTime) / 1000; // dalam detik

    bot.sendPhoto(chatId, thumbPath, {
      caption: `Pengguna berhasil ditambahkan.\nWaktu eksekusi: ${executionTime} detik`,
    });
  } catch (error) {
    console.error('Error adding user:', error);
    bot.sendMessage(ownerContact, `Error: ${error.message}`);
    bot.sendPhoto(chatId, thumbPath, {
      caption: 'Gagal menambahkan pengguna.',
    });
  }
});

// Menanggapi perintah /addadmin
bot.onText(/\/addadmin (.+)/, async (msg, match) => {
  const startTime = new Date();
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

    const endTime = new Date();
    const executionTime = (endTime - startTime) / 1000; // dalam detik

    bot.sendPhoto(chatId, thumbPath, {
      caption: `Administrator ${adminUsername} berhasil ditambahkan.\nWaktu eksekusi: ${executionTime} detik`,
    });
  } catch (error) {
    console.error('Error adding admin:', error);
    bot.sendMessage(ownerContact, `Error: ${error.message}`);
    bot.sendPhoto(chatId, thumbPath, {
      caption: `Gagal menambahkan administrator. Error: ${error.message}`,
    });
  }
});

// Menanggapi perintah /checkuser
bot.onText(/\/checkuser (.+)/, async (msg, match) => {
  const startTime = new Date();
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
      bot.sendPhoto(chatId, thumbPath, {
        caption: `User ${username} sudah terdaftar.`,
      });
    } else {
      bot.sendPhoto(chatId, thumbPath, {
        caption: `User ${username} belum terdaftar.`,
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    bot.sendMessage(ownerContact, `Error: ${error.message}`);
    bot.sendPhoto(chatId, thumbPath, {
      caption: `Gagal melakukan pengecekan user. Error: ${error.message}`,
    });
  }
});

bot.onText(/\/checkadmin (.+)/, async (msg, match) => {
  try {
    const adminUsername = match[1];
    const chatId = msg.chat.id;

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


bot.onText(/\/getuserid (.+)/, async (msg, match) => {
  try {
    const username = match[1];
    const chatId = msg.chat.id;

    // Pastikan hanya owner yang dapat menggunakan perintah ini

    // Implementasi pengambilan ID pengguna berdasarkan nama pengguna
    const response = await bot.getChat(username);

    if (response && response.id) {
      bot.sendMessage(chatId, `ID pengguna untuk ${username} adalah: ${response.id}`);
    } else {
      bot.sendMessage(chatId, 'Tidak dapat menemukan ID pengguna.');
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
    bot.sendMessage(chatId, `Gagal mendapatkan ID pengguna. Error: ${error.message}`);
  }
  bot.sendPhoto(chatId, thumbPath, { caption: chatId });
});

bot.onText(/\/addowner (.+)/, async (msg, match) => {
  try {
    const newOwnerID = match[1];
    const chatId = msg.chat.id;

    // Pastikan hanya owner yang dapat menggunakan perintah ini
    if (msg.from.id.toString() !== ownerContact) {
      bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menggunakan perintah ini.');
      return;
    }

    // Update ID owner dengan ID baru
    ownerContact = newOwnerID;

    bot.sendMessage(chatId, `Owner berhasil diperbarui. ID owner sekarang: ${newOwnerID}`);
  } catch (error) {
    console.error('Error adding owner:', error);
    bot.sendMessage(chatId, `Gagal menambahkan owner. Error: ${error.message}`);
  }
  bot.sendPhoto(chatId, thumbPath, { caption: chatId });
});


bot.onText(/\/runtime/, (msg) => {
  const uptime = process.uptime();
  const formattedUptime = formatUptime(uptime);
  bot.sendMessage(msg.chat.id, `Bot has been running for: ${formattedUptime}`);
});

// Fungsi untuk mengubah waktu dalam detik menjadi format yang lebih mudah dibaca
function formatUptime(uptime) {
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  return `${hours} jam, ${minutes} menit, ${seconds} detik`;
}

// ...

// Server mendengarkan pada port tertentu
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// Additional features go here...

// Credits
bot.onText(/\/credits/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Dibuat oleh YudaMods. Berikan kredit jika digunakan.');
});

bot.onText(/\/owner/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Dibuat oleh YudaMods. Berikan kredit jika digunakan.');
});
