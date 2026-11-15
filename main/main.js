const Express = require("express");
const app = Express();
const path = require("path");
const public = path.join(__dirname, "..", "public");
const chalk = require("chalk-palette");
const news = require("./db/database.js");
const game = require("./db/readGame.js");
const logger = require("custom-color-logs").print;
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
require("./../plug/sequrity/seq.js")(app);
app.use("/", Express.static(public));
app.get("/home", async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "html", "home.html"));
});
app.get("/", async (req, res) => {
  res.redirect("/home");
});
app.get("/favicon.ico", async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "src", "image.png"));
});
app.get("/api/data", async (req, res) => {
  const newslist = await news.getNews();
  let newsStatus = true;
  if (newslist == null && newslist == undefined) newsStatus = false;
  const gameInfo = await game.get();
  res.json({
    news: newsStatus,
    "news-list": newslist.reverse(),
    "future-game": gameInfo.gameStatus,
    "game-date": gameInfo.game.date,
    "game-time": gameInfo.game.time,
  });
});
app.post("/news/create", async (req, res) => {
  try {
    if (!req.body || !req.body.title || !req.body.text) {
      return res.sendStatus(400);
    }
    const title = req.body.title;
    const text = req.body.text; // Исправлено с res.body на req.body
    await news.create(title, text);
    res.sendStatus(200);
  } catch (err) {
    console.log(logger.ServerError("Ошибка", err.message)); // Исправлена опечатка и вывод ошибки
    res.sendStatus(500);
  }
});
app.post("/game/set", async (req, res) => {
  try {
    if (!req.body || !req.body.time || !req.body.date) {
      return res.sendStatus(400);
    }
    const time = req.body.time;
    const date = req.body.date; // Исправлено с res.body на req.body
    game.set(true, time, date);
    res.sendStatus(200);
  } catch (err) {
    console.log(logger.ServerError("Ошибка", err.message)); // Исправлена опечатка и вывод ошибки
    res.sendStatus(500);
  }
});
app.get("/game/delete", async (req, res) => {
  try {
    game.set(true, "", "");
    res.sendStatus(200);
  } catch (err) {
    console.log(logger.ServerError("Ошибка", err.message));
    res.sendStatus(500);
  }
});
app.get("/game/off", async (req, res) => {
  try {
    game.set(false, "", "");
    res.sendStatus(200);
  } catch (err) {
    console.log(logger.ServerError("Ошибка", err.message));
    res.sendStatus(500);
  }
});
module.exports = app;
