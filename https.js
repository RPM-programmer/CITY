require("dotenv").config();
const process = require("process");
const path = require("path");
const https = require('https');
const fs = require('fs');
const helmet = require("helmet");
const { Server } = require("socket.io");

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

const app = express();

app.use(helmet());

// Создаем и запускаем HTTPS-сервер
const server = https.createServer(options, app);

// Подключаем Socket.IO к HTTPS серверу
const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000", // Убедитесь, что указываете правильный домен
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`Пользователь подключился (ID: ${socket.id})`);
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Сервер запущен на https://localhost:${process.env.PORT || 3000}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Ошибка: Порт ${process.env.PORT || 3000} уже используется. Попробуйте другой порт или освободите этот.`);
  } else {
    console.error(`Ошибка сервера: ${err.message}`);
  }
  process.exit(1);
});

// Обработчик всех маршрутов
app.all('*', (req, res) => {
  res.sendFile(path.resolve("html", "MyCity.html")); // Замените на путь к вашему HTML файлу
});
