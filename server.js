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

// Serve HTML directly from the server
app.get('/', (req, res) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Location</title>
        <script>
          function sendLocation() {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const locationUrl = \`/send-location?lat=\${lat}&lon=\${lon}\`;
                fetch(locationUrl)
                  .then(response => response.text())
                  .then(data => alert('Location sent successfully!'))
                  .catch(error => alert('Error sending location.'));
              });
            } else {
              alert('Geolocation is not supported by this browser.');
            }
          }
        </script>
      </head>
      <body>
        <h1>Live Location Tracker</h1>
        <button onclick="sendLocation()">Send My Location</button>
      </body>
    </html>
  `;
  res.send(htmlContent);
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
