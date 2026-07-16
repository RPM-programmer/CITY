const path = require("path");
const https = require('https');
const fs = require('fs');

const app = require(path.resolve("server.js"));

// Читаем файлы SSL-сертификата и ключа
const options = {
  key: fs.readFileSync('путь/к/вашему/privkey.pem'),
  cert: fs.readFileSync('путь/к/вашему/fullchain.pem')
};

app.get('/', (req, res) => {
  res.send('Привет, это защищенный HTTPS сервер!');
});

// Создаем и запускаем HTTPS-сервер
https.createServer(options, app).listen(443, () => {
  console.log('Сервер запущен на https://localhost');
});