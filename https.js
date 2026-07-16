const path = require("path");
const https = require('https');
const fs = require('fs');
const helmet = require("helmet");
const app = require(path.resolve("server.js")).a;

// Пути к файлам сертификатов
const sslKeyPath = path.join(__dirname, 'key.pem');
const sslCertPath = path.join(__dirname, 'cert.pem');

let options = {};

try {
  // Читаем файлы SSL-сертификата и ключа
  options = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath)
  };
} catch (error) {
  console.error(`Ошибка при чтении SSL-сертификатов: ${error.message}`);
  console.error(`Убедитесь, что файлы ${sslKeyPath} и ${sslCertPath} существуют.`);
  process.exit(1); // Завершаем процесс, если сертификаты не найдены
}

app.use(helmet());

const port = 3000;

// Создаем и запускаем HTTPS-сервер
const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Сервер запущен на https://localhost:${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Ошибка: Порт ${port} уже используется. Попробуйте другой порт или освободите этот.`);
  } else {
    console.error(`Ошибка сервера: ${err.message}`);
  }
  process.exit(1);
});
