require("dotenv").config({ debug: false });
const express = require("express");
const cookieParser = require("cookie-parser");
const chalk = require("chalk-palette");
const logger = require("custom-color-logs").print;
const path = require("path");
const fs = require("fs");
require(path.join(__dirname, "env_init.js"));

// Оставляем только импорт самого модуля базы данных
const dbConfig = require(
  path.join(__dirname, "database", "config", "db-init.js"),
);
const server = require("./server/server");
const bcrypt = require("bcrypt");

async function init(app) {
  await chalk.animation.textShimmer("MED-CMS");
  console.log(logger.ServerMedInfo("Запуск сервера..."));
  await chalk.animation.retroLines({
    duration: 4000,
    linesCount: 4,
    offset: 3,
  });

  if (app && typeof app === "function" && typeof app.handle === "function") {
    console.log(logger.ServerMedInfo("Проверка на app пройдена успешно!"));
  } else {
    console.log(logger.ServerMedError("app не передан или повреждён!"));
    return;
  }

  try {
    const dbPath = path.join(__dirname, "db", "med-cms.sqlite");
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { extended: true });
    }

    // Инициализируем БД
    await dbConfig.initDatabase(dbPath);
    console.log(logger.ServerMedInfo("База данных успешно инициализирована"));
  } catch (err) {
    console.log(
      logger.DatabaseError(
        "Критическая ошибка запуска базы данных med-cms:",
        err,
      ),
    );
    return;
  }

  try {
    // ИСПРАВЛЕНИЕ: Достаем User из проинициализированного объекта базы данных ОНЛАЙН
    const User = dbConfig.User;

    const adminExists = await User.findOne({ where: { role: "admin" } });
    if (!adminExists) {
      console.log(
        logger.ServerMedInfo(
          "Администратор не найден. Создание аккаунта по умолчанию...",
        ),
      );
      const adminPassword = process.env.ADMIN_PASSWORD;
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: process.env.ADMIN_GMAIL,
        password: hashedPassword,
        fullName: "Главный Администратор",
        role: "admin",
        specialty: null,
      });
      console.log(
        logger.ServerMedInfo(`Аккаунт суперадмина успешно создан in SQLite.`),
      );
    } else {
      console.log(
        logger.ServerMedInfo("Администратор уже существует в базе данных."),
      );
    }
  } catch (error) {
    console.log(
      logger.ServerMedError(
        "Ошибка при автоматическом создании админа: " + error.message,
      ),
    );
  }

  console.log(logger.ServerMedInfo("Подключение роутов..."));
  const rout = express.Router();
  const med = server(process.env.JWT_SECRET);
  const r_api = med.api;
  const r_web = med.web;

  rout.use(cookieParser());
  rout.use(express.json());
  rout.use(express.urlencoded({ extended: true }));
  rout.use("/med", r_web);
  rout.use("/med/api", r_api);
  app.use("/", rout);
  console.log(logger.ServerMedInfo("Роуты подключены"));
  require(path.join(__dirname, "check_env.js"));
}

module.exports = init;
