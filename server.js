const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

app.post('/send-telegram', (req, res) => {
    const { chatId, message } = req.body;
    const token = '7938596597:AAHuLoRJ7upIhZolf4zeSGOeOBx4v1fXT9o';
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    }).then(response => response.json())
      .then(data => {
          console.log(data);
          res.status(200).send('Message sent');
      })
      .catch(error => {
          console.error(error);
          res.status(500).send('Error sending message');
      });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
