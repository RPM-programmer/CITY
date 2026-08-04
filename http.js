// Файл запуска (например, index.js или start.js)
const path = require("path");
const { app, server } = require(path.resolve("server.js")); // Нам нужны оба объекта!
const process = require("process");
require("dotenv").config();
const L = require(path.resolve("module", "sm.js")).cm;

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// ЗАПУСКАЕМ server, а не app!
server.listen(PORT, HOST, () => {
  console.log(L.ServerInfo(`Сервер запущен и прослушивает ${HOST}:${PORT}`));
});
