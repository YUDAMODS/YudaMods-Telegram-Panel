// By YudaMods
// Taruh Credits
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const pterodactylApiUrl = 'https://pterodactyl.example.com/api/application';
const pterodactylApiKey = 'YOUR_PTERODACTYL_API_KEY';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const startMessage = "Selamat datang di bot Pterodactyl!\n\n" +
    "Berikut adalah fitur yang tersedia:\n" +
    "/addserver [Nama Server] - Menambahkan server baru\n" +
    "/adduser [Nama Pengguna] - Menambahkan pengguna baru\n" +
    "/addadmin [Nama Admin] - Menambahkan administrator baru\n" +
    "/checkuser [Nama Pengguna] - Memeriksa keberadaan pengguna\n" +
    "/checkadmin [Nama Admin] - Memeriksa keberadaan administrator\n" +
    "/deleteserver [Nama Server] - Menghapus server\n" +
    "/deleteuser [Nama Pengguna] - Menghapus pengguna\n" +
    "/deleteadmin [Nama Admin] - Menghapus administrator";
  
  bot.sendMessage(chatId, startMessage);
});

bot.onText(/\/addserver (.+)/, async (msg, match) => {
  try {
    const serverName = match[1];
    
    // Implementasi penambahan server ke Pterodactyl
    const response = await axios.post(`${pterodactylApiUrl}/servers`, {
      name: serverName,
      // Sesuaikan dengan payload yang diperlukan oleh API Pterodactyl
    }, {
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    bot.sendMessage(msg.chat.id, `Server ${serverName} berhasil ditambahkan.`);
  } catch (error) {
    console.error('Error adding server:', error);
    bot.sendMessage(msg.chat.id, `Gagal menambahkan server. Error: ${error.message}`);
  }
});

bot.onText(/\/adduser (.+)/, async (msg, match) => {
  try {
    const username = match[1];
    
    // Implementasi penambahan pengguna ke Pterodactyl
    const response = await axios.post(`${pterodactylApiUrl}/users`, {
      username: username,
      // Sesuaikan dengan payload yang diperlukan oleh API Pterodactyl
    }, {
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    bot.sendMessage(msg.chat.id, `Pengguna ${username} berhasil ditambahkan.`);
  } catch (error) {
    console.error('Error adding user:', error);
    bot.sendMessage(msg.chat.id, `Gagal menambahkan pengguna. Error: ${error.message}`);
  }
});

bot.onText(/\/addadmin (.+)/, async (msg, match) => {
  try {
    const adminUsername = match[1];
    
    // Implementasi penambahan administrator ke Pterodactyl
    const response = await axios.post(`${pterodactylApiUrl}/users`, {
      username: adminUsername,
      // Sesuaikan dengan payload yang diperlukan oleh API Pterodactyl
    }, {
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    // Berikan hak admin kepada pengguna yang baru ditambahkan
    await axios.post(`${pterodactylApiUrl}/users/${response.data.id}/administrative`, null, {
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    bot.sendMessage(msg.chat.id, `Administrator ${adminUsername} berhasil ditambahkan.`);
  } catch (error) {
    console.error('Error adding admin:', error);
    bot.sendMessage(msg.chat.id, `Gagal menambahkan administrator. Error: ${error.message}`);
  }
});

bot.onText(/\/checkuser (.+)/, async (msg, match) => {
  try {
    const username = match[1];
    
    // Implementasi pengecekan keberadaan pengguna di Pterodactyl
    const response = await axios.get(`${pterodactylApiUrl}/users`, {
      params: {
        filter: `username=${username}`,
      },
      headers: {
        Authorization: `Bearer ${pterodactylApiKey}`,
      },
    });

    if (response.data.data.length > 0) {
      bot.sendMessage(msg.chat.id, `User ${username} sudah terdaftar.`);
    } else {
      bot.sendMessage(msg.chat.id, `User ${username} belum terdaftar.`);
    }
  } catch (error) {
    console.error('Error checking user:', error);
    bot.sendMessage(msg.chat.id, `Gagal melakukan pengecekan user. Error: ${error.message}`);
  }
});

bot.onText(/\/checkadmin (.+)/, async (msg, match) => {
  try {
    const adminUsername = match[1];
    
    // Implementasi pengecekan keberadaan administrator di Pterodactyl
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
    
    // Implementasi penghapusan server dari Pterodactyl
    // Sesuaikan dengan endpoint dan payload yang diperlukan oleh API Pterodactyl
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

// ... (kode sebelumnya)

bot.onText(/\/deleteuser (.+)/, async (msg, match) => {
  try {
    const username = match[1];
    
    // Implementasi penghapusan pengguna dari Pterodactyl
    // Sesuaikan dengan endpoint dan payload yang diperlukan oleh API Pterodactyl
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
    
    // Implementasi penghapusan administrator dari Pterodactyl
    // Sesuaikan dengan endpoint dan payload yang diperlukan oleh API Pterodactyl
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
