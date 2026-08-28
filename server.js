// Встроенные модули Node.js (глобальные тоже можно не импортировать)
const http = require("http");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Сторонние библиотеки
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const {default:chalk} = require("chalk");
const { Server } = require("socket.io");
const { b } = require("./js-module/bank/database.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// свои (вложенные)
const BD = require(path.resolve("js-module","bank", "database.js")).b;
const L = require(path.resolve("js-module", "log", "sm.js")).cm;
const check = require(path.resolve("moderation", "moderation.js")).moderateText;
const G = require(path.resolve("bot", "gmail_bot.js")).G;
const T = require(path.resolve("js-module", "bank", "tokens.js")).t;

// пароли 
const ADMIN_PASSWORD = process.env.CHAT_ADMIN_PASSWORD || 1000; 
var tokens = [];

// Константы для лог-файлов
const LOGS_FILE = "logs/system/server.log";
const FINE_FILE = "logs/tp-log/e.log"; 
const ISK_FILE = "logs/sud-log/SdbOUI.log";
const Chat_log = "logs/chat-log/chat.log";


// пути для файлов (абсолютные)
const mesegger = path.resolve("html", "mesegger.html");
const home = path.resolve("html", "MyCity.html");
const bank = path.resolve("html", "bank_market.html")
const admin = path.resolve("html", "admin.html");
const forAdmin = path.resolve("html", "for_admin.html");
const mvd = path.resolve("html", "mvd.html");
const pravo = path.resolve("html", "pravo.html");
const user = path.resolve("html", "users.html");
const flag = path.resolve("photo", "flag.png");
const mvdIcon = path.resolve("photo", "mvd.png");
const gaiIcon = path.resolve("photo", "GAI.png");
const policeIcon = path.resolve("photo", "Milicia.png");
const kgbIcon = path.resolve("photo", "kgbIcon.png");
const sudIcon = path.resolve("photo", "SUD.png");
const hospitalIcon = path.resolve("photo", "hospitalIcon.png");
const mivoIcon = path.resolve("photo", "MIVO.png");
const psIcon = path.resolve("photo", "psIcon.png");
const chanelQRcode = path.resolve("photo", "gameChanelQR.png");


// функция отправки файла
async function serveFile(filePath, res) {
  // MIME типы для файлов
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.json': 'application/json'
  };

  // получение типа файла
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  // чтение и отправка файла
  try {
    const data = await fs.promises.readFile(filePath);
    res.setHeader('Content-Type', contentType);
    res.send(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).send('Ресурс не найден!');
    } else {
      console.error(L.ServerFunctionsError(`Ошибка чтения файла ${filePath}:`, error));
      res.status(500).send('Внутренняя ошибка сервера');
    }
  }
}

// функция логгирования текста
function requestLogger(req, res, next) {
  const now = new Date();
  const logData = 
    `[${now.toISOString()}]\n` +
    `  User: ${os.userInfo().username}\n` +
    `  URL: ${req.originalUrl || req.url}\n` +
    `  Method: ${req.method}\n` +
    `  User-Agent: ${req.get("user-agent")}\n` +
    `--------------------\n`;

  fs.appendFile(LOGS_FILE, logData, (error) => {
    if (error) {
      console.error(L.ServerFunctionsError("Ошибка записи в лог-файл:", error));
    }
    next();
  });
}

// установка лимита
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 15,             // Максимум 15 запросов
  handler: (req, res) => {
    res.status(429).send(`
      <h1 style='color:red;'>Доступ запрещен!</h1>
      <h2>Превышен лимит запросов (${limiter.max} запросов в минуту). Попробуйте позже.</h2>
    `);
  },
  legacyHeaders: false
});

