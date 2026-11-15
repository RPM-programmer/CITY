const fs = require("fs");
const path = require("path");
const ALLOWED_IPS = ["127.0.0.1", "46.53.248.243", "46.56.208.218"];
function checkAdminIp(req, res, next) {
  const forwarded = req.headers["x-forwarded-for"];
  const rawIp = forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress;
  const clientIp = rawIp.replace(/^::ffff:/, "");
  if (!ALLOWED_IPS.includes(clientIp)) {
    return res.status(403).send("Доступ запрещён");
  }
  next();
}

module.exports = function log(app) {
  app.enable("trust proxy");
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const timestamp = new Date().toISOString();
      const ip = req.ip || req.connection.remoteAddress;
      const method = req.method;
      const url = req.originalUrl;
      const status = res.statusCode;
      const logLine = `[${timestamp}] IP: ${ip} | ${method} ${url} | Status: ${status} | ${duration}ms\n`;
      fs.appendFile(
        path.join(__dirname, "log", "access.log"),
        logLine,
        (err) => {
          if (err) console.error("Ошибка записи лога в файл:", err);
        },
      );
    });
    next();
  });
  app.use(
    ["/admin", "/game.html", "/news.html", "/game/set", "/news/create"],
    checkAdminIp,
  );
};
