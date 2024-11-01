
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const events = [];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/events', (req, res) => {
    res.json(events);
});

app.post('/events', upload.single('image'), (req, res) => {
    const { title, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    events.push({ title, description, image });
    res.status(201).json({ message: 'Event added successfully!' });
});

app.post('/send-telegram', (req, res) => {
    const { chatId, message, parseMode } = req.body;
    const token = '7938596597:AAHuLoRJ7upIhZolf4zeSGOeOBx4v1fXT9o';
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: parseMode // 'Markdown' или 'HTML'
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