// настройка политики cors
// разрешённые сайты (домены)
const whitelist = ['http://localhost:3000', "https://localhost:3000", 'http://192.168.0.107:3000', "https://192.168.0.107:3000", 'http://192.168.1.14:3000', 'https://192.168.1.14:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Не разрешено политикой CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);

// сервер
app.get("/", (req, res) => {
  res.redirect("/home");
});
app.get("/messager", async (req, res) => {
  res.sendFile(mesegger)
});
app.get("/flag", async (req, res) => {
  serveFile(flag, res);
});
app.get("/mvd-icon", async (req, res) => {
  serveFile(mvdIcon, res);
});
app.get("/gai-icon", async (req, res) => {
  serveFile(gaiIcon, res);
});
app.get("/police-icon", async (req, res) => {
  serveFile(policeIcon, res);
});
app.get("/kgb-icon", async (req, res) => {
  serveFile(kgbIcon, res);
});
app.get("/sud-icon", async (req, res) => {
  serveFile(sudIcon, res);
});
app.get("/hospital-icon", async (req, res) => {
  serveFile(hospitalIcon, res);
});
app.get("/mivo-icon", async (req, res) => {
  serveFile(mivoIcon, res);
});
app.get("/ps", async (req, res) => {
  serveFile(psIcon, res);
});
app.get("/home", async (req, res) => {
  res.sendFile(home);
});
app.get("/bank", async (req, res) => {
  res.sendFile(bank);
});
app.get("/mvd", async (req, res) => {
  res.sendFile(mvd);
});
app.get("/pravo", async (req, res) => {
  res.sendFile(pravo);
});
app.get("/api/un", function(req, res){
  res.send(os.userInfo().username);
});
app.get("/bank/login/:id/:token", function(req, res){
    const { id, token } = req.params; // Получение данных из URL
    
    const index = tokens.indexOf(token);
    if(index !== -1){
      tokens.slice(index, 1);
      try {
        (async () => {
          const result = await BD.unblockAccount(id, "1000");
          if(result){
          res.send("Личность потверждена! Щёт разблокирован.");
        } else {
          res.send("Неизвестная ошибка сервера!");
        }
        })();
      } catch {
        res.send("Ошибка сервера!");
      }
    }else{
      res.send("Неправильный токен!");
    }
});
app.get("/bank/help/:token", function(req, res){
  const {token} = req.params; // Получение данных из URL
    const result =  T.findToken(token);
    if(result !== null){
      res.send("Аккаунт подтверждён!");
    } else {
      res.send("Аккаунт не подтвержён! (Возможно истекло время подтверждения)");
    }
});



// банк
app.post("/bank/getNewToken", express.urlencoded({extended: false}), async (req, res) =>{
  const {id, password} = req.body;
  const result = await BD.getToken(id, password);
  if(result.status){
    res.send("<h1 style='color:blue'>Токет отправлен!</h1><a href='/bank'>В банк...</a>");
  } else {
    if(result.statusCode == -1){
      res.send("<h1 style='color:blue'>Токет не отправлен!</h1><h2>Неправлильнай пароль</h2><a href='/bank'>В банк...</a>");
    } else if(result.statusCode == 2){
      res.status(500).send("<h1 style='color:blue'>Токет не отправлен!</h1><h2>Ошибка сервера</h2><a href='/bank'>В банк...</a>");
    }
  }
});
app.post("/tm", limiter, express.urlencoded({ extended: false }), async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Необходимо предоставить данные для перевода.");
  }
  const { to, from, password, manny } = req.body;
  try {
    const result = await BD.transferManny(from, to, manny, password);
    if (result.t) {
      res.send(`<h1 style='color:green'>Успешный перевод!</h1><h2>Сумма: ${manny}р</h2><a href='/bank'>Вернуться в банк</a>`);
    } else {
      if(result.c == -1){
        res.status(500).send("<h1 style='color:red'>Перевод не удался!</h1><h2>Ошибка базы данных!</h2><a href='/bank'>Вернуться в банк</a>");
      } else if(result.c == 1){
        res.status(400).send("<h1 style='color:red'>Перевод не удался!</h1><p>Проверьте данные и повторите попытку.</p><a href='/bank'>Вернуться в банк</a>");
      } else  if(result.c == 2){
        res.status(400).send("<h1 style='color:red'>Перевод не удался!</h1><p>Отправитель заблокирован!</p><a href='/bank'>Вернуться в банк</a>");
      } else if(result.c == 3) {
        res.status(400).send("<h1 style='color:red'>Перевод не удался!</h1><p>Получатель заблокирован!.</p><a href='/bank'>Вернуться в банк</a>");
      } else if(result.c == 4){
        res.status(400).send("<h1 style='color:red'>Перевод не удался!</h1><p>Недостаточно денег у отправителя!</p><a href='/bank'>Вернуться в банк</a>");
      }
      
    }
  } catch (error) {
    console.error("Ошибка при переводе средств:", error);
    res.status(500).send("<h1>Внутренняя ошибка сервера</h1><p>Не удалось выполнить перевод.</p><a href='/bank'>Вернуться в банк</a>");
  }
});
app.post("/d", limiter, express.urlencoded({ extended: false }), async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Необходимо предоставить данные для удаления.");
  }
  const { id, password } = req.body;

  try {
    const result = await BD.deleteAccount(id, password);
    if (result) {
      res.send(`<h1>Аккаунт с ID ${id} успешно удален.</h1><a href='/bank'>Вернуться в банк</a>`);
    } else {
      res.status(400).send("<h1>Удаление не удалось!</h1><p>Неверный ID или пароль.</p><a href='/bank'>Вернуться в банк</a>");
    }
  } catch (error) {
    console.error("Ошибка при удалении аккаунта:", error);
    res.status(500).send("<h1>Внутренняя ошибка сервера</h1><p>Не удалось удалить аккаунт.</p><a href='/bank'>Вернуться в банк</a>");
  }
});
app.post("/b", limiter, express.urlencoded({ extended: false }), async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Необходимо предоставить данные для блокировки.");
  }
  const { id, password } = req.body;
  try {
    const result = await BD.blockAccount(id, password);
    if (result) {
      res.send(`<h1>Аккаунт с ID ${id} успешно заблокирован.</h1><a href='/bank'>Вернуться в банк</a>`);
    } else {
      res.status(400).send("<h1>Блокировка не удалась!</h1><p>Неверный ID или пароль.</p><a href='/bank'>Вернуться в банк</a>");
    }
  } catch (error) {
    console.error("Ошибка при блокировке аккаунта:", error);
    res.status(500).send("<h1>Внутренняя ошибка сервера</h1><p>Не удалось заблокировать аккаунт.</p><a href='/bank'>Вернуться в банк</a>");
  }
});
app.post('/cba', limiter, express.urlencoded({ extended: false }), async (req, res) => {
    if (!req.body) {
        return res.status(400).send('Необходимо предоставить данные для создания аккаунта.');
    }
    const { name, password, email } = req.body;
    function et() {
        let i = 0;
        let e = '';
        while (i < 10) {
            e += Math.floor(Math.random() * 10);
            i++;
        }
        return e;
    }
    const fl = et();
    tokens.push(fl);
    try {
        const result = await BD.creatNew(name, password, email);
        if (result) {
            await BD.blockAccount(result, "1000");
            G.GBSendCBA(
                email, 
                'Банк', 
                `Здравствуйте, <b>${name}</b>! Мы заметили, что <span style="color:blue"><i>на ваш gmail адрес был зарегистрирован счет (ID - ${result})</i></span>. В данный момент ваш счет заблокирован, чтобы его разблокировать, подтвердите аккаунт (нажмите на кнопку). Если это не вы: <ul><li>1. Не подтверждайте аккаунт!</li><li>2. Сделайте скриншот экрана.</li><li>3. Напишите в поддержку и отправьте скриншот экрана.</li></ul>`, 
                fl, 
                'был зарегистрирован счет на ваш gmail адрес', 
                name,
                result
            );
            res.send(`<h1>Аккаунт создан успешно!</h1><h2>Имя: ${name}</h2><h2>Email: ${email}</h2><h2>ID: ${result}</h2><a href="/bank">Вернуться в банк</a>`);
        } else {
            res.status(400).send('<h1>Создание аккаунта не удалось!</h1><p>Проверьте введенные данные.</p><a href="/bank">Вернуться в банк</a>');
        }
    } catch (error) {
        console.error('Ошибка при создании нового аккаунта:', error);
        res.status(500).send('<h1>Внутренняя ошибка сервера</h1><p>Не удалось создать аккаунт.</p><a href="/bank">Вернуться в банк</a>');
    }
});
app.post("/j", limiter, express.urlencoded({ extended: false }), async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Необходимо предоставить данные для поиска баланса.");
  }
  const { id, password } = req.body;
  try {
    const result = await BD.getManny(id, password);
    if (result !== null && result !== undefined) {
      res.send(`<h1>Баланс успешно найден!</h1><h2>Ваш баланс: ${result}</h2><a href='/bank'>Вернуться в банк</a>`);
    } else {
      res.status(404).send("<h1>Поиск баланса не удался!</h1><p>Неверный ID или пароль.</p><a href='/bank'>Вернуться в банк</a>");
    }
  } catch (error) {
    console.error("Ошибка при поиске баланса:", error);
    res.status(500).send("<h1>Внутренняя ошибка сервера</h1><p>Не удалось найти баланс.</p><a href='/bank'>Вернуться в банк</a>");
  }
});
app.post("/ub", limiter, express.urlencoded({ extended: false }), async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Необходимо предоставить данные для разблокировки.");
  }
  const { id, password } = req.body;
  try {
    const result = await BD.unblockAccount(id, password);
    if (result) {
      res.send(`<h1>Аккаунт с ID ${id} успешно разблокирован.</h1><a href='/bank'>Вернуться в банк</a>`);
    } else {
      res.status(400).send("<h1>Разблокировка не удалась!</h1><p>Неверный ID или пароль.</p><a href='/bank'>Вернуться в банк</a>");
    }
  } catch (error) {
    console.error("Ошибка при разблокировке аккаунта:", error);
    res.status(500).send("<h1>Внутренняя ошибка сервера</h1><p>Не удалось разблокировать аккаунт.</p><a href='/bank'>Вернуться в банк</a>");
  }
});
app.post("/s", limiter, express.urlencoded({ extended: false }), async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Необходимо предоставить данные для списания.");
  }
  const { id, password, count } = req.body;
  try {
    const result = await BD.subtractManny(id, count, password);
    if (result) {
      res.send(`<h1>Списание успешно!</h1><h2>Списано: ${count}р</h2><a href='/bank'>Вернуться в банк</a>`);
    } else {
      res.status(400).send("<h1>Списание не удалось!</h1><p>Неверный ID, пароль или недостатчно средств.</p><a href='/bank'>Вернуться в банк</a>");
    }
  } catch (error) {
    console.error("Ошибка при списании средств:", error);
    res.status(500).send("<h1>Внутренняя ошибка сервера</h1><p>Не удалось списать средства.</p><a href='/bank'>Вернуться в банк</a>");
  }
});
app.post("/a", limiter, express.urlencoded({ extended: false }), async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Необходимо предоставить данные для добавления средств.");
  }
  const { id, password, count } = req.body;
  try {
    const result = await BD.addManny(id, count, password);
    if (result) {
      res.send(`<h1>Добавление успешно!</h1><h2>Добавлено: ${count}р</h2><a href='/bank'>Вернуться в банк</a>`);
    } else {
      res.status(400).send("<h1>Добавление не удалось!</h1><p>Неверный ID или пароль.</p><a href='/bank'>Вернуться в банк</a>");
    }
  } catch (error) {
    console.error("Ошибка при добавлении средств:", error);
    res.status(500).send("<h1>Внутренняя ошибка сервера</h1><p>Не удалось добавить средства.</p><a href='/bank'>Вернуться в банк</a>");
  }
});
app.post("/si", limiter, express.urlencoded({ extended: false }), (req, res) => {
  if (!req.body) {
    return res.status(400).send("Необходимо предоставить данные для искового заявления.");
  }
  const now = new Date();
  const { on, odn, name, surname, surnameT, r, oname, osurname, osurname2, naru } = req.body;
  const data = `\n\n[${now.toISOString()}]\nИсковое заявление:\n` +
               `  На имя: ${odn} ${on}\n` +
               `  Заявитель: ${name} ${surname} ${surnameT}\n` +
               `  Район: ${r}\n` +
               `  Ответчик: ${oname} ${osurname} ${osurname2}\n` +
               `  Причина: ${naru || 'не указана'}\n` +
               `  Прошу разобраться в деле.\n` +
               `--------------------\n`;
  fs.appendFile(ISK_FILE, data, (error) => {
    if (error) {
      console.error("Ошибка записи в файл исков:", error);
      return res.status(500).send("<h1>Ошибка сервера</h1><p>Не удалось сохранить исковое заявление.</p><a href='/mvd'>Вернуться</a>");
    }
    console.log("Запись файла исков завершена");
    res.redirect("/mvd");
  });
});
app.post("/wf", limiter, express.urlencoded({ extended: false }), (req, res) => {
    if(!req.body) {
        return res.status(400).send("Необходимо предоставить данные для штрафа.");
    }
    const { c, n, p } = req.body;
    const correctPassword = "iawitp";
    if (p === correctPassword) {
        const now = new Date();
        const data = `\n\n[${now.toISOString()}]\nШтраф:\n` +
                     `  Автомобиль: ${c}\n` +
                     `  Нарушение: ${n}\n` +
                     `  Записано: ${now.toLocaleString()}\n` +
                     `--------------------\n`;
        fs.appendFile(FINE_FILE, data, (error) => {
            if (error) {
                console.error("Ошибка записи в файл штрафов:", error);
                return res.status(500).send("<h1>Ошибка сервера</h1><p>Не удалось сохранить информацию о штрафе.</p><a href='/mvd'>Вернуться</a>");
            }
            console.log("Запись файла штрафов завершена");
            res.redirect("/mvd");
        });
    } else {
        res.status(401).send("<h1>Доступ запрещен!</h1><p>Неверный пароль для записи информации о штрафах.</p><a href='/mvd'>Вернуться</a>");
    }
});
// Socket
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



// Обработчик для несуществующих маршрутов
app.use((req, res) => {
  res.status(404).send("<h1>404 - Страница не найдена</h1>");
});

// Обработчик ошибок сервера
app.use((err, req, res, next) => {
  console.error(L.ServerFunctionsError("Внутренняя ошибка сервера", err.stack));
  res.status(500).send("<h1>500 - Внутренняя ошибка сервера</h1>");
});

// В конце server.js
module.exports = {
  app: app,
  server: server // Обязательно экспортируем server!
};