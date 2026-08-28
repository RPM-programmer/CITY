// Файл запуска (например, index.js или start.js)
const path = require("path");
const { app, server } = require(path.resolve("server.js")); // Нам нужны оба объекта!
const process = require("process");
require("dotenv").config();
const L = require(path.resolve("js-module", "log", "sm.js")).cm;

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";


function startServer (){
  try {
    server.listen(PORT, HOST, () => {
      console.log(L.ServerInfo(`Сервер запущен и прослушивает ${HOST}:${PORT}`));
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