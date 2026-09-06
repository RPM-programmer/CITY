const path = require("path");
const fs = require("fs"); // Добавили для чтения файлов сертификатов
const https = require("https"); // Добавили модуль HTTPS вместо встроенного в server.js HTTP
const process = require("process");
const os = require("os");
require("dotenv").config();
const L = require(path.resolve("js-module", "log", "sm.js")).cm;
const l = require("./js-module/log/sm.js").cm;
const chat = require("./chat/chat.js").http;



// 1. Сначала импортируем только app из server.js (настройки роутов)
const { app } = require(path.resolve("server.js")); 

const PORT = process.env.PORTH || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// 2. Читаем файлы SSL-сертификата и ключа
let sslOptions = {};
try {
  sslOptions = {
    key: fs.readFileSync(path.resolve("key.pem")),
    cert: fs.readFileSync(path.resolve("cert.pem"))
  };
} catch (error) {
  console.error(L.ErrorInfo ? L.ErrorInfo(`Ошибка чтения SSL-сертификатов: ${error.message}`) : `Ошибка SSL: ${error.message}`);
  process.exit(1);
}

// 3. Создаем HTTPS сервер на основе настроек Express (app)
const secureServer = https.createServer(sslOptions, app);

// 4. Инициализируем Socket.io прямо здесь и привязываем его к HTTPS серверу
const { Server } = require("socket.io");
const io = new Server(secureServer, {
  cors: {
    origin: "*" // Разрешаем подключение со всех адресов
  }
});

chat(io);




function startServer (){
  try {
    secureServer.listen(PORT, HOST, () => {
      console.log(L.ServerInfo(`Защищенный HTTPS-сервер запущен и прослушивает ${HOST}:${PORT}`));
    });
    return true;
  } catch {
    return false;
  }
}

function stopServer (){
  try {
    secureServer.close();
    return true;
  } catch {
    return false;
  }
}

const argument = process.argv[2];
if (argument == "start"){
  startServer();
}

module.exports = {startServer, stopServer};