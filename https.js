const path = require("path");
const https = require('https');
const fs = require('fs');

const app = require(path.resolve("server.js"));

// Читаем файлы SSL-сертификата и ключа
const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

// Создаем и запускаем HTTPS-сервер
https.createServer(options, app).listen(443, () => {
  console.log('Сервер запущен на https://localhost');
});