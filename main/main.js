const BANK = require("sequelize-game-bank");
const MED = require("med-cms");
const Express = require("express");
const app = Express();
const path = require("path");
const public = path.join(__dirname, "..", "public");
// Глобальные парсеры (исправление ошибки 400 из прошлого шага)
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use("/", Express.static(public));
app.get("/home", async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "html", "home.html"));
});
app.get("/", async (req, res) => {
  res.redirect("/home");
});
(async () => {
  try {
    // 1. Инициализируем модули
    await MED(app);
    await BANK(app);

    // 2. Запускаем сервер ТОЛЬКО после успешной инициализации всех баз данных и роутов
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `\x1b[32m[SERVER]\x1b[0m Сервер успешно запущен на http://0.0.0:${PORT}`,
      );
    });
  } catch (error) {
    console.error("Критическая ошибка инициализации сервера:", error);
    process.exit(1); // Выходим с ошибкой, если бэкенд не смог запуститься
  }
})();

// Экспорт можно оставить на случай тестов, но для запуска он больше не нужен
module.exports = { app };
