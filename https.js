const path = require("path");
const fs = require("fs"); // Добавили для чтения файлов сертификатов
const https = require("https"); // Добавили модуль HTTPS вместо встроенного в server.js HTTP
const process = require("process");
const os = require("os");
require("dotenv").config();
const L = require(path.resolve("js-module", "log", "sm.js")).cm;
const l = require("./js-module/log/sm.js").cm;

const check = require(path.resolve("moderation", "moderation.js")).moderateText;

const LOGS_FILE = "logs/system/server.log";
const FINE_FILE = "logs/tp-log/e.log"; 
const ISK_FILE = "logs/sud-log/SdbOUI.log";
const Chat_log = "logs/chat-log/chat.log";

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

// 5. Импортируем вашу логику сокетов (если она была внутри server.js, 
// убедитесь, что вы перенесли её обработчики io.on('connection') сюда или импортируете их)
io.on('connection', (socket) => {
  const username = os.userInfo().username;
  console.log(L.SocketInfo(`Пользователь ${username} присоединился к чату (socket id: ${socket.id})`));
  
  const loginTime = new Date();
  const data1 = `\n\n[${loginTime.toISOString()}]\n Пользователь - ${username}\n присоединился к чату\n --------------------\n`;
  
  fs.appendFile(Chat_log, data1, (error) => {
    if (error) console.log(L.ServerFunctionsError("ошибка записи в лог файл", error));
    else console.log(L.ServerFunctionsPositivePerformance("Запись в файл завершена"));
  });

  // Сообщаем всем о новом пользователе
  io.emit('new-user', { username: username });

  // Слушаем сообщения всегда
  socket.on('message', (data) => {
    let msg = data.m;
    let name = data.n || username; // Фолбек на username, если n не передано
    if (!msg) return;

    const messageTime = new Date();
    const result = check(msg);

    if (!result.isAllowed) {
      msg = "Текст содержал мат!";
      const badWord = result.violations[0]?.word || "неизвестно";
      const data2 = `\n[${messageTime.toISOString()}]\n Пользователь - ${name} использовал мат - ${badWord} \n --------------------\n`;
      
      console.log(L.SocketInfo(data));
      fs.appendFile(Chat_log, data2, (err) => {
        if (err) console.log(L.ServerFunctionsError("ошибка записи в лог файл", err));
        else console.log(L.ServerFunctionsPositivePerformance("Запись в файл завершена"));
      });
    }
    
    // Отправка сообщений по комнатам
    if (socket.rooms.has('admin')) {
      io.to('admin').emit('message', { n: name, m: msg });
    } else {
      io.emit('message', { n: name, m: msg });
    }

    const data3 = `\n\n[${messageTime.toISOString()}]\n Пользователь - ${name}\n написал сообщение - ${msg}\n --------------------\n`;
    
    fs.appendFile(Chat_log, data3, (error) => {
      if (error) console.log(L.ServerFunctionsError("ошибка записи в лог файл", error));
      else console.log(L.ServerFunctionsPositivePerformance("Запись в файл завершена"));
    });
  });

  // Команда входа в админку
  socket.on('/adminmode login', (pass) => {
    if (pass === ADMIN_PASSWORD) {
      socket.join('admin');
      console.log(L.SocketEventJoin(username, "admin", socket.id));
      socket.emit('admin-status', { success: true });

      const adminLoginTime = new Date();
      const data4 = `\n\n[${adminLoginTime.toISOString()}]\n Пользователь - ${username}\n присоединился к чату админов\n --------------------\n`;
      
      fs.appendFile(Chat_log, data4, (error) => {
        if (error) console.log(L.ServerFunctionsError("ошибка записи в лог файл", error));
        else console.log(L.ServerFunctionsPositivePerformance("Запись в файл завершена"));
      });
    } else {
      socket.emit('admin-status', { success: false, error: 'Неверный пароль' });
    }
  });

  // Команда выхода из админки
  socket.on("/adminmode exit", () => {
    socket.leave("admin");
    socket.to("admin").emit('event-leave', { username: username });
    console.log(L.SocketEventLeave(username, "admin", socket.id));

    const adminExitTime = new Date();
    const data5 = `\n\n[${adminExitTime.toISOString()}]\n Пользователь - ${username}\n вышел из чата админа\n --------------------\n`;
    
    fs.appendFile(Chat_log, data5, (error) => {
      if (error) console.log(L.ServerFunctionsError("ошибка записи в лог файл", error));
      else console.log(L.ServerFunctionsPositivePerformance("Запись в файл завершена"));
    });
  });

  // Обработка отключения
  socket.on('disconnect', () => {
    console.log(L.SocketEventLeave(username, "home", socket.id));
    socket.leave('admin'); 
    io.emit('event-leave', { username: username });

    const disconnectTime = new Date();
    const data6 = `\n\n[${disconnectTime.toISOString()}]\n Пользователь - ${username}\n вышел из чата\n --------------------\n`;
    
    fs.appendFile(Chat_log, data6, (error) => {
      if (error) console.log(L.ServerFunctionsError("ошибка записи в лог файл", error));
      else console.log(L.ServerFunctionsPositivePerformance("Запись в файл завершена"));
    });
  });
});




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