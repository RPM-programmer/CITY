const path = require("path");
const app = require(path.resolve("server.js")).a;

const L = require(path.resolve("module", "sm.js")).cm;
const PORT = 3000;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(L.ServerInfo(`Сервер запущен и прослушивает ${HOST}:${PORT}`));
});